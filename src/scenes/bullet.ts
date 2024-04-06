import * as phaser from "phaser";

export class Bullet extends phaser.Physics.Arcade.Sprite {
  constructor(scene: phaser.Scene, x: number, y: number) {
    super(scene, x, y, "bullet");
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  fire(x: number, y: number) {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityX(500);

    // destroy the bullet after it leaves the screen
    if (this.x > this.scene.game.canvas.width) {
      this.destroy();
    }
  }
}
