<template>
    <div class="starsContainer" ref="containerRef">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const setCanvasSize = () => {
    if (!canvasRef.value || !containerRef.value) return;
    const canvas = canvasRef.value;
    const containerRect = containerRef.value.getBoundingClientRect();
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;
};

// 星星对象池
const STAR_POOL_SIZE = 50;
let starPool: Star[] = [];
let activeStars: Star[] = []; // 活跃星星数组，避免每次遍历

class Star {
    x: number = 0;
    y: number = 0;
    size: number = 0;
    speed: number = 0;
    alpha: number = 0;
    grow: boolean = true;
    growTarget: number = 0;
    active: boolean = false;

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
            this.alpha += 0.1;
            this.size += 0.01;
            if (this.size >= this.growTarget && this.alpha >= 1) {
                this.grow = false;
            }
        } else {
            this.alpha += Math.random() > 0.7 ? -0.3 : 0.3;
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
    starPool = [];
    activeStars = [];
    for (let i = 0; i < STAR_POOL_SIZE; i++) {
        starPool.push(new Star());
    }
};

// 获取可用星星
const getStar = (): Star | null => {
    const star = starPool.find(s => !s.active);
    if (star) {
        star.active = true;
        activeStars.push(star);
        return star;
    }
    return null;
};

// 将星星返回池中
const returnStar = (star: Star) => {
    star.reset();
    const idx = activeStars.indexOf(star);
    if (idx > -1) activeStars.splice(idx, 1);
};

// 动画循环
let animationFrameId: number | null = null;
let lastFrameTime = 0;
const FRAME_INTERVAL = 50; // 20fps

const animate = (currentTime: number) => {
    if (!canvasRef.value) return;
    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 节流：控制帧率
    if (currentTime - lastFrameTime < FRAME_INTERVAL) {
        animationFrameId = requestAnimationFrame(animate);
        return;
    }
    lastFrameTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 只更新活跃星星
    for (let i = activeStars.length - 1; i >= 0; i--) {
        const star = activeStars[i];
        if (!star) continue;
        star.update();
        star.draw(ctx);

        if (star.x > canvas.width + star.size || star.y + star.size < 0 || star.alpha <= 0) {
            returnStar(star);
        }
    }

    // 添加新星星
    if (Math.random() < 0.3) {
        const newStar = getStar();
        if (newStar) {
            newStar.x = Math.random() * canvas.width;
            newStar.y = Math.random() * canvas.height;
            newStar.size = 0;
            newStar.alpha = 0;
            newStar.speed = Math.random() + 1;
            newStar.growTarget = Math.random() * 2;
            newStar.grow = true;
        }
    }

    animationFrameId = requestAnimationFrame(animate);
};

const startAnimation = () => {
    if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(animate);
    }
};

const stopAnimation = () => {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
};

// 可见性检测：页面隐藏时暂停动画
const handleVisibilityChange = () => {
    if (document.hidden) {
        stopAnimation();
    } else {
        startAnimation();
    }
};

onMounted(() => {
    initStarPool();
    setCanvasSize();
    startAnimation();
    window.addEventListener('resize', setCanvasSize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
    stopAnimation();
    window.removeEventListener('resize', setCanvasSize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<style scoped>
.starsContainer {
    width: 100%;
    height: 100%;
    color: rgb(255, 255, 0);
}
</style>
