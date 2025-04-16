# GitHub Pages 部署指南

## 将超级玛丽游戏部署到GitHub Pages

按照以下步骤，你可以轻松地将这个超级玛丽像素跳跃游戏部署到GitHub Pages上，让你的朋友通过网络访问并游玩：

### 步骤1：准备GitHub账号

1. 如果你还没有GitHub账号，请前往 [GitHub官网](https://github.com/) 注册一个账号
2. 登录你的GitHub账号

### 步骤2：创建新仓库

1. 点击GitHub右上角的 "+" 按钮，选择 "New repository"
2. 为仓库起一个名字，例如 `super-mario-game`
3. 可以添加一个简短的描述，例如 "超级玛丽像素跳跃游戏"
4. 选择 "Public" 公开仓库（GitHub Pages需要公开仓库，除非你有Pro账号）
5. 点击 "Create repository" 创建仓库

### 步骤3：上传游戏文件

**方法1：通过网页界面上传（适合初学者）**

1. 在新创建的仓库页面，点击 "uploading an existing file" 链接
2. 将游戏文件夹中的所有文件拖拽到上传区域
3. 添加提交信息，例如 "Initial commit - upload game files"
4. 点击 "Commit changes" 提交更改

**方法2：使用Git命令行（适合有经验的用户）**

```bash
# 克隆仓库到本地
git clone https://github.com/你的用户名/super-mario-game.git

# 复制游戏文件到仓库文件夹
# 然后添加、提交并推送
git add .
git commit -m "Initial commit - upload game files"
git push origin main
```

### 步骤4：启用GitHub Pages

1. 在仓库页面，点击 "Settings" 选项卡
2. 在左侧菜单中找到并点击 "Pages"
3. 在 "Source" 部分，从下拉菜单中选择 "main" 分支
4. 点击 "Save" 保存设置
5. 等待几分钟，GitHub会自动构建你的网站

### 步骤5：访问你的游戏

1. 部署完成后，GitHub Pages会显示你的网站URL，通常格式为：
   `https://你的用户名.github.io/super-mario-game/`
2. 点击该链接或复制分享给朋友，即可在线游玩游戏

### 注意事项

- 部署后如果游戏无法正常运行，请检查所有资源路径是否正确
- 确保所有文件（包括图片、音频等）都已上传
- 如果修改了游戏内容，只需重新上传文件并提交，GitHub Pages会自动更新

### 游戏更新

如果你想更新游戏，只需：

1. 修改本地文件
2. 重新上传到GitHub仓库
3. GitHub Pages会自动更新你的在线游戏

现在，你的朋友可以随时随地通过网络访问并游玩你的超级玛丽游戏了！