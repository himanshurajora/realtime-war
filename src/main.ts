import * as phaser from "phaser";
import "./style.css";
import { MainScene } from "./scenes/main";
import { GameScene } from "./scenes/game";

const gameConfig: phaser.Types.Core.GameConfig = {
  type: phaser.AUTO,
  fullscreenTarget: "game",
  width: 800,
  height: 600,
  backgroundColor: "#2d2d2d",
  // @ts-ignore
  scene: [GameScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0, x: 0 },
    },
  },
};

export const MainGame = new Phaser.Game(gameConfig);
