import * as phaser from "phaser";

export class Enemy extends phaser.Physics.Arcade.Sprite {
  constructor(scene: phaser.Scene, x: number, y: number) {
    super(scene, 775, y, "player");
    scene.add.existing(this);
    // rotate 180 degrees
    this.setAngle(180);
    scene.physics.add.existing(this);
  }
}
