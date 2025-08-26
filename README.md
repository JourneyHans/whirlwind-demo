# 旋风斩幸存者 (Whirlwind Survivor)

一款类吸血鬼幸存者+类暗黑破坏神的动作游戏，玩家扮演一个一直使用旋风斩的角色，击杀从不同地方涌入的敌人。

## 游戏特色

- **旋风斩机制**: 玩家周围持续释放旋风斩，自动攻击范围内的敌人
- **roguelike元素**: 随机敌人生成，永久死亡机制
- **动作RPG**: 实时战斗，多种敌人类型
- **斜45°视角**: 采用正交投影，提供清晰的游戏视野

## 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **构建工具**: Vite
- **游戏引擎**: 原生Canvas API
- **状态管理**: React Hooks

## 游戏玩法

### 控制方式
- **W/↑**: 向上移动
- **S/↓**: 向下移动  
- **A/←**: 向左移动
- **D/→**: 向右移动

### 游戏机制
1. **旋风斩**: 玩家周围80像素范围内持续造成伤害
2. **敌人类型**: 
   - 僵尸: 血量40，速度100，伤害10
   - 骷髅: 血量60，速度80，伤害15
   - 恶魔: 血量80，速度60，伤害20
3. **生存挑战**: 敌人从四面八方涌入，玩家需要不断移动躲避

## 项目结构

```
src/
├── components/          # React组件
│   ├── GameCanvas.tsx  # 游戏画布
│   └── GameUI.tsx      # 游戏UI界面
├── hooks/              # 自定义Hooks
│   ├── useGameLoop.ts  # 游戏主循环
│   └── useInputHandler.ts # 输入处理
├── gameLogic/          # 游戏逻辑
│   └── gameLogic.ts    # 核心游戏逻辑
├── types/              # TypeScript类型定义
│   └── GameTypes.ts    # 游戏相关类型
├── App.tsx             # 主应用组件
└── main.tsx            # 应用入口
```

## 在线体验

🎮 **立即体验游戏**: [https://journeyhans.github.io/whirlwind-demo/](https://journeyhans.github.io/whirlwind-demo/)

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 游戏截图

游戏采用深色主题，包含：
- 深蓝色网格背景
- 青色玩家角色
- 红色旋风斩效果
- 多种颜色的敌人
- 实时UI显示

## 开发计划

- [ ] 添加音效和背景音乐
- [ ] 实现技能升级系统
- [ ] 添加更多敌人类型
- [ ] 实现成就系统
- [ ] 添加移动端支持
- [ ] 优化性能

## 贡献

欢迎提交Issue和Pull Request来改进游戏！

## 许可证

MIT License
