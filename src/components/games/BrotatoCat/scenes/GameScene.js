import { TextureSystem } from '../systems/TextureSystem';
import { UISystem } from '../systems/UISystem';
import { LevelSystem } from '../systems/LevelSystem';
import { gameConfig } from '../config/gameConfig';
import { enemyTypes } from '../config/enemyConfig';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // 創建其他紋理
    TextureSystem.createTextures(this);

    // 添加背景
    this.add.rectangle(400, 300, 800, 600, 0x8B4513);

    // 創建玩家
    this.player = this.physics.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'player'
    );
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0);
    this.player.setOrigin(0.5);
    
    // 設置玩家屬性
    this.playerHealth = gameConfig.player.health;
    this.maxHealth = gameConfig.player.health;
    this.money = 0;
    
    // 創建 UI
    this.ui = UISystem.createUI(this, gameConfig);
    
    // 設置血條深度
    this.ui.healthBar.setDepth(100);
    
    // 設置鍵盤控制
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // 創建遊戲組
    this.bullets = this.add.group();
    this.enemies = this.add.group();
    this.enemyBullets = this.add.group();
    this.coins = this.add.group();
    
    // 添加物理碰撞
    this.physics.add.overlap(
      this.bullets,
      this.enemies,
      this.bulletHitEnemy,
      null,
      this
    );
    
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.playerHitEnemy,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.enemyBullets,
      this.playerHitEnemyBullet,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin,
      null,
      this
    );

    // 設置遊戲狀態
    this.lastShot = 0;
    this.gameConfig = gameConfig;
    
    // 創建關卡系統
    this.levelSystem = new LevelSystem(this);
    this.levelSystem.startLevel();

    // 添加升級按鈕點擊事件
    this.ui.upgradeButtons.forEach(({ key, button }) => {
      button.on('pointerdown', () => {
        if (this.money >= gameConfig.upgrade[key].cost) {
          this.money -= gameConfig.upgrade[key].cost;
          this.ui.moneyText.setText('MONEY ' + this.money);
          
          switch(key) {
            case 'health':
              this.playerHealth += gameConfig.upgrade[key].increase;
              this.maxHealth += gameConfig.upgrade[key].increase;
              UISystem.updateHealthBar(this.ui.healthBar, this.playerHealth, this.maxHealth);
              break;
            case 'damage':
              gameConfig.bullet.damage += gameConfig.upgrade[key].increase;
              break;
            case 'speed':
              gameConfig.player.speed += gameConfig.upgrade[key].increase;
              break;
            case 'shootInterval':
              gameConfig.player.shootInterval -= gameConfig.upgrade[key].decrease;
              break;
          }
          
          UISystem.updateUpgradeButtons(this.ui.upgradeButtons, this.money);
        }
      });
    });

    // 添加受傷閃光效果
    this.hitFlash = this.add.graphics();
    this.hitFlash.setDepth(100);
    this.hitFlash.setAlpha(0);
    
    // 添加低血量紅色邊框
    this.lowHealthBorder = this.add.graphics();
    this.lowHealthBorder.setDepth(100);
    this.lowHealthBorder.setAlpha(0);
  }

  update() {
    if (this.levelSystem.isLevelInProgress()) {
      this.updatePlayerMovement();
      this.updateEnemies();
      this.updateCoins();
      this.updateShooting();
      this.cleanupBullets();
      
      // 更新血條位置
      this.ui.healthBar.setPosition(this.player.x, this.player.y - 20);
      
      // 更新時間
      this.ui.timeNumber.setText(this.levelSystem.getRemainingTime());
      
      // 生成敵人
      const levelConfig = this.levelSystem.getCurrentLevelConfig();
      if (Phaser.Math.Between(0, 100) < levelConfig.spawnRate) {
        this.spawnEnemy();
      }
    }
  }

  updatePlayerMovement() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-gameConfig.player.speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(gameConfig.player.speed);
    } else {
      this.player.setVelocityX(0);
    }
    
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-gameConfig.player.speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(gameConfig.player.speed);
    } else {
      this.player.setVelocityY(0);
    }
    
    // 限制玩家在遊戲區域內
    this.player.x = Phaser.Math.Clamp(
      this.player.x,
      gameConfig.gameBounds.x,
      gameConfig.gameBounds.x + gameConfig.gameBounds.width
    );
    this.player.y = Phaser.Math.Clamp(
      this.player.y,
      gameConfig.gameBounds.y,
      gameConfig.gameBounds.y + gameConfig.gameBounds.height
    );
  }

  updateEnemies() {
    this.enemies.getChildren().forEach(enemy => {
      const enemyType = enemy.getData('type');
      
      // 更新敵人移動
      const angle = Phaser.Math.Angle.Between(
        enemy.x,
        enemy.y,
        this.player.x,
        this.player.y
      );

      enemy.setVelocity(
        Math.cos(angle) * enemyType.speed,
        Math.sin(angle) * enemyType.speed
      );
      
      // 特殊敵人行為
      if (enemyType.key === 'shooter') {
        this.updateShooterEnemy(enemy);
      } else if (enemyType.key === 'elite') {
        this.updateEliteEnemy(enemy);
      }
    });
  }

  updateCoins() {
    this.coins.getChildren().forEach(coin => {
      const distance = Phaser.Math.Distance.Between(
        coin.x,
        coin.y,
        this.player.x,
        this.player.y
      );

      if (distance < gameConfig.coin.attractRange) {
        const angle = Phaser.Math.Angle.Between(
          coin.x,
          coin.y,
          this.player.x,
          this.player.y
        );

        coin.setVelocity(
          Math.cos(angle) * gameConfig.coin.attractSpeed,
          Math.sin(angle) * gameConfig.coin.attractSpeed
        );
      }
    });
  }

  updateShooting() {
    const currentTime = this.time.now;
    if (currentTime - this.lastShot > gameConfig.player.shootInterval) {
      let nearestEnemy = null;
      let minDistance = Infinity;
      
      this.enemies.getChildren().forEach(enemy => {
        const distance = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          enemy.x,
          enemy.y
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          nearestEnemy = enemy;
        }
      });

      if (nearestEnemy) {
        this.shoot(nearestEnemy);
        this.lastShot = currentTime;
      }
    }
  }

  cleanupBullets() {
    this.bullets.getChildren().forEach(bullet => {
      if (bullet.x < 0 || bullet.x > gameConfig.width || 
          bullet.y < 0 || bullet.y > gameConfig.height) {
        bullet.destroy();
      }
    });
  }

  shoot(target) {
    const bullet = this.physics.add.sprite(this.player.x, this.player.y, 'bullet');
    
    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      target.x,
      target.y
    );
    
    bullet.setVelocity(
      Math.cos(angle) * gameConfig.bullet.speed,
      Math.sin(angle) * gameConfig.bullet.speed
    );
    
    this.bullets.add(bullet);
  }

  spawnEnemy() {
    let x, y;
    const side = Phaser.Math.Between(0, 3);
    
    switch(side) {
      case 0:
        x = Phaser.Math.Between(gameConfig.gameBounds.x, gameConfig.gameBounds.x + gameConfig.gameBounds.width);
        y = gameConfig.gameBounds.y;
        break;
      case 1:
        x = gameConfig.gameBounds.x + gameConfig.gameBounds.width;
        y = Phaser.Math.Between(gameConfig.gameBounds.y, gameConfig.gameBounds.y + gameConfig.gameBounds.height);
        break;
      case 2:
        x = Phaser.Math.Between(gameConfig.gameBounds.x, gameConfig.gameBounds.x + gameConfig.gameBounds.width);
        y = gameConfig.gameBounds.y + gameConfig.gameBounds.height;
        break;
      case 3:
        x = gameConfig.gameBounds.x;
        y = Phaser.Math.Between(gameConfig.gameBounds.y, gameConfig.gameBounds.y + gameConfig.gameBounds.height);
        break;
    }

    const warning = this.add.graphics();
    warning.lineStyle(2, 0xff0000);
    warning.lineBetween(x - 8, y - 8, x + 8, y + 8);
    warning.lineBetween(x - 8, y + 8, x + 8, y - 8);
    
    this.time.delayedCall(1000, () => {
      warning.destroy();
      
      // 根據當前關卡配置選擇敵人類型
      const levelConfig = this.levelSystem.getCurrentLevelConfig();
      const totalWeight = levelConfig.enemies.reduce((sum, enemy) => sum + enemy.weight, 0);
      let random = Phaser.Math.Between(0, totalWeight);
      
      let selectedType = 'normal';
      for (const enemy of levelConfig.enemies) {
        if (random <= enemy.weight) {
          selectedType = enemy.type;
          break;
        }
        random -= enemy.weight;
      }
      
      const enemyType = enemyTypes[selectedType];
      const enemy = this.physics.add.sprite(x, y, enemyType.key);
      enemy.setData('type', enemyType);
      enemy.setData('health', enemyType.health);
      
      // 設置特殊敵人的行為
      if (enemyType.key === 'shooter') {
        enemy.setData('lastShot', 0);
      } else if (enemyType.key === 'elite') {
        enemy.setData('charging', false);
        enemy.setData('chargeStartTime', 0);
      }
      
      this.enemies.add(enemy);
    });
  }

  updateShooterEnemy(enemy) {
    const currentTime = this.time.now;
    const lastShot = enemy.getData('lastShot');
    const enemyType = enemy.getData('type');
    
    if (currentTime - lastShot > enemyType.shootInterval) {
      this.shootEnemyBullet(enemy);
      enemy.setData('lastShot', currentTime);
    }
  }

  updateEliteEnemy(enemy) {
    const enemyType = enemy.getData('type');
    const charging = enemy.getData('charging');
    const chargeStartTime = enemy.getData('chargeStartTime');
    const currentTime = this.time.now;
    
    if (!charging) {
      // 開始蓄力
      enemy.setData('charging', true);
      enemy.setData('chargeStartTime', currentTime);
      enemy.setTint(0xff0000);
    } else if (currentTime - chargeStartTime > enemyType.chargeTime) {
      // 衝刺
      const angle = Phaser.Math.Angle.Between(
        enemy.x,
        enemy.y,
        this.player.x,
        this.player.y
      );
      
      enemy.setVelocity(
        Math.cos(angle) * enemyType.chargeSpeed,
        Math.sin(angle) * enemyType.chargeSpeed
      );
      
      // 重置蓄力狀態
      enemy.setData('charging', false);
      enemy.clearTint();
    }
  }

  shootEnemyBullet(enemy) {
    const bullet = this.physics.add.sprite(enemy.x, enemy.y, 'bullet');
    bullet.setTint(0xff0000);
    
    const angle = Phaser.Math.Angle.Between(
      enemy.x,
      enemy.y,
      this.player.x,
      this.player.y
    );
    
    const enemyType = enemy.getData('type');
    bullet.setVelocity(
      Math.cos(angle) * enemyType.bulletSpeed,
      Math.sin(angle) * enemyType.bulletSpeed
    );
    
    this.enemyBullets.add(bullet);
  }

  bulletHitEnemy(bullet, enemy) {
    const enemyType = enemy.getData('type');
    let health = enemy.getData('health');
    health -= gameConfig.bullet.damage;
    
    if (health <= 0) {
      const particles = this.add.particles(0, 0, enemyType.key, {
        x: enemy.x,
        y: enemy.y,
        speed: { min: 100, max: 200 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 150,
        quantity: 10,
        blendMode: 'ADD'
      });

      this.time.delayedCall(150, () => {
        particles.destroy();
      });

      const coinCount = Phaser.Math.Between(1, 3);
      for (let i = 0; i < coinCount; i++) {
        const coin = this.physics.add.sprite(enemy.x, enemy.y, 'coin');
        this.coins.add(coin);
      }

      bullet.destroy();
      enemy.destroy();
    } else {
      enemy.setData('health', health);
      bullet.destroy();
    }
  }

  playerHitEnemyBullet(player, bullet) {
    bullet.destroy();
    this.playerHealth -= bullet.damage;
    UISystem.updateHealthBar(this.ui.healthBar, this.playerHealth, this.maxHealth);
    
    // 播放受傷閃光效果
    this.playHitFlash();
    
    if (this.playerHealth <= 0) {
      this.levelSystem.gameOver();
    }
  }

  playerHitEnemy(player, enemy) {
    enemy.destroy();
    this.playerHealth -= enemy.damage;
    UISystem.updateHealthBar(this.ui.healthBar, this.playerHealth, this.maxHealth);
    
    // 播放受傷閃光效果
    this.playHitFlash();
    
    if (this.playerHealth <= 0) {
      this.levelSystem.gameOver();
    }
  }

  collectCoin(player, coin) {
    const text = this.add.text(coin.x, coin.y - 20, '+' + gameConfig.coin.value, {
      fontSize: '16px',
      fill: '#ffd700',
      fontFamily: '"Big Shoulders Display", sans-serif'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: text,
      y: coin.y - 40,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        text.destroy();
      }
    });

    coin.destroy();
    this.money += gameConfig.coin.value;
    this.ui.moneyText.setText('Money: ' + this.money);
  }

  playHitFlash() {
    // 設置紅色閃光
    this.hitFlash.clear();
    this.hitFlash.fillStyle(0xff0000, 0.3);
    this.hitFlash.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.hitFlash.setAlpha(0.3);
    
    // 閃光動畫
    this.tweens.add({
      targets: this.hitFlash,
      alpha: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.hitFlash.setAlpha(0);
      }
    });
    
    // 更新低血量邊框
    this.updateLowHealthBorder();
  }

  updateLowHealthBorder() {
    const healthPercentage = this.playerHealth / this.maxHealth;
    if (healthPercentage <= 0.2) {
      // 設置低血量紅色邊框
      this.lowHealthBorder.clear();
      this.lowHealthBorder.lineStyle(4, 0xff0000, 0.5);
      this.lowHealthBorder.strokeRect(0, 0, this.cameras.main.width, this.cameras.main.height);
      this.lowHealthBorder.setAlpha(0.5);
    } else {
      this.lowHealthBorder.setAlpha(0);
    }
  }

  levelComplete() {
    // 停止遊戲邏輯
    this.isLevelComplete = true;
    
    // 創建下一關 UI
    this.nextStageUI = UISystem.createNextStageUI(this);
    
    // 添加下一關按鈕點擊事件
    this.nextStageUI.nextStageButton.on('pointerdown', () => {
      // 移除下一關 UI
      this.nextStageUI.overlay.destroy();
      this.nextStageUI.nextStageText.destroy();
      this.nextStageUI.nextStageButton.destroy();
      
      // 開始下一關
      this.isLevelComplete = false;
      this.levelSystem.startNextLevel();
    });
  }
} 