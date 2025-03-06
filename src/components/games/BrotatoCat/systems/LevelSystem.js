import { levelConfigs } from '../config/enemyConfig';
import { UISystem } from './UISystem';

export class LevelSystem {
  constructor(scene) {
    this.scene = scene;
    this.level = 1;
    this.levelTime = 0;
    this.levelTimer = null;
    this.isLevelComplete = false;
    this.isGameOver = false;
    this.isLevelEnding = false;
    this.levelDuration = this.scene.gameConfig.level.duration;
    this.startTime = Date.now();
  }

  startLevel() {
    this.isLevelComplete = false;
    this.isGameOver = false;
    this.isLevelEnding = false;
    this.levelTime = this.scene.gameConfig.level.duration;
    this.scene.ui.timeNumber.setText(this.levelTime);
    this.scene.ui.timeNumber.setColor('#ffffff');
    this.startLevelTimer();
  }

  startLevelTimer() {
    if (this.levelTimer) {
      this.levelTimer.remove();
    }
    
    this.levelTimer = this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.levelTime--;
        this.scene.ui.timeNumber.setText(this.levelTime);
        
        if (this.levelTime <= this.scene.gameConfig.level.warningTime) {
          this.scene.ui.timeNumber.setColor('#ff0000');
        }
        
        if (this.levelTime <= 0) {
          this.completeLevel();
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  stopAllGameObjects() {
    // 停止所有敵人的移動
    this.scene.enemies.getChildren().forEach(enemy => {
      enemy.setVelocity(0, 0);
      enemy.destroy();
    });
    
    // 停止所有子彈
    this.scene.bullets.getChildren().forEach(bullet => {
      bullet.setVelocity(0, 0);
      bullet.destroy();
    });
    
    // 停止玩家移動
    this.scene.player.setVelocity(0, 0);
    this.scene.player.setImmovable(true);
    
    // 取消所有等待中的計時器
    this.scene.time.removeAllEvents();
  }

  cleanupUI() {
    const uiElements = [
      'overlay',
      'gameOverText',
      'finalScoreText',
      'restartButton',
      'nextStageText',
      'nextStageButton'
    ];
    
    uiElements.forEach(element => {
      if (this.scene.ui[element]) {
        this.scene.ui[element].destroy();
        this.scene.ui[element] = null;
      }
    });
  }

  gameOver() {
    this.isGameOver = true;
    this.isLevelComplete = true;
    this.levelTimer.remove();
    this.stopAllGameObjects();
    
    // 清理現有的 UI
    this.cleanupUI();
    
    // 創建遊戲結束 UI
    const uiElements = this.scene.ui.createGameOverUI(this.scene.money);
    
    // 保存 UI 元素到 scene.ui
    this.scene.ui.overlay = uiElements.overlay;
    this.scene.ui.gameOverText = uiElements.gameOverText;
    this.scene.ui.finalScoreText = uiElements.finalScoreText;
    this.scene.ui.restartButton = uiElements.restartButton;
    
    // 添加重新開始按鈕事件
    this.scene.ui.restartButton.on('pointerdown', () => {
      this.restartGame();
    });
  }

  restartGame() {
    // 停止所有遊戲物件
    this.stopAllGameObjects();
    
    // 清理所有遊戲物件
    this.scene.enemies.clear(true, true);
    this.scene.bullets.clear(true, true);
    this.scene.enemyBullets.clear(true, true);
    this.scene.coins.clear(true, true);
    
    // 重置玩家狀態
    this.scene.playerHealth = this.scene.gameConfig.player.health;
    this.scene.maxHealth = this.scene.gameConfig.player.health;
    this.scene.money = 0;
    this.scene.ui.moneyText.setText('MONEY 0');
    UISystem.updateHealthBar(this.scene.ui.healthBar, this.scene.playerHealth, this.scene.maxHealth);
    
    // 重置遊戲配置
    this.scene.gameConfig.bullet.damage = this.scene.gameConfig.bullet.initialDamage;
    this.scene.gameConfig.player.speed = this.scene.gameConfig.player.initialSpeed;
    this.scene.gameConfig.player.shootInterval = this.scene.gameConfig.player.initialShootInterval;
    
    // 更新升級按鈕狀態
    UISystem.updateUpgradeButtons(this.scene.ui.upgradeButtons, 0);
    
    // 清理 UI
    this.cleanupUI();
    
    // 重置關卡系統
    this.level = 1;
    this.scene.ui.levelText.setText('STAGE 1');
    
    // 重置玩家位置
    this.scene.player.setPosition(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY
    );
    this.scene.player.setImmovable(false);
    
    this.startLevel();
  }

  completeLevel() {
    if (this.isLevelEnding) return;
    
    this.isLevelEnding = true;
    this.isLevelComplete = true;
    this.levelTimer.remove();
    
    // 立即停止所有遊戲物件
    this.stopAllGameObjects();
    
    // 等待一小段時間後再開始吸錢動畫
    this.scene.time.delayedCall(500, () => {
      const coins = this.scene.coins.getChildren();
      coins.forEach(coin => {
        const angle = Phaser.Math.Angle.Between(
          coin.x,
          coin.y,
          this.scene.player.x,
          this.scene.player.y
        );

        coin.setVelocity(
          Math.cos(angle) * this.scene.gameConfig.coin.levelEndSpeed,
          Math.sin(angle) * this.scene.gameConfig.coin.levelEndSpeed
        );
      });

      // 創建下一關 UI
      const uiElements = UISystem.createNextStageUI(this.scene);
      
      // 保存 UI 元素到 scene.ui
      this.scene.ui.overlay = uiElements.overlay;
      this.scene.ui.nextStageText = uiElements.nextStageText;
      this.scene.ui.nextStageButton = uiElements.nextStageButton;
      
      // 添加下一關按鈕事件
      this.scene.ui.nextStageButton.on('pointerdown', () => {
        this.nextLevel();
      });
    });
  }

  nextLevel() {
    this.level++;
    this.scene.ui.levelText.setText('STAGE ' + this.level);
    this.levelTime = this.scene.gameConfig.level.duration;
    this.scene.ui.timeNumber.setText(this.levelTime);
    this.scene.ui.timeNumber.setColor('#ffffff');
    
    // 重置遊戲狀態
    this.isLevelComplete = false;
    this.scene.player.setImmovable(false);
    
    // 清理 UI
    this.cleanupUI();
    
    this.startLevelTimer();
  }

  getCurrentLevelConfig() {
    return levelConfigs[Math.min(this.level - 1, levelConfigs.length - 1)];
  }

  isLevelInProgress() {
    return this.levelTime > 0 && !this.isLevelComplete && !this.isLevelEnding;
  }

  getRemainingTime() {
    return this.levelTime;
  }
} 