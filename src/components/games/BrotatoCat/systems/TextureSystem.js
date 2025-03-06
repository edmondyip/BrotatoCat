import { enemyTypes } from '../config/enemyConfig';

export class TextureSystem {
  static createTextures(scene) {
    // 創建子彈紋理
    const bulletGraphics = scene.add.graphics();
    bulletGraphics.fillStyle(0xffffff);
    bulletGraphics.fillCircle(4, 4, 4);
    bulletGraphics.generateTexture('bullet', 8, 8);
    bulletGraphics.destroy();

    // 創建金幣紋理
    const coinGraphics = scene.add.graphics();
    coinGraphics.fillStyle(0xffd700);
    coinGraphics.fillCircle(4, 4, 4);
    coinGraphics.generateTexture('coin', 8, 8);
    coinGraphics.destroy();

    // 創建敵人紋理
    Object.entries(enemyTypes).forEach(([key, type]) => {
      const enemyGraphics = scene.add.graphics();
      
      // 根據敵人類型設置不同的顏色
      let color;
      switch(key) {
        case 'normal':
          color = 0xff0000;
          break;
        case 'tank':
          color = 0x00ff00;
          break;
        case 'speedy':
          color = 0x0000ff;
          break;
        case 'shooter':
          color = 0xff00ff;
          break;
        case 'elite':
          color = 0xffff00;
          break;
        default:
          color = 0xff0000;
      }
      
      enemyGraphics.fillStyle(color);
      enemyGraphics.fillCircle(8, 8, 8);
      enemyGraphics.generateTexture(key, 16, 16);
      enemyGraphics.destroy();
    });
  }
} 