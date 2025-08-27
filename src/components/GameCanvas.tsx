import React, { useRef, useEffect, useState } from 'react'
import { GameState } from '../types/GameTypes'
import { useInputHandler } from '../hooks/useInputHandler'
import './GameCanvas.css'

interface GameCanvasProps {
  gameState: GameState
}

  const GameCanvas: React.FC<GameCanvasProps> = ({ gameState }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { 
      isMobile, 
      handleTouchStart, 
      handleTouchMove, 
      handleTouchEnd,
      handleJoystickTouchStart,
      handleJoystickTouchMove,
      handleJoystickTouchEnd,
      virtualJoystick
    } = useInputHandler()
    
    // 响应式画布尺寸
    const [scale, setScale] = useState(1)

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
    
    // 在移动设备上绘制虚拟摇杆
    if (isMobile) {
      drawVirtualJoystick(ctx)
    }

  }, [gameState])

  // 响应式画布尺寸调整
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current) return
      
      const canvas = canvasRef.current
      const container = canvas.parentElement
      if (!container) return
      
      const containerRect = container.getBoundingClientRect()
      const maxWidth = Math.min(800, containerRect.width - 40)
      const maxHeight = Math.min(600, containerRect.height - 40)
      
      // 保持宽高比
      const aspectRatio = 800 / 600
      let newWidth = maxWidth
      let newHeight = maxWidth / aspectRatio
      
      if (newHeight > maxHeight) {
        newHeight = maxHeight
        newWidth = maxHeight * aspectRatio
      }
      
      setScale(newWidth / 800)
      
      // 设置画布CSS尺寸
      canvas.style.width = `${newWidth}px`
      canvas.style.height = `${newHeight}px`
    }
    
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  // 触摸事件处理
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isMobile) return

    const canvasTouchStart = (event: TouchEvent) => {
      event.preventDefault()
      
      // 检查触摸位置是否在摇杆区域
      const touch = event.touches[0]
      const rect = canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
      
      // 摇杆区域（左下角）
      const joystickArea = {
        x: 100 * scale - 60 * scale,
        y: 500 * scale - 60 * scale,
        width: 120 * scale,
        height: 120 * scale
      }
      
      if (x >= joystickArea.x && x <= joystickArea.x + joystickArea.width &&
          y >= joystickArea.y && y <= joystickArea.y + joystickArea.height) {
        // 触摸在摇杆区域，使用摇杆触摸处理
        handleJoystickTouchStart(event)
      } else {
        // 触摸在其他区域，使用普通触摸处理
        handleTouchStart(event)
      }
    }

    const canvasTouchMove = (event: TouchEvent) => {
      event.preventDefault()
      
      if (virtualJoystick.isActive) {
        handleJoystickTouchMove(event)
      } else {
        handleTouchMove(event)
      }
    }

    const canvasTouchEnd = (event: TouchEvent) => {
      event.preventDefault()
      
      if (virtualJoystick.isActive) {
        handleJoystickTouchEnd()
      } else {
        handleTouchEnd()
      }
    }

    canvas.addEventListener('touchstart', canvasTouchStart, { passive: false })
    canvas.addEventListener('touchmove', canvasTouchMove, { passive: false })
    canvas.addEventListener('touchend', canvasTouchEnd, { passive: false })

    return () => {
      canvas.removeEventListener('touchstart', canvasTouchStart)
      canvas.removeEventListener('touchmove', canvasTouchMove)
      canvas.removeEventListener('touchend', canvasTouchEnd)
    }
  }, [isMobile, handleTouchStart, handleTouchMove, handleTouchEnd, handleJoystickTouchStart, handleJoystickTouchMove, handleJoystickTouchEnd, virtualJoystick.isActive, scale])

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 绘制深色背景
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, width, height)

    // 绘制网格
    ctx.strokeStyle = '#16213e'
    ctx.lineWidth = Math.max(1, 1 / scale)
    const gridSize = 50 * scale

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
    ctx.arc(player.x, player.y, 20 * scale, 0, Math.PI * 2)
    ctx.fill()

    // 玩家边框
    ctx.strokeStyle = '#45b7aa'
    ctx.lineWidth = Math.max(3, 3 * scale)
    ctx.stroke()

    // 旋风斩指示器
    ctx.strokeStyle = '#ff6b6b'
    ctx.lineWidth = Math.max(2, 2 * scale)
    ctx.setLineDash([5 * scale, 5 * scale])
    ctx.beginPath()
    ctx.arc(player.x, player.y, 80 * scale, 0, Math.PI * 2)
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
    ctx.arc(enemy.x, enemy.y, size * scale, 0, Math.PI * 2)
    ctx.fill()

    // 绘制血条
    const healthBarWidth = size * 2 * scale
    const healthBarHeight = 4 * scale
    const healthPercentage = enemy.health / enemy.maxHealth

    ctx.fillStyle = '#ff0000'
    ctx.fillRect(enemy.x - healthBarWidth / 2, enemy.y - size * scale - 10 * scale, healthBarWidth, healthBarHeight)

    ctx.fillStyle = '#00ff00'
    ctx.fillRect(enemy.x - healthBarWidth / 2, enemy.y - size * scale - 10 * scale, healthBarWidth * healthPercentage, healthBarHeight)
  }

  const drawProjectile = (ctx: CanvasRenderingContext2D, projectile: GameState['projectiles'][0]) => {
    // 绘制旋风斩视觉效果
    ctx.save()
    
    const alpha = 1 - (projectile.lifetime / projectile.maxLifetime)
    ctx.globalAlpha = alpha

    ctx.strokeStyle = '#ff6b6b'
    ctx.lineWidth = Math.max(2, 2 * scale)
    ctx.beginPath()
    ctx.arc(projectile.x, projectile.y, 3 * scale, 0, Math.PI * 2)
    ctx.stroke()

    ctx.restore()
  }

  const drawWhirlwindEffect = (ctx: CanvasRenderingContext2D, player: GameState['player']) => {
    // 绘制旋风斩特效
    ctx.save()
    
    const time = Date.now() * 0.01
    const radius = 80 * scale
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time
      const x = player.x + Math.cos(angle) * radius
      const y = player.y + Math.sin(angle) * radius
      
      ctx.fillStyle = `rgba(255, 107, 107, ${0.3 + 0.2 * Math.sin(time + i)})`
      ctx.beginPath()
      ctx.arc(x, y, 8 * scale, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  const drawUI = (ctx: CanvasRenderingContext2D, gameState: GameState) => {
    // 绘制游戏时间
    ctx.fillStyle = '#ffffff'
    ctx.font = `${Math.max(16, 16 * scale)}px Arial`
    ctx.fillText(`时间: ${Math.floor(gameState.gameTime)}s`, 10 * scale, 30 * scale)

    // 绘制分数
    ctx.fillText(`分数: ${gameState.score}`, 10 * scale, 50 * scale)

    // 绘制玩家等级
    ctx.fillText(`等级: ${gameState.player.level}`, 10 * scale, 70 * scale)

    // 绘制玩家血量
    const healthBarWidth = 200 * scale
    const healthBarHeight = 20 * scale
    const healthPercentage = gameState.player.health / gameState.player.maxHealth

    ctx.fillStyle = '#ff0000'
    ctx.fillRect(10 * scale, 90 * scale, healthBarWidth, healthBarHeight)

    ctx.fillStyle = '#00ff00'
    ctx.fillRect(10 * scale, 90 * scale, healthBarWidth * healthPercentage, healthBarHeight)

    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = Math.max(2, 2 * scale)
    ctx.strokeRect(10 * scale, 90 * scale, healthBarWidth, healthBarHeight)

    // 血量文字
    ctx.fillStyle = '#ffffff'
    ctx.font = `${Math.max(14, 14 * scale)}px Arial`
    ctx.fillText(`${Math.floor(gameState.player.health)}/${gameState.player.maxHealth}`, 15 * scale, 105 * scale)
  }

  const drawVirtualJoystick = (ctx: CanvasRenderingContext2D) => {
    if (!virtualJoystick.isActive) {
      // 绘制默认摇杆位置（左下角）
      const centerX = 100 * scale
      const centerY = 500 * scale
      const radius = 60 * scale
      
      // 绘制摇杆外圈
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = Math.max(2, 2 * scale)
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.stroke()
      
      // 绘制摇杆中心点
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.beginPath()
      ctx.arc(centerX, centerY, 15 * scale, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // 绘制激活状态的摇杆
      const centerX = virtualJoystick.centerX
      const centerY = virtualJoystick.centerY
      const currentX = virtualJoystick.currentX
      const currentY = virtualJoystick.currentY
      const radius = virtualJoystick.radius * scale
      
      // 绘制摇杆外圈
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = Math.max(2, 2 * scale)
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.stroke()
      
      // 绘制摇杆手柄
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.beginPath()
      ctx.arc(currentX, currentY, 20 * scale, 0, Math.PI * 2)
      ctx.fill()
      
      // 绘制连接线
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = Math.max(1, 1 * scale)
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(currentX, currentY)
      ctx.stroke()
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="game-canvas"
      tabIndex={0}
      style={{
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
        margin: '0 auto'
      }}
    />
  )
}

export default GameCanvas
