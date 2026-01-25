<template>
    <footer class="footer">
        <div class="container">
            <div class="footer-main-content">
                <div class="footer-column">
                    <h4>CWXU - Algo</h4>
                    <p class="description">CWXU - Algo，您的学习帮手。</p>
                    <div class="social-icons">
                        <a href="https://github.com/WXUProjects/CWXU-Algo-Frontend" target="_blank" title="GitHub">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 1024 1024">
                                <path
                                    d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5C64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9c26.4 39.1 77.9 32.5 104 26c5.7-23.5 17.9-44.5 34.7-60.8c-140.6-25.2-199.2-111-199.2-213c0-49.5 16.3-95 48.3-131.7c-20.4-60.5 1.9-112.3 4.9-120c58.1-5.2 118.5 41.6 123.2 45.3c33-8.9 70.7-13.6 112.9-13.6c42.4 0 80.2 4.9 113.5 13.9c11.3-8.6 67.3-48.8 121.3-43.9c2.9 7.7 24.7 58.3 5.5 118c32.4 36.8 48.9 82.7 48.9 132.3c0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9c177.1-59.7 304.6-227 304.6-424.1c0-247.2-200.4-447.3-447.5-447.3z"
                                    fill="currentColor"></path>
                            </svg>
                        </a>
                    </div>
                </div>
                <div class="footer-column">
                    <h4>联系我们</h4>
                    <p>QQ: 123456789</p>
                    <p>Email: 123@example.com</p>
                </div>
                <div class="footer-column">
                    <h4>快速链接</h4>
                    <ul>
                        <li><router-link to="/">首页</router-link></li>
                    </ul>
                </div>
            </div>
            <div class="footer-column">
                <span class="footer-column-title">友情链接: </span>

                <span style="margin-left: 10px;font-size:13.7px;">
                    <a :href="'https://www.cwxu.edu.cn/'" target="_blank" rel="noopener noreferrer">无锡学院</a>
                </span>

            </div>
            <hr class="footer-divider">
            <div class="footer-bottom">
                <p><!-- &copy; {{ currentYear }} zhiyuansofts. 保留所有权利. -->
                    <!-- <br /> -->
                    ♥ Designed by <a href="https://github.com/AoralsFout" target="_blank">AoralsFout</a>、<a href="https://github.com/srcenchen" target="_blank">srcenchen</a>、<a href="https://github.com/hyhgfrgh" target="_blank">hyhgfrgh</a>.
                </p>
                <div class="build-info">
                    <svg class="git-icon" width="16" height="16" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
                        <path
                            d="M416 160a64 64 0 1 0-96.27 55.24c-2.29 29.08-20.08 37-75 48.42c-17.76 3.68-35.93 7.45-52.71 13.93v-126.2a64 64 0 1 0-64 0v209.22a64 64 0 1 0 64.42.24c2.39-18 16-24.33 65.26-34.52c27.43-5.67 55.78-11.54 79.78-26.95c29-18.58 44.53-46.78 46.36-83.89A64 64 0 0 0 416 160zM160 64a32 32 0 1 1-32 32a32 32 0 0 1 32-32zm0 384a32 32 0 1 1 32-32a32 32 0 0 1-32 32zm192-256a32 32 0 1 1 32-32a32 32 0 0 1-32 32z"
                            fill="currentColor"></path>
                    </svg>

                    <span>Build {{ gitHash }} - {{ formattedDate }}</span>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">

const currentYear = new Date().getFullYear();

const gitHash = __GIT_HASH__;
const gitDate = __GIT_DATE__;

const formattedDate = new Date(gitDate).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
});
</script>

<style scoped>
.footer {
    width: 100%;
    padding: 3rem 20px;
    text-align: left;
    font-size: 14px;
    position: relative;
    border-top: solid 1px var(--divider-color);
    color: var(--text-default-color);
}

.container {
    margin: 0 auto;
    padding: 0 2rem;
}

.footer-main-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer-column {
    flex: 1;
    min-width: 220px;
}

.footer-main-content .footer-column:first-child {
    flex: 2;
}

.footer-column h4 {
    margin-bottom: 1rem;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.footer-column p,
.footer-column ul li {
    margin-bottom: 0.5rem;
}

.footer-column .description {
    line-height: 1.6;
}

.footer-column ul {
    list-style: none;
    padding: 0;
}

.social-icons {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
}

.social-icons svg {
    width: 24px;
    height: 24px;
}

.footer-divider {
    border: none;
    height: 1px;
    margin: 2rem 0;
    background-color: var(--divider-color);
}

.footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: left;
    flex-wrap: nowrap;
    gap: 1rem;
    font-size: 14px;
}

.footer-bottom p {
    margin: 0.5rem 0;
}

.build-info {
    display: flex;
    align-items: left;
    justify-content: flex-end;
    font-size: 12px;
    color: var(--text-light-color);
    text-align: right;
    flex-grow: 1;
}

.git-icon {
    margin-right: 0.5em;
}

a {
    color: var(--text-light-color);
    text-decoration: none;
    transition: all 0.3s ease;
}

a:hover {
    color: var(--text-default-color);
    text-decoration: underline;
}

@media (max-width: 768px) {
    .footer-bottom {
        flex-direction: column;
        justify-content: left;
        text-align: left;
    }

    .footer-main-content {
        flex-direction: column;
        align-items: left;
        text-align: left;
    }

    .footer-column {
        width: 100%;
        max-width: 100%;
    }

    .build-info {
        justify-content: left;
        text-align: center;
        width: 100%;
        margin-top: 0.5rem;
    }
}
</style>
