<template>
    <div class="starsContainer" ref="containerRef">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const setCanvasSize = () => {
    if (!canvasRef.value) return;
    if (!containerRef.value) return;
    const canvas = canvasRef.value;
    const containerRect = containerRef.value.getBoundingClientRect();
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;
};

// 星星对象池
const STAR_POOL_SIZE = 100;
let starPool: Star[] = [];

class Star {
    x: number;
    y: number;
    size: number;
    speed: number;
    alpha: number;
    grow: boolean;
    growTarget: number;
    active: boolean; // 是否激活

    constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.growTarget = 0;
        this.speed = 0;
        this.alpha = 0;
        this.grow = true;
        this.active = false;
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.growTarget = 0;
        this.speed = 0;
        this.alpha = 0;
        this.grow = true;
        this.active = false;
    }


    update() {
        const angle = Math.random() * Math.PI / 6;
        this.x += this.speed * Math.cos(angle);
        this.y -= this.speed * Math.sin(angle);
        if (this.grow) {
            this.alpha += 0.1
            this.size += 0.01;
            if (this.size >= this.growTarget && this.alpha >= 1) {
                this.grow = false;
            }
        } else {
            if (Math.random() > 0.7) {
                this.alpha -= 0.3;
            } else {
                this.alpha += 0.3;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 255, ${this.alpha})`;
        ctx.fill();
    }
}

// 初始化星星对象池
const initStarPool = () => {
    for (let i = 0; i < STAR_POOL_SIZE; i++) {
        starPool.push(new Star());
    }
};

// 从池中获取一个可用星星
const getStar = (): Star | null => {
    const star = starPool.find(s => !s.active);
    if (star) {
        star.active = true;
        return star;
    }
    return null; // 池已满
};

// 将星星返回池中
const returnStar = (star: Star) => {
    star.reset();
};

// 动画循环
const animate = () => {
    if (!canvasRef.value) return;
    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新并绘制所有激活的星星
    starPool.forEach(star => {
        if (star.active) {
            star.update();
            star.draw(ctx);

            // 如果星星移出屏幕或完全透明，则返回池中
            if (star.x > canvas.width + star.size || star.y + star.size < 0 || star.alpha <= 0) {
                returnStar(star);
            }
        }
    });

    // 添加新星星（从池中获取）
    if (Math.random() < 0.3) {
        const newStar = getStar();
        if (newStar) {
            // 随机初始化位置和属性
            newStar.x = Math.random() * canvas.width;
            newStar.y = Math.random() * canvas.height;
            newStar.size = 0;
            newStar.alpha = 0;
            newStar.speed = Math.random() + 1;
            newStar.growTarget = Math.random() * 2;
            newStar.grow = true;
        }
    }

    // requestAnimationFrame(animate);
};

onMounted(() => {
    initStarPool();
    setCanvasSize();
    // animate();
    setInterval(animate, 1000 / 30);

    document.addEventListener('resize', setCanvasSize);
})
</script>

<style scoped>
.starsContainer {
    width: 100%;
    height: 100%;
    color: rgb(255, 255, 0)
}
</style>