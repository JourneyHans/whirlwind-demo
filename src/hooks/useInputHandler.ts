import { useState, useEffect, useRef } from 'react'
import { InputState, TouchState, VirtualJoystick } from '../types/GameTypes'

export const useInputHandler = () => {
  const [inputState, setInputState] = useState<InputState>({
    up: false,
    down: false,
    left: false,
    right: false
  })

  const [touchState, setTouchState] = useState<TouchState>({
    isActive: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0
  })

  const [virtualJoystick, setVirtualJoystick] = useState<VirtualJoystick>({
    isActive: false,
    centerX: 0,
    centerY: 0,
    currentX: 0,
    currentY: 0,
    radius: 60
  })

  const isMobile = useRef<boolean>(false)

  // 触摸事件处理函数
  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0]
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      setTouchState(prev => ({
        ...prev,
        isActive: true,
        startX: x,
        startY: y,
        currentX: x,
        currentY: y,
        deltaX: 0,
        deltaY: 0
      }))
    }
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length === 1 && touchState.isActive) {
      const touch = event.touches[0]
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      setTouchState(prev => ({
        ...prev,
        currentX: x,
        currentY: y,
        deltaX: x - prev.startX,
        deltaY: y - prev.startY
      }))

      // 根据触摸移动方向设置输入状态
      const threshold = 20 // 触摸移动阈值
      const deltaX = x - touchState.startX
      const deltaY = y - touchState.startY

      setInputState({
        up: deltaY < -threshold,
        down: deltaY > threshold,
        left: deltaX < -threshold,
        right: deltaX > threshold
      })
    }
  }

  const handleTouchEnd = () => {
    setTouchState(prev => ({
      ...prev,
      isActive: false,
      deltaX: 0,
      deltaY: 0
    }))
    setInputState({
      up: false,
      down: false,
      left: false,
      right: false
    })
  }

  // 虚拟摇杆触摸事件函数
  const handleJoystickTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0]
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      setVirtualJoystick(prev => ({
        ...prev,
        isActive: true,
        centerX: x,
        centerY: y,
        currentX: x,
        currentY: y
      }))
    }
  }

  const handleJoystickTouchMove = (event: TouchEvent) => {
    if (event.touches.length === 1 && virtualJoystick.isActive) {
      const touch = event.touches[0]
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      // 计算摇杆位置，限制在圆形范围内
      const deltaX = x - virtualJoystick.centerX
      const deltaY = y - virtualJoystick.centerY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      if (distance <= virtualJoystick.radius) {
        setVirtualJoystick(prev => ({
          ...prev,
          currentX: x,
          currentY: y
        }))
      } else {
        // 限制在圆形范围内
        const angle = Math.atan2(deltaY, deltaX)
        const limitedX = virtualJoystick.centerX + Math.cos(angle) * virtualJoystick.radius
        const limitedY = virtualJoystick.centerY + Math.sin(angle) * virtualJoystick.radius
        
        setVirtualJoystick(prev => ({
          ...prev,
          currentX: limitedX,
          currentY: limitedY
        }))
      }

      // 根据摇杆位置设置输入状态
      const threshold = 10
      setInputState({
        up: deltaY < -threshold,
        down: deltaY > threshold,
        left: deltaX < -threshold,
        right: deltaX > threshold
      })
    }
  }

  const handleJoystickTouchEnd = () => {
    setVirtualJoystick(prev => ({
      ...prev,
      isActive: false
    }))
    setInputState({
      up: false,
      down: false,
      left: false,
      right: false
    })
  }

  useEffect(() => {
    // 检测是否为移动设备
    isMobile.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                       'ontouchstart' in window ||
                       navigator.maxTouchPoints > 0

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          setInputState(prev => ({ ...prev, up: true }))
          break
        case 'KeyS':
        case 'ArrowDown':
          setInputState(prev => ({ ...prev, down: true }))
          break
        case 'KeyA':
        case 'ArrowLeft':
          setInputState(prev => ({ ...prev, left: true }))
          break
        case 'KeyD':
        case 'ArrowRight':
          setInputState(prev => ({ ...prev, right: true }))
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          setInputState(prev => ({ ...prev, up: false }))
          break
        case 'KeyS':
        case 'ArrowDown':
          setInputState(prev => ({ ...prev, down: false }))
          break
        case 'KeyA':
        case 'ArrowLeft':
          setInputState(prev => ({ ...prev, left: false }))
          break
        case 'KeyD':
        case 'ArrowRight':
          setInputState(prev => ({ ...prev, right: false }))
          break
      }
    }

    // 触摸事件处理函数已经在外面定义，这里不需要重复定义

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [touchState.isActive, virtualJoystick.isActive])

  return { 
    inputState, 
    touchState, 
    virtualJoystick, 
    isMobile: isMobile.current,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleJoystickTouchStart,
    handleJoystickTouchMove,
    handleJoystickTouchEnd
  }
}
