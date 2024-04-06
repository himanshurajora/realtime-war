import * as phaser from "phaser";
export class Player extends phaser.Physics.Arcade.Sprite {
  constructor(scene: phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
