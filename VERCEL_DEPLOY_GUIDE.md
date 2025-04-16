# Vercel部署指南

## 将超级玛丽游戏部署到Vercel

### 步骤1：准备Vercel账号

1. 前往 [Vercel官网](https://vercel.com/) 注册一个账号
2. 可以使用GitHub、GitLab或Bitbucket账号直接登录

### 步骤2：安装Vercel CLI（可选）

如果你想使用命令行部署，可以安装Vercel CLI：

```bash
npm install -g vercel
```

### 步骤3：部署项目

#### 方法一：通过GitHub仓库部署（推荐）

1. 将游戏代码上传到GitHub仓库
2. 登录Vercel账号
3. 点击"New Project"按钮
4. 选择你的GitHub仓库
5. Vercel会自动检测项目类型，无需额外配置
6. 点击"Deploy"按钮开始部署

#### 方法二：通过Vercel CLI部署

1. 在游戏项目目录中打开命令行
2. 运行以下命令：

```bash
vercel login
vercel
```

3. 按照提示完成部署

#### 方法三：直接上传项目文件

1. 登录Vercel账号
2. 点击"New Project"按钮
3. 选择"Upload"选项
4. 将整个游戏项目文件夹拖拽到上传区域
5. 点击"Deploy"按钮开始部署

### 步骤4：查看部署进度

1. 部署过程中，Vercel会显示部署进度
2. 部署完成后，会显示"Congratulations!"信息

### 步骤5：访问你的游戏

1. 部署完成后，Vercel会显示你的网站URL，通常格式为：
   `https://super-mario-game.vercel.app/`
2. 点击该链接或复制分享给朋友，即可在线游玩游戏