import React from 'react'
import { GameState } from '../types/GameTypes'
import { useInputHandler } from '../hooks/useInputHandler'
import './GameUI.css'

interface GameUIProps {
  gameState: GameState
  onRestart: () => void
  isRunning: boolean
}

const GameUI: React.FC<GameUIProps> = ({ gameState, onRestart, isRunning }) => {
  const { isMobile } = useInputHandler()
  if (gameState.isGameOver) {
    return (
      <div className="game-over-overlay">
        <div className="game-over-content">
          <h1>游戏结束</h1>
          <p>最终分数: {gameState.score}</p>
          <p>生存时间: {Math.floor(gameState.gameTime)}秒</p>
          <button className="restart-button" onClick={onRestart}>
            重新开始
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="game-ui">
      <div className="ui-panel">
        <div className="ui-section">
          <h3>游戏信息</h3>
          <div className="info-row">
            <span>时间:</span>
            <span>{Math.floor(gameState.gameTime)}s</span>
          </div>
          <div className="info-row">
            <span>分数:</span>
            <span>{gameState.score}</span>
          </div>
          <div className="info-row">
            <span>等级:</span>
            <span>{gameState.player.level}</span>
          </div>
        </div>

        <div className="ui-section">
          <h3>玩家状态</h3>
          <div className="health-bar">
            <div className="health-label">血量</div>
            <div className="health-fill">
              <div 
                className="health-current" 
                style={{ width: `${(gameState.player.health / gameState.player.maxHealth) * 100}%` }}
              />
            </div>
            <div className="health-text">
              {Math.floor(gameState.player.health)}/{gameState.player.maxHealth}
            </div>
          </div>
          
          <div className="experience-bar">
            <div className="exp-label">经验</div>
            <div className="exp-fill">
              <div 
                className="exp-current" 
                style={{ width: `${(gameState.player.experience / gameState.player.experienceToNext) * 100}%` }}
              />
            </div>
            <div className="exp-text">
              {gameState.player.experience}/{gameState.player.experienceToNext}
            </div>
          </div>
        </div>

        <div className="ui-section">
          <h3>控制说明</h3>
          {isMobile ? (
            <div className="controls">
              <div className="control-row">
                <span>🎮</span>
                <span>虚拟摇杆</span>
              </div>
              <div className="control-row">
                <span>👆</span>
                <span>触摸移动</span>
              </div>
              <div className="control-row">
                <span>📱</span>
                <span>移动设备</span>
              </div>
            </div>
          ) : (
            <div className="controls">
              <div className="control-row">
                <span>W/↑</span>
                <span>向上移动</span>
              </div>
              <div className="control-row">
                <span>S/↓</span>
                <span>向下移动</span>
              </div>
              <div className="control-row">
                <span>A/←</span>
                <span>向左移动</span>
              </div>
              <div className="control-row">
                <span>D/→</span>
                <span>向右移动</span>
              </div>
            </div>
          )}
        </div>

        <div className="ui-section">
          <h3>游戏状态</h3>
          <div className="status-info">
            <div className="status-row">
              <span>敌人数量:</span>
              <span>{gameState.enemies.length}</span>
            </div>
            <div className="status-row">
              <span>游戏状态:</span>
              <span className={isRunning ? 'status-running' : 'status-paused'}>
                {isRunning ? '运行中' : '已暂停'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameUI
