import * as phaser from "phaser";
import { Scenes } from "./scenes";

export class MainScene extends phaser.Scene {
  constructor() {
    super(Scenes.Main);
  }

  preload() {}

  create() {
    console.log("Start The Game");

    const button = this.add.text(0, 0, "Start The Game", {
      color: "white",
    });

    const width = button.width;
    const height = button.height;

    button.setPosition(
      this.game.canvas.width / 2 - width / 2,
      this.game.canvas.height / 2 - height / 2
    );

    button.setInteractive();

    button.on("pointerover", () => {
      button.setTint(0xff0000);
    });

    button.on("pointerout", () => {
      button.clearTint();
    });

    button.on("pointerdown", () => {
      button.setTint(0x00ff00);
      console.log("Button clicked");
      this.game.scene.switch(Scenes.Main, Scenes.Game);
    });

    this.input.on("pointerup", () => {
      button.setTint(0xff0000);
    });
  }
}
