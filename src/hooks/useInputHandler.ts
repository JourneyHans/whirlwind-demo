import { useState, useEffect } from 'react'
import { InputState } from '../types/GameTypes'

export const useInputHandler = () => {
  const [inputState, setInputState] = useState<InputState>({
    up: false,
    down: false,
    left: false,
    right: false
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('Key pressed:', event.code)
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          console.log('Setting up to true')
          setInputState(prev => ({ ...prev, up: true }))
          break
        case 'KeyS':
        case 'ArrowDown':
          console.log('Setting down to true')
          setInputState(prev => ({ ...prev, down: true }))
          break
        case 'KeyA':
        case 'ArrowLeft':
          console.log('Setting left to true')
          setInputState(prev => ({ ...prev, left: true }))
          break
        case 'KeyD':
        case 'ArrowRight':
          console.log('Setting right to true')
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

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return { inputState }
}
