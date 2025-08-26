import React, { useState, useEffect } from 'react'
import GameCanvas from './components/GameCanvas'
import GameUI from './components/GameUI'
import { GameState } from './types/GameTypes'
import { useGameLoop } from './hooks/useGameLoop'
import { useInputHandler } from './hooks/useInputHandler'
import './App.css'

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    player: {
      x: 400,
      y: 300,
      health: 100,
      maxHealth: 100,
      level: 1,
      experience: 0,
      experienceToNext: 100
    },
    enemies: [],
    projectiles: [],
    gameTime: 0,
    score: 0,
    isGameOver: false,
    isPaused: false
  })

  const { inputState } = useInputHandler()
  const { startGame, stopGame, isRunning } = useGameLoop(gameState, setGameState, inputState)

  useEffect(() => {
    startGame()
    return () => stopGame()
  }, [startGame, stopGame])

  const handleRestart = () => {
    setGameState({
      player: {
        x: 400,
        y: 300,
        health: 100,
        maxHealth: 100,
        level: 1,
        experience: 0,
        experienceToNext: 100
      },
      enemies: [],
      projectiles: [],
      gameTime: 0,
      score: 0,
      isGameOver: false,
      isPaused: false
    })
    startGame()
  }

  return (
    <div className="app">
      <GameCanvas gameState={gameState} />
      <GameUI 
        gameState={gameState} 
        onRestart={handleRestart}
        isRunning={isRunning}
      />
    </div>
  )
}

export default App
