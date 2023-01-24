这是个 [Next.js](https://nextjs.org/) 项目。使用 [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) 创建。

## 初始化项目

1. 安装依赖:

```bash
yarn
```
---

2. 修改第三方库错误的申明文件:

    将 `@inlet/react-pixi/index.d.ts` 中 `命名空间 _ReactPixi` 的 `IContainer` 类型 做如下修改。

    ```typescript
    /*-*/ type IContainer = Container<PIXI.DisplayObject>;
    /*+*/ type IContainer = Container<PIXI.DisplayObject> & {children?: Container};
    ``` 
---

3. 开发server:

```bash
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.