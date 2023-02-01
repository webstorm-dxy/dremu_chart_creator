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

> 整体应用

```bash
yarn run start dev
```

> 仅 next (前端)

```bash
yarn run dev
```

打开 [http://localhost:3000](http://localhost:3000) 可以看到结果



---



## 相关文档：

pixi.js: <https://pixijs.download/release/docs/index.html>

@inlet/react-pixi: <https://reactpixi.org/> 

crypto.js: <https://cryptojs.gitbook.io/docs/>

next.js: <https://www.nextjs.cn/docs/getting-started>

react: <https://react.docschina.org/docs/hello-world.html>

node:  <https://nodejs.org/en/docs/>

tauri: <https://tauri.app/zh-cn/v1/guides/>