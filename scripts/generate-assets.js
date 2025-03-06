const fs = require('fs');
const { createCanvas } = require('canvas');

// 确保 assets 目录存在
if (!fs.existsSync('public/assets')) {
  fs.mkdirSync('public/assets', { recursive: true });
}

// 创建玩家图片
function createPlayerImage() {
  const canvas = createCanvas(32, 32);
  const ctx = canvas.getContext('2d');

  // 绘制玩家主体（蓝色圆形）
  ctx.beginPath();
  ctx.arc(16, 16, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#4a90e2';
  ctx.fill();
  ctx.strokeStyle = '#2171c7';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 绘制眼睛
  ctx.beginPath();
  ctx.arc(12, 12, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // 保存图片
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('public/assets/player.png', buffer);
}

// 创建子弹图片
function createBulletImage() {
  const canvas = createCanvas(8, 8);
  const ctx = canvas.getContext('2d');

  // 绘制子弹（黄色圆形）
  ctx.beginPath();
  ctx.arc(4, 4, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#f1c40f';
  ctx.fill();
  ctx.strokeStyle = '#f39c12';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 保存图片
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('public/assets/bullet.png', buffer);
}

// 创建敌人图片
function createEnemyImage() {
  const canvas = createCanvas(24, 24);
  const ctx = canvas.getContext('2d');

  // 绘制敌人主体（红色方形）
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(4, 4, 16, 16);

  // 绘制眼睛
  ctx.beginPath();
  ctx.arc(10, 10, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // 保存图片
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('public/assets/enemy.png', buffer);
}

// 生成所有图片
createPlayerImage();
createBulletImage();
createEnemyImage();

console.log('游戏图片资源已生成！'); 