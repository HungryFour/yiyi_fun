# YiYi Fun - 字母学习游戏

这是一个基于Vue 3开发的儿童字母学习游戏，专门为4-6岁的小朋友设计。

## 项目特点

- 使用Vue 3的最新特性和组合式API
- 卡通化界面设计，适合儿童使用
- 基于浏览器的语音API，读出字母
- 响应式设计，自适应不同设备

## 游戏规则

1. 游戏中会随机出现字母饼干
2. 小狗会提示要找哪个字母
3. 点击正确的字母饼干，可以投喂给小狗，小狗会很开心
4. 点击错误的字母饼干，小狗会感到难过
5. 在规定时间内完成挑战

## 项目结构

```
yiyi_vue_pure/
├── public/             # 静态资源
├── src/
│   ├── assets/         # 图像、音频和字体资源
│   ├── components/     # 可复用组件
│   │   ├── game/       # 游戏相关组件
│   │   └── ui/         # UI组件
│   ├── composables/    # 可复用的组合式函数
│   ├── stores/         # Pinia状态管理
│   ├── views/          # 页面视图
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── index.html          # HTML入口
├── vite.config.js      # Vite配置
└── package.json        # 项目依赖
```

## 安装和运行

1. 安装依赖：

```bash
npm install
```

2. 运行开发服务器：

```bash
npm run dev
```

3. 打包生产环境：

```bash
npm run build
```

## 技术栈

- Vue 3
- Pinia（状态管理）
- Vue Router
- GSAP（动画库）
- Web Speech API（语音合成）

## 兼容性

游戏需要现代浏览器支持，推荐使用：
- Chrome 最新版
- Firefox 最新版
- Safari 最新版
- Edge 最新版 