export class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: 'Preloader' });
  }

  preload() {
    // 創建載入進度條
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, '載入中...', {
      font: '20px monospace',
      fill: '#ffffff'
    });
    loadingText.setOrigin(0.5, 0.5);

    // 監聽載入進度
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // 監聽載入完成
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      this.scene.start('GameScene');
    });

    // 監聽載入錯誤
    this.load.on('loaderror', (file) => {
      console.error('載入錯誤:', file);
      loadingText.setText('載入失敗，請重新整理頁面');
      loadingText.setColor('#ff0000');
    });

    // 載入圖片
    this.load.image('player', '/assets/charachers/cat_1.png');
  }
} 