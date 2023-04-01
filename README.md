这是个 [Next.js](https://nextjs.org/) 项目。使用 [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) 创建。

## 初始化项目

1. 安装依赖:

```bash
yarn
```
---

2. 修改编辑器配置

由于使用了实验性特性 —— (装饰器)[https://www.tslang.cn/docs/handbook/decorators.html]，所以部分编辑器进行特殊配置已保证正常运行。

- vs code
    1. 设置搜索 `experimental Decorators` 并开启。
    2. 重启 vs code。

3. 开发server:

> 整体应用

```bash
yarn run dev
```

> 仅 next (前端)

```bash
yarn run dev::next
```

打开 [http://localhost:3000](http://localhost:3000) 可以看到结果



---



## 相关文档：

pixi.js: <https://pixijs.download/release/docs/index.html>

pixi-react: <https://pixijs.io/pixi-react/> 或 <https://reactpixi.org/> 

crypto.js: <https://cryptojs.gitbook.io/docs/>

next.js: <https://www.nextjs.cn/docs/getting-started>

react: <https://react.docschina.org/docs/hello-world.html>

node:  <https://nodejs.org/en/docs/>

tauri: <https://tauri.app/zh-cn/v1/guides/>

antd: <https://ant-design.antgroup.com/components/overview-cn/>

react timeline editor: <https://zdarcy.com/>

## 图标使用方法

使用`Icon`组件，icon可以在 <https://fontawesome.com/search?o=r&m=free> 找.

prop详见Icon组件注释。