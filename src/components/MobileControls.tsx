import React from 'react'
import { TouchState, VirtualJoystick } from '../types/GameTypes'
import './MobileControls.css'

interface MobileControlsProps {
  touchState: TouchState
  virtualJoystick: VirtualJoystick
  isMobile: boolean
}

const MobileControls: React.FC<MobileControlsProps> = ({ 
  touchState, 
  virtualJoystick, 
  isMobile 
}) => {
  if (!isMobile) return null

  return (
    <div className="mobile-controls">
      {/* 虚拟摇杆 */}
      <div className="virtual-joystick-container">
        <div 
          className="joystick-base"
          style={{
            left: `${virtualJoystick.centerX - virtualJoystick.radius}px`,
            top: `${virtualJoystick.centerY - virtualJoystick.radius}px`,
            width: `${virtualJoystick.radius * 2}px`,
            height: `${virtualJoystick.radius * 2}px`
          }}
        >
          <div 
            className="joystick-thumb"
            style={{
              left: `${virtualJoystick.currentX - virtualJoystick.centerX}px`,
              top: `${virtualJoystick.currentY - virtualJoystick.centerY}px`
            }}
          />
        </div>
      </div>

      {/* 触摸指示器 */}
      {touchState.isActive && (
        <div 
          className="touch-indicator"
          style={{
            left: `${touchState.currentX - 15}px`,
            top: `${touchState.currentY - 15}px`
          }}
        />
      )}

      {/* 控制说明 */}
      <div className="mobile-controls-help">
        <div className="control-tip">
          <span className="tip-icon">🎮</span>
          <span>虚拟摇杆控制移动</span>
        </div>
        <div className="control-tip">
          <span className="tip-icon">👆</span>
          <span>触摸屏幕任意位置移动</span>
        </div>
      </div>
    </div>
  )
}

export default MobileControls
