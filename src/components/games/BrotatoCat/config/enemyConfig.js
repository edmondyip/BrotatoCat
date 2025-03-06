export const enemyTypes = {
  normal: {
    key: 'normal',
    health: 20,
    speed: 100,
    damage: 10,
    shootInterval: 2000,
    bulletSpeed: 200,
    chargeTime: 1000,
    chargeSpeed: 300
  },
  tank: {
    key: 'tank',
    health: 80,
    speed: 50,
    damage: 20,
    shootInterval: 3000,
    bulletSpeed: 150,
    chargeTime: 1500,
    chargeSpeed: 200
  },
  speedy: {
    key: 'speedy',
    health: 15,
    speed: 200,
    damage: 5,
    shootInterval: 1500,
    bulletSpeed: 250,
    chargeTime: 800,
    chargeSpeed: 400
  },
  shooter: {
    key: 'shooter',
    health: 30,
    speed: 80,
    damage: 15,
    shootInterval: 1500,
    bulletSpeed: 250,
    chargeTime: 1000,
    chargeSpeed: 250
  },
  elite: {
    key: 'elite',
    health: 150,
    speed: 120,
    damage: 30,
    shootInterval: 1000,
    bulletSpeed: 300,
    chargeTime: 2000,
    chargeSpeed: 350
  }
};

export const levelConfigs = [
  {
    enemies: [
      { type: 'normal', weight: 100 }
    ],
    spawnRate: 0.75,
    duration: 30
  },
  {
    enemies: [
      { type: 'normal', weight: 100 }
    ],
    spawnRate: 2.5,
    duration: 30
  },
  {
    enemies: [
      { type: 'normal', weight: 50 },
      { type: 'speedy', weight: 30 },
      { type: 'shooter', weight: 20 }
    ],
    spawnRate: 3,
    duration: 30
  },
  {
    enemies: [
      { type: 'normal', weight: 40 },
      { type: 'speedy', weight: 25 },
      { type: 'shooter', weight: 25 },
      { type: 'tank', weight: 10 }
    ],
    spawnRate: 3.5,
    duration: 30
  },
  {
    enemies: [
      { type: 'normal', weight: 30 },
      { type: 'speedy', weight: 20 },
      { type: 'shooter', weight: 30 },
      { type: 'tank', weight: 15 },
      { type: 'elite', weight: 5 }
    ],
    spawnRate: 4,
    duration: 30
  }
]; 