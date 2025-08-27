import { useCallback, useRef, useEffect } from 'react'
import { GameState } from '../types/GameTypes'
import { updateGame } from '../gameLogic/gameLogic'

export const useGameLoop = (
  _gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  inputState: any
) => {
  const animationFrameRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const isRunningRef = useRef<boolean>(false)
  const inputStateRef = useRef(inputState)

  // 更新inputStateRef，避免闭包问题
  useEffect(() => {
    inputStateRef.current = inputState
  }, [inputState])

  const gameLoop = useCallback((currentTime: number) => {
    if (!isRunningRef.current) return

    const deltaTime = currentTime - lastTimeRef.current
    lastTimeRef.current = currentTime

    if (deltaTime > 0) {
      setGameState(prevState => {
        if (prevState.isPaused || prevState.isGameOver) return prevState
        return updateGame(prevState, deltaTime, inputStateRef.current)
      })
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }, [setGameState]) // 移除inputState依赖

  const startGame = useCallback(() => {
    isRunningRef.current = true
    lastTimeRef.current = performance.now()
    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }, [gameLoop])

  const stopGame = useCallback(() => {
    isRunningRef.current = false
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return {
    startGame,
    stopGame,
    isRunning: isRunningRef.current
  }
}
