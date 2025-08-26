import { GameState, Enemy, Projectile } from '../types/GameTypes'

// const PLAYER_SPEED = 200 // 像素/秒 - 暂时未使用
const ENEMY_SPAWN_RATE = 0.5 // 每秒生成敌人数量
const WHIRLWIND_DAMAGE = 25
const WHIRLWIND_RADIUS = 80

export const updateGame = (gameState: GameState, deltaTime: number, inputState?: any): GameState => {
  const dt = deltaTime / 1000 // 转换为秒

  // 更新游戏时间
  const newGameTime = gameState.gameTime + dt

  // 更新玩家位置（传入输入状态）
  const updatedPlayer = updatePlayerPosition(gameState.player, dt, inputState)

  // 生成敌人
  const newEnemies = [...gameState.enemies]
  if (Math.random() < ENEMY_SPAWN_RATE * dt) {
    newEnemies.push(spawnEnemy())
  }

  // 更新敌人位置和状态
  const updatedEnemies = newEnemies.map(enemy => updateEnemy(enemy, gameState.player, dt))

  // 更新旋风斩效果
  const { updatedEnemies: enemiesAfterWhirlwind, newProjectiles } = 
    updateWhirlwindEffect(updatedPlayer, updatedEnemies, gameState.projectiles, dt)

  // 更新投射物
  const updatedProjectiles = newProjectiles.map(projectile => updateProjectile(projectile, dt))

  // 检查碰撞
  const { finalEnemies, finalProjectiles, newScore, playerDamage } = 
    checkCollisions(updatedPlayer, enemiesAfterWhirlwind, updatedProjectiles)

  // 更新玩家状态
  const finalPlayer = {
    ...updatedPlayer,
    health: Math.max(0, updatedPlayer.health - playerDamage)
  }

  // 检查游戏结束
  const isGameOver = updatedPlayer.health <= 0

  return {
    ...gameState,
    player: finalPlayer,
    enemies: finalEnemies,
    projectiles: finalProjectiles,
    gameTime: newGameTime,
    score: gameState.score + newScore,
    isGameOver
  }
}

const spawnEnemy = (): Enemy => {
  const side = Math.floor(Math.random() * 4)
  let x: number, y: number

  switch (side) {
    case 0: // 上
      x = Math.random() * 800
      y = -50
      break
    case 1: // 右
      x = 850
      y = Math.random() * 600
      break
    case 2: // 下
      x = Math.random() * 800
      y = 650
      break
    case 3: // 左
      x = -50
      y = Math.random() * 600
      break
    default:
      x = 400
      y = 300
  }

  const types: Enemy['type'][] = ['zombie', 'skeleton', 'demon']
  const type = types[Math.floor(Math.random() * types.length)]

  return {
    id: Math.random().toString(36).substr(2, 9),
    x,
    y,
    health: type === 'demon' ? 80 : type === 'skeleton' ? 60 : 40,
    maxHealth: type === 'demon' ? 80 : type === 'skeleton' ? 60 : 40,
    speed: type === 'demon' ? 60 : type === 'skeleton' ? 80 : 100,
    damage: type === 'demon' ? 20 : type === 'skeleton' ? 15 : 10,
    type
  }
}

const updateEnemy = (enemy: Enemy, player: GameState['player'], dt: number): Enemy => {
  // 简单的AI：敌人向玩家移动
  const dx = player.x - enemy.x
  const dy = player.y - enemy.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance > 0) {
    const speed = enemy.speed * dt
    const moveX = (dx / distance) * speed
    const moveY = (dy / distance) * speed

    return {
      ...enemy,
      x: enemy.x + moveX,
      y: enemy.y + moveY
    }
  }

  return enemy
}

const updateWhirlwindEffect = (
  player: GameState['player'],
  enemies: Enemy[],
  projectiles: Projectile[],
  dt: number
) => {
  const newProjectiles: Projectile[] = [...projectiles]
  const updatedEnemies: Enemy[] = []

  // 旋风斩持续伤害
  enemies.forEach(enemy => {
    const dx = enemy.x - player.x
    const dy = enemy.y - player.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= WHIRLWIND_RADIUS) {
      // 敌人在旋风斩范围内，受到伤害
      const damage = WHIRLWIND_DAMAGE * dt
      const newHealth = Math.max(0, enemy.health - damage)
      
      if (newHealth > 0) {
        updatedEnemies.push({ ...enemy, health: newHealth })
      }
      // 如果敌人死亡，不添加到更新后的敌人列表中
    } else {
      updatedEnemies.push(enemy)
    }
  })

  // 生成旋风斩视觉效果（投射物）
  if (Math.random() < 0.3) { // 30%概率生成视觉效果
    const angle = Math.random() * Math.PI * 2
    const speed = 150
    newProjectiles.push({
      id: Math.random().toString(36).substr(2, 9),
      x: player.x + Math.cos(angle) * WHIRLWIND_RADIUS * 0.5,
      y: player.y + Math.sin(angle) * WHIRLWIND_RADIUS * 0.5,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      damage: 0, // 视觉效果，不造成伤害
      lifetime: 0,
      maxLifetime: 0.5
    })
  }

  return { updatedEnemies, newProjectiles }
}

const updateProjectile = (projectile: Projectile, dt: number): Projectile => {
  return {
    ...projectile,
    x: projectile.x + projectile.vx * dt,
    y: projectile.y + projectile.vy * dt,
    lifetime: projectile.lifetime + dt
  }
}

const updatePlayerPosition = (player: GameState['player'], dt: number, inputState?: any): GameState['player'] => {
  if (!inputState) {
    console.log('No input state provided')
    return player
  }
  
  console.log('Input state:', inputState)
  console.log('Player position before:', player.x, player.y)
  
  const PLAYER_SPEED = 200 // 像素/秒
  let newX = player.x
  let newY = player.y
  
  // 根据输入状态移动玩家
  if (inputState.up) {
    newY -= PLAYER_SPEED * dt
    console.log('Moving up, new Y:', newY)
  }
  if (inputState.down) {
    newY += PLAYER_SPEED * dt
    console.log('Moving down, new Y:', newY)
  }
  if (inputState.left) {
    newX -= PLAYER_SPEED * dt
    console.log('Moving left, new X:', newX)
  }
  if (inputState.right) {
    newX += PLAYER_SPEED * dt
    console.log('Moving right, new X:', newX)
  }
  
  // 限制玩家在画布范围内
  newX = Math.max(20, Math.min(780, newX))
  newY = Math.max(20, Math.min(580, newY))
  
  console.log('Player position after:', newX, newY)
  
  return {
    ...player,
    x: newX,
    y: newY
  }
}

const checkCollisions = (
  player: GameState['player'],
  enemies: Enemy[],
  projectiles: Projectile[]
) => {
  let newScore = 0
  let playerDamage = 0

  // 过滤掉过期的投射物
  const validProjectiles = projectiles.filter(p => p.lifetime < p.maxLifetime)

  // 检查敌人是否死亡（血量<=0）
  const aliveEnemies = enemies.filter(enemy => enemy.health > 0)

  // 检查敌人与玩家的碰撞
  aliveEnemies.forEach(enemy => {
    const dx = enemy.x - player.x
    const dy = enemy.y - player.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 30) { // 碰撞半径
      playerDamage += enemy.damage * 0.1 // 持续伤害
    }
  })

  return {
    finalEnemies: aliveEnemies,
    finalProjectiles: validProjectiles,
    newScore,
    playerDamage
  }
}
