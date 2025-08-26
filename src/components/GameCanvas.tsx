import React, { useRef, useEffect } from 'react'
import { GameState } from '../types/GameTypes'
import './GameCanvas.css'

interface GameCanvasProps {
  gameState: GameState
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 绘制背景
    drawBackground(ctx, canvas.width, canvas.height)

    // 绘制旋风斩效果
    drawWhirlwindEffect(ctx, gameState.player)

    // 绘制投射物
    gameState.projectiles.forEach(projectile => {
      drawProjectile(ctx, projectile)
    })

    // 绘制敌人
    gameState.enemies.forEach(enemy => {
      drawEnemy(ctx, enemy)
    })

    // 绘制玩家
    drawPlayer(ctx, gameState.player)

    // 绘制UI元素
    drawUI(ctx, gameState)

  }, [gameState])

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 绘制深色背景
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, width, height)

    // 绘制网格
    ctx.strokeStyle = '#16213e'
    ctx.lineWidth = 1
    const gridSize = 50

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }

  const drawPlayer = (ctx: CanvasRenderingContext2D, player: GameState['player']) => {
    // 绘制玩家（旋风斩角色）
    ctx.save()
    
    // 玩家主体
    ctx.fillStyle = '#4ecdc4'
    ctx.beginPath()
    ctx.arc(player.x, player.y, 20, 0, Math.PI * 2)
    ctx.fill()

    // 玩家边框
    ctx.strokeStyle = '#45b7aa'
    ctx.lineWidth = 3
    ctx.stroke()

    // 旋风斩指示器
    ctx.strokeStyle = '#ff6b6b'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.arc(player.x, player.y, 80, 0, Math.PI * 2)
    ctx.stroke()

    ctx.restore()
  }

  const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: GameState['enemies'][0]) => {
    let color: string
    let size: number

    switch (enemy.type) {
      case 'zombie':
        color = '#8b4513'
        size = 15
        break
      case 'skeleton':
        color = '#f5f5dc'
        size = 12
        break
      case 'demon':
        color = '#8b0000'
        size = 18
        break
      default:
        color = '#666'
        size = 15
    }

    // 绘制敌人
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(enemy.x, enemy.y, size, 0, Math.PI * 2)
    ctx.fill()

    // 绘制血条
    const healthBarWidth = size * 2
    const healthBarHeight = 4
    const healthPercentage = enemy.health / enemy.maxHealth

    ctx.fillStyle = '#ff0000'
    ctx.fillRect(enemy.x - healthBarWidth / 2, enemy.y - size - 10, healthBarWidth, healthBarHeight)

    ctx.fillStyle = '#00ff00'
    ctx.fillRect(enemy.x - healthBarWidth / 2, enemy.y - size - 10, healthBarWidth * healthPercentage, healthBarHeight)
  }

  const drawProjectile = (ctx: CanvasRenderingContext2D, projectile: GameState['projectiles'][0]) => {
    // 绘制旋风斩视觉效果
    ctx.save()
    
    const alpha = 1 - (projectile.lifetime / projectile.maxLifetime)
    ctx.globalAlpha = alpha

    ctx.strokeStyle = '#ff6b6b'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2)
    ctx.stroke()

    ctx.restore()
  }

  const drawWhirlwindEffect = (ctx: CanvasRenderingContext2D, player: GameState['player']) => {
    // 绘制旋风斩特效
    ctx.save()
    
    const time = Date.now() * 0.01
    const radius = 80
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time
      const x = player.x + Math.cos(angle) * radius
      const y = player.y + Math.sin(angle) * radius
      
      ctx.fillStyle = `rgba(255, 107, 107, ${0.3 + 0.2 * Math.sin(time + i)})`
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  const drawUI = (ctx: CanvasRenderingContext2D, gameState: GameState) => {
    // 绘制游戏时间
    ctx.fillStyle = '#ffffff'
    ctx.font = '16px Arial'
    ctx.fillText(`时间: ${Math.floor(gameState.gameTime)}s`, 10, 30)

    // 绘制分数
    ctx.fillText(`分数: ${gameState.score}`, 10, 50)

    // 绘制玩家等级
    ctx.fillText(`等级: ${gameState.player.level}`, 10, 70)

    // 绘制玩家血量
    const healthBarWidth = 200
    const healthBarHeight = 20
    const healthPercentage = gameState.player.health / gameState.player.maxHealth

    ctx.fillStyle = '#ff0000'
    ctx.fillRect(10, 90, healthBarWidth, healthBarHeight)

    ctx.fillStyle = '#00ff00'
    ctx.fillRect(10, 90, healthBarWidth * healthPercentage, healthBarHeight)

    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.strokeRect(10, 90, healthBarWidth, healthBarHeight)

    // 血量文字
    ctx.fillStyle = '#ffffff'
    ctx.font = '14px Arial'
    ctx.fillText(`${Math.floor(gameState.player.health)}/${gameState.player.maxHealth}`, 15, 105)
  }

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="game-canvas"
      tabIndex={0}
    />
  )
}

export default GameCanvas
