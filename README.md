<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>超级玛丽像素跳跃游戏</title><style>body{margin:0;padding:0;background:#222;color:#fff;font-family:'微软雅黑',sans-serif;}#gameCanvas{display:block;margin:40px auto 0 auto;background:#6bd26b;border:4px solid #333;box-shadow:0 0 24px #000;}#startScreen{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10;}#startScreen input{font-size:1.2em;padding:8px;margin-top:16px;}#startScreen button{font-size:1.2em;padding:8px 24px;margin-top:16px;cursor:pointer;}#skinUpload,#colorPalette{margin:8px 0;}#birthdayMsg{position:absolute;top:20px;left:50%;transform:translateX(-50%);background:#fff;color:#e67e22;padding:12px 32px;border-radius:16px;font-size:1.5em;display:none;z-index:20;box-shadow:0 2px 12px #0008;}</style></head><body><div id="startScreen"><h2>请输入启动密码以解锁游戏</h2><input type="password" id="passwordInput" placeholder="请输入启动密码"><button id="unlockBtn">解锁</button><div id="unlockTip" style="color:#e74c3c;margin-top:8px;"></div></div><canvas id="gameCanvas" width="960" height="540"></canvas><div id="birthdayMsg"></div><script src="main.js"></script></body></html>
# 超级玛丽像素跳跃游戏

## 目录结构
- index.html：游戏入口页面
- main.js：主游戏逻辑
- images/：游戏图片资源（如草地、砖块、云朵、水管、金币等）
- audio/：音效与生日祝福音频
- levels/：关卡数据与逻辑
- characters/：主角与敌人逻辑

## 游戏特点
- 多关卡设计，逐步提高难度
- 两种游戏模式：收集金币模式和击败Boss模式
- 自定义角色皮肤功能
- 生日彩蛋关卡

## 操作方法
- 左右方向键：移动
- 空格键或上方向键：跳跃
- P键：打开/关闭皮肤设置面板

## 本地运行
建议使用本地服务器打开index.html以避免音频等资源加载问题。

```bash
# 如果你有Node.js，可以使用http-server
npx http-server .
```

## GitHub Pages部署说明
按照以下步骤将游戏部署到GitHub Pages：

1. 创建GitHub账号（如果还没有）
2. 创建一个新的仓库，例如命名为`super-mario-game`
3. 将所有游戏文件上传到这个仓库
4. 在仓库设置中找到Pages选项
5. 将Source设置为main分支
6. 等待几分钟后，游戏将在`https://你的GitHub用户名.github.io/super-mario-game/`上线
7. 将此链接分享给你的朋友，他们就可以在线玩这个游戏了

## 在线游玩
一旦部署完成，你可以通过以下链接在线游玩这个游戏：
[点击这里在线游玩](https://你的GitHub用户名.github.io/super-mario-game/)