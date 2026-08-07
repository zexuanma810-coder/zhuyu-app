# 竹语 · 安卓独立 App（不依赖浏览器 / 不上应用商店）

本项目已用 **Capacitor** 把网页版「竹语」封装成**原生安卓应用**：网页代码已打包进 `android/app/src/main/assets/public/`，
安装到手机后是**纯本地应用**，不依赖浏览器、不依赖电脑、不依赖任何网页。

你只要拿到编译好的 `app-debug.apk`，传到手机安装即可。

---

## 一、最省事的做法：用 GitHub 免费云端编译（推荐，你已有 GitHub 账号）

不用装 Android Studio、不用在本机下载几个 GB 的 SDK。把代码推到 GitHub，GitHub 的服务器（自带 JDK + Android SDK）
会自动帮你把 APK 编译好，你去下载就行。

### 第 1 步：在本机准备好 Git（如果你还没装）
https://git-scm.com/downloads —— 一直点下一步安装即可。

### 第 2 步：在 GitHub 网页上新建一个仓库
1. 打开 https://github.com → 右上角 **+** → **New repository**。
2. 仓库名随便起，例如 `zhuyu-app`。
3. **不要**勾选 "Add a README"（我们已经有了）。
4. 点 **Create repository**，进入新仓库页面。

### 第 3 步：在本机这个 `zhuyu-app` 文件夹里，打开终端，依次粘贴执行
（把下面的 `你的用户名` 换成你的 GitHub 用户名，`zhuyu-app` 换成你刚起的仓库名）

```bash
git init
git add .
git commit -m "竹语 App 初始工程"
git branch -M main
git remote add origin https://github.com/你的用户名/zhuyu-app.git
git push -u origin main
```

> 第一次 push 会让登录 GitHub，按提示在浏览器里授权即可。

### 第 4 步：等 GitHub 帮你编译
1. 回到你的 GitHub 仓库页面 → 点顶部 **Actions** 标签。
2. 你会看到一条名为 **Build Zhuyu APK** 的流水线正在跑（黄色/绿色）。
3. 等它变成绿色 ✅（通常 3~8 分钟）。

### 第 5 步：下载 APK
1. 点进那条成功的流水线 → 页面底部 **Artifacts** 区域 → 点 **zhuyu-apk** 下载（是个 zip）。
2. 解压得到 `app-debug.apk`。

### 第 6 步：装到手机（侧载，不走商店）
1. 把 `app-debug.apk` 通过 **微信文件传输 / USB / 网盘** 传到手机。
2. 手机：设置 → 安全 → **允许「安装未知应用」**（给文件管理或浏览器开权限）。
3. 点 APK → 安装。桌面出现「竹语」图标，点开即用。

---

## 二、备选：用 Android Studio 自己编译（免费，GUI 操作）
如果你不想用 GitHub，也可以在自己电脑上用 Android Studio 编译（它首次会自动装好 JDK + SDK）。

1. 下载安装 Android Studio：https://developer.android.com/studio
2. 打开 → **Open** → 选择本目录下的 `zhuyu-app/android` 文件夹。
3. 首次会提示安装 Gradle / SDK，按弹窗一路 Install。
4. 顶部菜单：**Build → Build Bundle(s) / APK(s) → Build APK(s)**。
5. 编译完去 `zhuyu-app/android/app/build/outputs/apk/debug/app-debug.apk` 拿文件，按上面「第 6 步」安装。

---

## 三、以后想改界面 / 功能怎么办
网页源码在 `zhuyu-app/www/`（和原来的 `app/` 是同一套）。改完后再推一次 GitHub 就会自动重新编译出新 APK：
```bash
git add .
git commit -m "更新界面"
git push
```
回到 Actions 等编译完、下载新的 APK 即可。

---

## 四、工程结构
```
zhuyu-app/
├─ .github/workflows/build-apk.yml   ← GitHub 云端编译配置（自动出 APK）
├─ www/                              ← 网页源码（index.html / styles.css / app.js …）
├─ android/                          ← 原生安卓工程（已生成，含 gradlew 构建脚本）
├─ capacitor.config.json
├─ package.json / package-lock.json
└─ README.md
```

> 说明：调试版（debug）安装时系统可能提示「此应用未经过 Play 验证」，属正常现象，个人使用忽略即可。
> 想要去掉该提示的「发布版」，需要生成签名密钥（keystore），需要的话我可以帮你配。
