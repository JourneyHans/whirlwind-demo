export interface Player {
  x: number
  y: number
  health: number
  maxHealth: number
  level: number
  experience: number
  experienceToNext: number
}

export interface Enemy {
  id: string
  x: number
  y: number
  health: number
  maxHealth: number
  speed: number
  damage: number
  type: 'zombie' | 'skeleton' | 'demon'
}

export interface Projectile {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  damage: number
  lifetime: number
  maxLifetime: number
}

export interface GameState {
  player: Player
  enemies: Enemy[]
  projectiles: Projectile[]
  gameTime: number
  score: number
  isGameOver: boolean
  isPaused: boolean
}

export interface InputState {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

export interface TouchState {
  isActive: boolean
  startX: number
  startY: number
  currentX: number
  currentY: number
  deltaX: number
  deltaY: number
}

export interface VirtualJoystick {
  isActive: boolean
  centerX: number
  centerY: number
  currentX: number
  currentY: number
  radius: number
}
