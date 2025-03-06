export const gameConfig = {
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  gameBounds: {
    x: 0,
    y: 0,
    width: 800,
    height: 600
  },
  player: {
    health: 100,
    initialSpeed: 200,
    initialShootInterval: 500,
    speed: 200,
    shootInterval: 500
  },
  enemy: {
    speed: 80,
    spawnRate: 1,
    damage: 20,
    health: 20
  },
  bullet: {
    speed: 400,
    initialDamage: 20,
    damage: 20
  },
  coin: {
    value: 10,
    attractRange: 200,
    attractSpeed: 400,
    levelEndSpeed: 600
  },
  level: {
    duration: 30,
    warningTime: 5
  },
  upgrade: {
    health: {
      cost: 50,
      increase: 20
    },
    damage: {
      cost: 50,
      increase: 5
    },
    speed: {
      cost: 50,
      increase: 20
    },
    shootInterval: {
      cost: 50,
      decrease: 50
    }
  }
}; 