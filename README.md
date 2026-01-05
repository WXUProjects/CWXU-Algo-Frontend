# Algo-Frontend

算法协会前端项目

## API请求相关
API使用env环境变量记录

Vite设置了反向代理，将前端所有 /api 请求代理到 VITE_API_URL/v1/

例如在开发环境下将 /api/user/auth/login 代理到 http://dev.algo.zhiyuansofts.cn/v1/user/auth/login

## 初始化项目

```sh
npm install
```

### 开发环境

```sh
npm run dev
```

### 构建项目


```sh
npm run build
```

### 技术栈

- Vue3
- TypeScript
