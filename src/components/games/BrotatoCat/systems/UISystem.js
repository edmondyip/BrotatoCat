import { gameConfig } from '../config/gameConfig';

export class UISystem {
  static createUI(scene, gameConfig) {
    const ui = {
      // 金錢文字
      moneyText: scene.add.text(16, 16, 'MONEY 0', {
        fontSize: '24px',
        fill: '#ffd700',
        fontFamily: '"Big Shoulders Display", sans-serif'
      }),
      
      // 關卡文字
      levelText: scene.add.text(400, 584, 'STAGE 1', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: '"Big Shoulders Display", sans-serif'
      }).setOrigin(0.5),
      
      // 時間文字
      timeText: scene.add.text(400, 16, 'TIME', {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: '"Big Shoulders Display", sans-serif'
      }).setOrigin(0.5),
      
      // 時間數字
      timeNumber: scene.add.text(400, 40, gameConfig.level.duration, {
        fontSize: '32px',
        fill: '#ffffff',
        fontFamily: '"Big Shoulders Display", sans-serif'
      }).setOrigin(0.5),
      
      // 玩家血條背景
      healthBarBg: scene.add.graphics(),
      
      // 玩家血條
      healthBar: scene.add.graphics(),
      
      // 升級按鈕
      upgradeButtons: [
        {
          key: 'health',
          button: scene.add.text(16, 150, 'HEALTH +20 (100)', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: '"Big Shoulders Display", sans-serif'
          }).setInteractive()
        },
        {
          key: 'damage',
          button: scene.add.text(16, 180, 'DAMAGE +5 (100)', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: '"Big Shoulders Display", sans-serif'
          }).setInteractive()
        },
        {
          key: 'speed',
          button: scene.add.text(16, 210, 'SPEED +10 (100)', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: '"Big Shoulders Display", sans-serif'
          }).setInteractive()
        },
        {
          key: 'shootInterval',
          button: scene.add.text(16, 240, 'FIRE RATE +10% (100)', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: '"Big Shoulders Display", sans-serif'
          }).setInteractive()
        }
      ]
    };
    
    // 初始化血條
    UISystem.updateHealthBar(ui.healthBar, gameConfig.player.health, gameConfig.player.health);
    
    // 初始化升級按鈕狀態
    UISystem.updateUpgradeButtons(ui.upgradeButtons, 0);
    
    return ui;
  }

  static updateHealthBar(healthBar, currentHealth, maxHealth) {
    const barWidth = 40;
    const barHeight = 4;
    const healthPercentage = currentHealth / maxHealth;
    
    // 清除舊的血條
    healthBar.clear();
    
    // 繪製血條背景
    healthBar.fillStyle(0x000000, 0.5);
    healthBar.fillRect(-barWidth/2, -20, barWidth, barHeight);
    
    // 繪製血條
    healthBar.fillStyle(0x00ff00, 1);
    healthBar.fillRect(-barWidth/2, -20, barWidth * healthPercentage, barHeight);
  }

  static updateUpgradeButtons(buttons, money) {
    buttons.forEach(({ key, button }) => {
      const cost = gameConfig.upgrade[key].cost;
      if (money >= cost) {
        button.setColor('#ffffff');
        button.setInteractive();
      } else {
        button.setColor('#666666');
        button.disableInteractive();
      }
    });
  }

  static createGameOverUI(scene, finalMoney) {
    // 創建半透明黑色背景
    const overlay = scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
    
    // 創建遊戲結束文字
    const gameOverText = scene.add.text(400, 200, 'GAME OVER', {
      fontSize: '64px',
      fill: '#ff0000',
      fontFamily: '"Big Shoulders Display", sans-serif'
    }).setOrigin(0.5);
    
    // 創建最終得分文字
    const finalScoreText = scene.add.text(400, 300, `Final Score: ${finalMoney}`, {
      fontSize: '32px',
      fill: '#ffffff',
      fontFamily: '"Big Shoulders Display", sans-serif'
    }).setOrigin(0.5);
    
    // 創建重新開始按鈕
    const restartButton = scene.add.text(400, 400, 'RESTART', {
      fontSize: '32px',
      fill: '#ffffff',
      fontFamily: '"Big Shoulders Display", sans-serif'
    })
    .setOrigin(0.5)
    .setInteractive()
    .setPadding(20)
    .setStyle({ backgroundColor: '#333' })
    .setInteractive({ useHandCursor: true });
    
    // 添加按鈕懸停效果
    restartButton.on('pointerover', () => {
      restartButton.setStyle({ backgroundColor: '#444' });
    });
    
    restartButton.on('pointerout', () => {
      restartButton.setStyle({ backgroundColor: '#333' });
    });
    
    return {
      overlay,
      gameOverText,
      finalScoreText,
      restartButton
    };
  }

  static createNextStageUI(scene) {
    const overlay = scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
    
    const nextStageText = scene.add.text(400, 200, 'STAGE CLEAR!', {
      fontSize: '64px',
      fill: '#00ff00',
      fontFamily: '"Big Shoulders Display", sans-serif'
    }).setOrigin(0.5);
    
    const nextStageButton = scene.add.text(400, 300, 'NEXT STAGE', {
      fontSize: '32px',
      fill: '#ffffff',
      fontFamily: '"Big Shoulders Display", sans-serif'
    })
    .setOrigin(0.5)
    .setInteractive()
    .setPadding(20)
    .setStyle({ backgroundColor: '#333' })
    .setInteractive({ useHandCursor: true });
    
    // 添加按鈕懸停效果
    nextStageButton.on('pointerover', () => {
      nextStageButton.setStyle({ backgroundColor: '#444' });
    });
    
    nextStageButton.on('pointerout', () => {
      nextStageButton.setStyle({ backgroundColor: '#333' });
    });
    
    return {
      overlay,
      nextStageText,
      nextStageButton
    };
  }
} 