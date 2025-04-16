// 超级玛丽像素跳跃游戏主入口
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏状态
let gameState = 'locked'; // locked, menu, playing, win, fail
let currentLevel = 1;
let coinsCollected = 0;
let totalCoins = 0;
let bossDefeated = false;
let birthdayTriggered = false;
let playerSkin = 'character'; // 默认皮肤
let gameMode = ''; // 'A'表示收集金币模式，'B'表示击败Boss模式

// 预加载图片资源
const images = {};
const imageFiles = ['character', 'enemy', 'block', 'ground', 'cloud', 'pipe', 'coin', 'cake', 'boss'];

// 音效资源
const sounds = {
  jump: new Audio('audio/jump.mp3'),
  coin: new Audio('audio/coin.mp3'),
  stomp: new Audio('audio/stomp.mp3'),
  birthday: new Audio('audio/birthday.mp3')
};

// 关卡数据
const levels = [
  // 第一关
  {
    map: [
      {x:0, y:360, w:800, h:40, type:'ground'},
      {x:200, y:320, w:40, h:40, type:'block'},
      {x:400, y:280, w:40, h:40, type:'block'},
      {x:600, y:320, w:40, h:40, type:'block'}
    ],
    coins: [
      {x:200, y:280, w:24, h:24, collected:false},
      {x:400, y:240, w:24, h:24, collected:false},
      {x:600, y:280, w:24, h:24, collected:false}
    ],
    enemies: [
      {x:300, y:328, w:32, h:32, vx:-1, type:'basic'},
      {x:500, y:328, w:32, h:32, vx:-1, type:'basic'}
    ],
    startX: 50,
    startY: 300,
    endX: 700,
    background: '#6bd26b'
  },
  // 第二关
  {
    map: [
      {x:0, y:360, w:960, h:40, type:'ground'},
      {x:150, y:320, w:40, h:40, type:'block'},
      {x:300, y:280, w:40, h:40, type:'block'},
      {x:450, y:240, w:40, h:40, type:'block'},
      {x:600, y:200, w:40, h:40, type:'block'},
      {x:750, y:240, w:40, h:40, type:'block'},
      {x:400, y:320, w:48, h:64, type:'pipe'}
    ],
    coins: [
      {x:150, y:280, w:24, h:24, collected:false},
      {x:300, y:240, w:24, h:24, collected:false},
      {x:450, y:200, w:24, h:24, collected:false},
      {x:600, y:160, w:24, h:24, collected:false},
      {x:750, y:200, w:24, h:24, collected:false}
    ],
    enemies: [
      {x:200, y:328, w:32, h:32, vx:-1, type:'basic'},
      {x:500, y:328, w:32, h:32, vx:-1, type:'basic'},
      {x:700, y:328, w:32, h:32, vx:-2, type:'fast'}
    ],
    startX: 50,
    startY: 300,
    endX: 850,
    background: '#87CEEB'
  },
  // 第三关（生日彩蛋关卡）
  {
    map: [
      {x:0, y:360, w:960, h:40, type:'ground'},
      {x:100, y:320, w:40, h:40, type:'block'},
      {x:200, y:280, w:40, h:40, type:'block'},
      {x:300, y:240, w:40, h:40, type:'block'},
      {x:400, y:200, w:40, h:40, type:'block'},
      {x:500, y:240, w:40, h:40, type:'block'},
      {x:600, y:280, w:40, h:40, type:'block'},
      {x:700, y:320, w:40, h:40, type:'block'},
      {x:800, y:320, w:40, h:40, type:'block'},
      {x:250, y:320, w:48, h:64, type:'pipe'},
      {x:550, y:320, w:48, h:64, type:'pipe'},
      {x:300, y:280, w:100, h:20, type:'moving_platform', vx:1, range:150}
    ],
    coins: [
      {x:100, y:280, w:24, h:24, collected:false},
      {x:200, y:240, w:24, h:24, collected:false},
      {x:300, y:200, w:24, h:24, collected:false},
      {x:400, y:160, w:24, h:24, collected:false},
      {x:500, y:200, w:24, h:24, collected:false},
      {x:600, y:240, w:24, h:24, collected:false},
      {x:700, y:280, w:24, h:24, collected:false}
    ],
    enemies: [
      {x:150, y:328, w:32, h:32, vx:-1, type:'basic'},
      {x:350, y:328, w:32, h:32, vx:-1, type:'basic'},
      {x:650, y:328, w:32, h:32, vx:-1, type:'basic'},
      {x:800, y:328, w:32, h:32, vx:-2, type:'fast'}
    ],
    boss: {x:850, y:280, w:64, h:64, hp:5, vx:-1, active:false},
    birthdayCake: {x:800, y:280, w:32, h:32, collected:false},
    startX: 50,
    startY: 300,
    endX: 900,
    background: '#FFB6C1' // 粉色背景表示特殊关卡
  }
];

function loadImages() {
  let loadedCount = 0;
  imageFiles.forEach(name => {
    images[name] = new Image();
    images[name].src = `images/${name}.svg`;
    images[name].onload = () => {
      loadedCount++;
      if (loadedCount === imageFiles.length) {
        console.log('所有图片加载完成');
      }
    };
  });
}

// 皮肤自定义功能
function setupSkinCustomization() {
  // 创建皮肤选择界面
  const skinPanel = document.createElement('div');
  skinPanel.id = 'skinPanel';
  skinPanel.style.position = 'absolute';
  skinPanel.style.top = '10px';
  skinPanel.style.left = '10px';
  skinPanel.style.background = 'rgba(0,0,0,0.7)';
  skinPanel.style.padding = '10px';
  skinPanel.style.borderRadius = '5px';
  skinPanel.style.display = 'none';
  
  // 添加颜色选择器
  const colorPicker = document.createElement('input');
  colorPicker.type = 'color';
  colorPicker.id = 'colorPicker';
  colorPicker.value = '#FF0000';
  colorPicker.onchange = (e) => {
    // 更改角色颜色
    playerSkin = 'custom';
    localStorage.setItem('playerColor', e.target.value);
  };
  
  // 添加图片上传
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.id = 'skinUpload';
  fileInput.accept = 'image/*';
  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const customSkin = new Image();
        customSkin.src = event.target.result;
        customSkin.onload = () => {
          images['custom'] = customSkin;
          playerSkin = 'custom';
          localStorage.setItem('playerSkin', 'custom');
          localStorage.setItem('customSkinData', event.target.result);
        };
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 添加按钮和标签
  const label = document.createElement('div');
  label.textContent = '自定义皮肤:';
  label.style.color = '#fff';
  label.style.marginBottom = '5px';
  
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '皮肤设置';
  toggleBtn.style.position = 'absolute';
  toggleBtn.style.top = '10px';
  toggleBtn.style.left = '10px';
  toggleBtn.onclick = () => {
    skinPanel.style.display = skinPanel.style.display === 'none' ? 'block' : 'none';
  };
  
  // 组装界面
  skinPanel.appendChild(label);
  skinPanel.appendChild(colorPicker);
  skinPanel.appendChild(document.createElement('br'));
  skinPanel.appendChild(fileInput);
  
  document.body.appendChild(toggleBtn);
  document.body.appendChild(skinPanel);
  
  // 加载保存的皮肤设置
  const savedSkin = localStorage.getItem('playerSkin');
  const savedColor = localStorage.getItem('playerColor');
  const customSkinData = localStorage.getItem('customSkinData');
  
  if (savedSkin === 'custom' && customSkinData) {
    const customSkin = new Image();
    customSkin.src = customSkinData;
    customSkin.onload = () => {
      images['custom'] = customSkin;
      playerSkin = 'custom';
    };
  } else if (savedColor) {
    colorPicker.value = savedColor;
    playerSkin = 'custom';
  }
}

// 密码解锁
const startScreen = document.getElementById('startScreen');
const passwordInput = document.getElementById('passwordInput');
const unlockBtn = document.getElementById('unlockBtn');
const unlockTip = document.getElementById('unlockTip');

unlockBtn.onclick = function() {
  if(passwordInput.value === '最好的都给你') {
    startScreen.style.display = 'none';
    gameState = 'menu';
    loadImages();
    setupSkinCustomization();
    sounds.background.play();
    // 添加游戏模式选择
    const modeSelect = document.createElement('div');
    modeSelect.id = 'modeSelect';
    modeSelect.style.position = 'fixed';
    modeSelect.style.top = '0';
    modeSelect.style.left = '0';
    modeSelect.style.width = '100vw';
    modeSelect.style.height = '100vh';
    modeSelect.style.background = 'rgba(0,0,0,0.85)';
    modeSelect.style.display = 'flex';
    modeSelect.style.flexDirection = 'column';
    modeSelect.style.alignItems = 'center';
    modeSelect.style.justifyContent = 'center';
    modeSelect.style.zIndex = '10';
    const modeTitle = document.createElement('h2');
    modeTitle.textContent = '请选择游戏模式';
    const modeA = document.createElement('button');
    modeA.textContent = 'A类通关：收集所有金币（简单模式）';
    modeA.style.fontSize = '1.2em';
    modeA.style.padding = '8px 24px';
    modeA.style.margin = '16px';
    modeA.style.cursor = 'pointer';
    modeA.onclick = function() {
      gameMode = 'A';
      modeSelect.style.display = 'none';
      startGame();
    };
    const modeB = document.createElement('button');
    modeB.textContent = 'B类通关：击败最终Boss（困难模式）';
    modeB.style.fontSize = '1.2em';
    modeB.style.padding = '8px 24px';
    modeB.style.margin = '16px';
    modeB.style.cursor = 'pointer';
    modeB.onclick = function() {
      gameMode = 'B';
      modeSelect.style.display = 'none';
      startGame();
    };
    modeSelect.appendChild(modeTitle);
    modeSelect.appendChild(modeA);
    modeSelect.appendChild(modeB);
    document.body.appendChild(modeSelect);
  } else {
    unlockTip.textContent = '密码错误，请重试';
  }
};

// 生日祝福相关
const birthdayMsg = document.getElementById('birthdayMsg');
sounds.background = new Audio('audio/background.mp3');
sounds.background.volume = 0.1;
sounds.background.loop = true;
sounds.background.play();
function playBirthdayAudio() {
  sounds.background.pause(); // 使用正确的背景音乐变量
  sounds.birthday.currentTime = 0;
  sounds.birthday.play();
  console.log('播放生日祝福音频');
  sounds.birthday.onended = () => {
    console.log('生日祝福音频播放完毕');
    sounds.background.pause(); // 使用正确的背景音乐变量
  };
}
function triggerBirthday() {
  // 创建全屏显示的生日祝福
  birthdayMsg.innerHTML = `
    <div style="font-size: 48px; margin-bottom: 20px; font-weight: bold;">生日快乐！王弈翔</div>
    <div style="font-size: 100px; margin: 20px 0;">🎂</div>
  `;
  birthdayMsg.style.display = 'flex';
  birthdayMsg.style.flexDirection = 'column';
  birthdayMsg.style.alignItems = 'center';
  birthdayMsg.style.justifyContent = 'center';
  birthdayMsg.style.position = 'fixed';
  birthdayMsg.style.top = '0';
  birthdayMsg.style.left = '0';
  birthdayMsg.style.width = '100vw';
  birthdayMsg.style.height = '100vh';
  birthdayMsg.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  birthdayMsg.style.color = '#FF1493';
  birthdayMsg.style.textShadow = '2px 2px 4px #000';
  birthdayMsg.style.zIndex = '1000';
  birthdayMsg.style.animation = 'bounce 0.5s infinite alternate';
  playBirthdayAudio(); // 调用播放生日音频函数
  birthdayTriggered = true;
  
  // 播放生日祝福音频
  playBirthdayAudio();
  console.log('触发生日祝福');
  
  // 添加动画样式
  if (!document.getElementById('birthdayAnimation')) {
    const style = document.createElement('style');
    style.id = 'birthdayAnimation';
    style.textContent = `
      @keyframes bounce {
        from { transform: scale(1); }
        to { transform: scale(1.1); }
      }
      @keyframes fadeInOut {
        0% { opacity: 0; }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // 不自动隐藏，让音频播放完毕后再隐藏
  // 音频播放结束事件在playBirthdayAudio函数中处理
}

// 游戏主循环与初始化
function startGame() {
  // 初始化游戏状态
  gameState = 'playing';
  currentLevel = 1;
  coinsCollected = 0;
  totalCoins = 0;
  
  // 计算总金币数
  levels.forEach(level => {
    totalCoins += level.coins.length;
  });
  
  // 主角属性
  let player = {
    x: levels[currentLevel-1].startX,
    y: levels[currentLevel-1].startY,
    w: 32,
    h: 32,
    vx: 0,
    vy: 0,
    speed: 3,
    jumpPower: 10,
    onGround: false,
    direction: 1, // 1=右，-1=左
    lives: 3
  };
  
  // 当前关卡数据
  let currentMap = [...levels[currentLevel-1].map];
  let currentCoins = [...levels[currentLevel-1].coins];
  let currentEnemies = [...levels[currentLevel-1].enemies];
  let birthdayCake = currentLevel === 3 ? {...levels[2].birthdayCake} : null;
  
  // 键盘控制
  let keys = {};
  document.onkeydown = e => { 
    keys[e.code] = true; 
    // 按P键切换皮肤面板
    if(e.code === 'KeyP') {
      const skinPanel = document.getElementById('skinPanel');
      if(skinPanel) {
        skinPanel.style.display = skinPanel.style.display === 'none' ? 'block' : 'none';
      }
    }
  };
  document.onkeyup = e => { keys[e.code] = false; };
  
  // 碰撞检测
  function checkCollision(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }
  
  // 加载下一关
  function loadNextLevel() {
    currentLevel++;
    if(currentLevel > levels.length) {
      gameState = 'win';
      return;
    }
    
    player.x = levels[currentLevel-1].startX;
    player.y = levels[currentLevel-1].startY;
    currentMap = [...levels[currentLevel-1].map];
    currentCoins = [...levels[currentLevel-1].coins];
    currentEnemies = [...levels[currentLevel-1].enemies];
    birthdayCake = currentLevel === 3 ? {...levels[2].birthdayCake} : null;
  }
  
  // 游戏主循环
  function loop() {
    // 物理与控制
    player.vx = 0;
    if(keys['ArrowLeft']) { player.vx = -player.speed; player.direction = -1; }
    if(keys['ArrowRight']) { player.vx = player.speed; player.direction = 1; }
    if((keys['Space'] || keys['ArrowUp']) && player.onGround) { 
      player.vy = -player.jumpPower; 
      player.onGround = false; 
      sounds.jump.currentTime = 0;
      sounds.jump.play();
    }
    player.vy += 0.5; // 重力
    player.x += player.vx;
    player.y += player.vy;
    
    // 移动平台更新
    for(const obj of currentMap) {
      if(obj.type === 'moving_platform') {
        // 移动平台逻辑
        obj.x += obj.vx;
        if(!obj.startX) obj.startX = obj.x;
        
        // 检查是否到达移动范围边界
        if(obj.x > obj.startX + obj.range || obj.x < obj.startX - obj.range) {
          obj.vx *= -1;
        }
        
        // 如果玩家站在平台上，随平台移动
        if(player.onGround && player.y + player.h === obj.y && 
           player.x + player.w > obj.x && player.x < obj.x + obj.w) {
          player.x += obj.vx;
        }
      }
    }
    
    // 地图碰撞
    player.onGround = false;
    for(const obj of currentMap) {
      if(checkCollision(player, obj)) {
        if(player.vy > 0 && player.y + player.h - player.vy <= obj.y) { // 脚踩地面
          player.y = obj.y - player.h;
          player.vy = 0;
          player.onGround = true;
        } else if(player.vy < 0 && player.y >= obj.y + obj.h - 2) { // 顶到砖块
          player.y = obj.y + obj.h;
          player.vy = 0;
        } else if(player.vx > 0) { // 右撞
          player.x = obj.x - player.w;
        } else if(player.vx < 0) { // 左撞
          player.x = obj.x + obj.w;
        }
      }
    }
    
    // 金币收集
    for(let i = 0; i < currentCoins.length; i++) {
      if(!currentCoins[i].collected && checkCollision(player, currentCoins[i])) {
        currentCoins[i].collected = true;
        coinsCollected++;
        sounds.coin.currentTime = 0;
        sounds.coin.play();
      }
    }
    
    // 生日蛋糕收集（第三关特殊道具）
    if(birthdayCake && !birthdayCake.collected && checkCollision(player, birthdayCake)) {
      birthdayCake.collected = true;
      triggerBirthday();
    }
    
    // 敌人移动与踩敌
    for(const enemy of currentEnemies) {
      // 根据敌人类型调整行为
      if(enemy.type === 'basic') {
        enemy.x += enemy.vx;
        // 简单地面检测和边界反弹
        if(enemy.x < 0 || enemy.x + enemy.w > canvas.width) enemy.vx *= -1;
      } else if(enemy.type === 'fast') {
        enemy.x += enemy.vx;
        // 快速敌人会追踪玩家
        if(Math.abs(player.x - enemy.x) < 200 && Math.random() < 0.02) {
          enemy.vx = player.x < enemy.x ? -2 : 2;
        }
        // 边界反弹
        if(enemy.x < 0 || enemy.x + enemy.w > canvas.width) enemy.vx *= -1;
      }
      
      // 碰撞检测
      if(checkCollision(player, enemy)) {
        if(player.vy > 0 && player.y + player.h - player.vy <= enemy.y + 10) { // 踩敌
          enemy.dead = true;
          player.vy = -8;
          sounds.stomp.currentTime = 0;
          sounds.stomp.play();
        } else {
          // 玩家死亡或受伤逻辑
          player.lives--;
          if(player.lives <= 0) {
            gameState = 'fail';
            return;
          } else {
            // 重置玩家位置
            player.x = levels[currentLevel-1].startX;
            player.y = levels[currentLevel-1].startY;
            player.vx = 0;
            player.vy = 0;
          }
        }
      }
    }
    
    // Boss逻辑（第三关）
    if(currentLevel === 3 && levels[2].boss && !levels[2].boss.dead) {
      const boss = levels[2].boss;
      
      // 当玩家接近时激活Boss
      if(!boss.active && player.x > canvas.width * 0.7) {
        boss.active = true;
      }
      
      if(boss.active) {
        // Boss移动
        boss.x += boss.vx;
        
        // Boss边界反弹
        if(boss.x < canvas.width * 0.7 || boss.x + boss.w > canvas.width) {
          boss.vx *= -1;
        }
        
        // 随机跳跃
        if(boss.onGround && Math.random() < 0.02) {
          boss.vy = -12;
          boss.onGround = false;
        }
        
        // 重力
        boss.vy = boss.vy || 0;
        boss.vy += 0.5;
        boss.y += boss.vy;
        
        // 地面检测
        if(boss.y + boss.h > 360) {
          boss.y = 360 - boss.h;
          boss.vy = 0;
          boss.onGround = true;
        }
        
        // 玩家攻击Boss
        if(checkCollision(player, boss) && player.vy > 0 && player.y + player.h - player.vy <= boss.y + 10) {
          boss.hp--;
          player.vy = -10;
          sounds.stomp.currentTime = 0;
          sounds.stomp.play();
          
          if(boss.hp <= 0) {
            boss.dead = true;
            bossDefeated = true;
            triggerBirthday(); // 击败Boss时触发生日祝福
          }
        }
        // Boss攻击玩家
        else if(checkCollision(player, boss)) {
          player.lives--;
          if(player.lives <= 0) {
            gameState = 'fail';
            return;
          } else {
            // 重置玩家位置
            player.x = levels[currentLevel-1].startX;
            player.y = levels[currentLevel-1].startY;
            player.vx = 0;
            player.vy = 0;
          }
        }
      }
    }
    
    // 移除被踩死的敌人
    currentEnemies = currentEnemies.filter(e=>!e.dead);
    
    // 检查是否到达关卡终点或满足通关条件
    if(player.x >= levels[currentLevel-1].endX) {
      // A类通关：检查是否收集了所有金币
      if(gameMode === 'A') {
        const allCoinsCollected = currentCoins.every(coin => coin.collected);
        if(!allCoinsCollected) {
          // 如果没有收集所有金币，显示提示
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.fillRect(canvas.width/2 - 200, 100, 400, 50);
          ctx.fillStyle = '#fff';
          ctx.font = '16px 微软雅黑';
          ctx.fillText('A类通关需要收集本关所有金币！', canvas.width/2 - 120, 130);
          return;
        }
      }
      // B类通关：检查是否击败了Boss
      else if(gameMode === 'B' && currentLevel === 3) {
        if(!bossDefeated) {
          // 如果没有击败Boss，显示提示
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.fillRect(canvas.width/2 - 200, 100, 400, 50);
          ctx.fillStyle = '#fff';
          ctx.font = '16px 微软雅黑';
          ctx.fillText('B类通关需要击败最终Boss！', canvas.width/2 - 120, 130);
          return;
        }
      }
      
      loadNextLevel();
    }
    
    // 边界限制
    if(player.x < 0) player.x = 0;
    if(player.y > canvas.height) {
      player.lives--;
      if(player.lives <= 0) {
        gameState = 'fail';
      } else {
        player.x = levels[currentLevel-1].startX;
        player.y = levels[currentLevel-1].startY;
        player.vx = 0;
        player.vy = 0;
      }
    }
    
    // 渲染
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    // 设置背景颜色
    canvas.style.backgroundColor = levels[currentLevel-1].background;
    
    // 绘制云朵背景
    for(let i = 0; i < 5; i++) {
      ctx.drawImage(images.cloud, i * 200, 50, 64, 40);
    }
    
    // 地图
    for(const obj of currentMap) {
      if(obj.type === 'ground') {
        // 绘制地面
        for(let i = 0; i < obj.w; i += 32) {
          ctx.drawImage(images.ground, obj.x + i, obj.y, 32, 32);
        }
      } else if(obj.type === 'block') {
        ctx.drawImage(images.block, obj.x, obj.y, obj.w, obj.h);
      } else if(obj.type === 'pipe') {
        ctx.drawImage(images.pipe, obj.x, obj.y, obj.w, obj.h);
      } else if(obj.type === 'moving_platform') {
        // 绘制移动平台
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h/2);
      }
    }
    
    // 金币
    for(const coin of currentCoins) {
      if(!coin.collected) {
        ctx.drawImage(images.coin, coin.x, coin.y, coin.w, coin.h);
      }
    }
    
    // 生日蛋糕（第三关特殊道具）
    if(birthdayCake && !birthdayCake.collected) {
      ctx.drawImage(images.cake, birthdayCake.x, birthdayCake.y, birthdayCake.w, birthdayCake.h);
    }
    
    // 主角
    if(playerSkin === 'custom' && images.custom) {
      // 使用自定义皮肤
      ctx.save();
      if(player.direction === -1) {
        // 左方向需要翻转图像
        ctx.translate(player.x + player.w, player.y);
        ctx.scale(-1, 1);
        ctx.drawImage(images.custom, 0, 0, player.w, player.h);
      } else {
        ctx.drawImage(images.custom, player.x, player.y, player.w, player.h);
      }
      ctx.restore();
    } else if(playerSkin === 'custom' && localStorage.getItem('playerColor')) {
      // 使用自定义颜色
      ctx.fillStyle = localStorage.getItem('playerColor');
      ctx.fillRect(player.x, player.y, player.w, player.h);
    } else {
      // 使用默认角色图像
      ctx.save();
      if(player.direction === -1) {
        // 左方向需要翻转图像
        ctx.translate(player.x + player.w, player.y);
        ctx.scale(-1, 1);
        ctx.drawImage(images.character, 0, 0, player.w, player.h);
      } else {
        ctx.drawImage(images.character, player.x, player.y, player.w, player.h);
      }
      ctx.restore();
    }
    
    // 敌人
    for(const enemy of currentEnemies) {
      ctx.drawImage(images.enemy, enemy.x, enemy.y, enemy.w, enemy.h);
    }
    
    // Boss（第三关）
    if(currentLevel === 3 && levels[2].boss && !levels[2].boss.dead) {
      const boss = levels[2].boss;
      if(boss.active) {
        // 绘制Boss
        ctx.drawImage(images.boss || images.enemy, boss.x, boss.y, boss.w, boss.h);
        
        // 绘制Boss血条
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(boss.x, boss.y - 15, boss.w, 10);
        ctx.fillStyle = 'rgba(255,0,0,0.8)';
        ctx.fillRect(boss.x, boss.y - 15, boss.w * (boss.hp / 5), 10);
      }
    }
    
    // 游戏状态UI
    ctx.fillStyle = '#fff';
    ctx.font = '16px 微软雅黑';
    ctx.fillText(`关卡: ${currentLevel}/${levels.length}`, 10, 20);
    ctx.fillText(`生命: ${player.lives}`, 10, 40);
    ctx.fillText(`金币: ${coinsCollected}/${totalCoins}`, 10, 60);
    ctx.fillText(`游戏模式: ${gameMode === 'A' ? 'A类-收集金币' : 'B类-击败Boss'}`, 10, 80);
    
    // 游戏结束
    if(gameState === 'fail') {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '32px 微软雅黑';
      ctx.fillText('游戏失败，刷新重试', canvas.width/2-120, canvas.height/2);
      return;
    } else if(gameState === 'win') {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '32px 微软雅黑';
      ctx.fillText('恭喜通关！', canvas.width/2-80, canvas.height/2-40);
      ctx.font = '20px 微软雅黑';
      
      if(gameMode === 'A') {
        ctx.fillText(`A类通关成功！收集金币: ${coinsCollected}/${totalCoins}`, canvas.width/2-150, canvas.height/2);
      } else if(gameMode === 'B') {
        ctx.fillText(`B类通关成功！成功击败最终Boss！`, canvas.width/2-150, canvas.height/2);
      }
      
      ctx.fillText('按F5刷新重新开始游戏', canvas.width/2-100, canvas.height/2+40);
      return;
    }
    
    requestAnimationFrame(loop);
  }
  
  loop();
}

// 创建音频文件
document.addEventListener('DOMContentLoaded', function() {
  // 创建音频目录
  const createAudioFiles = async () => {
    // 创建空的音频文件，实际项目中应该使用真实的音频文件
    const audioFiles = ['jump.mp3', 'coin.mp3', 'stomp.mp3', 'birthday.mp3'];
    for(const file of audioFiles) {
      const response = await fetch(`audio/${file}`).catch(() => null);
      if(!response) {
        console.log(`创建音频文件: ${file}`);
        // 这里只是创建空文件，实际项目中应该使用真实的音频文件
      }
    }
  };
  
  createAudioFiles();
});

// 游戏初始化
window.onload = function() {
  // 预加载图片
  loadImages();
};
