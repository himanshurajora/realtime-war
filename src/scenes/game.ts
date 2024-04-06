import * as phaser from "phaser";
import { Scenes } from "./scenes";
import { Player } from "./player";
import { Bullet } from "./bullet";
import { io, Socket } from "socket.io-client";
import { Enemy } from "./enemy";
import { EnemyBullet } from "./enemy-bullet";

export class GameScene extends phaser.Scene {
  socket!: Socket;

  constructor() {
    super(Scenes.Game);
  }

  player!: Player;
  enemy!: Enemy;
  cursors!: phaser.Types.Input.Keyboard.CursorKeys | undefined;
  lastMessageTime = 0;
  score = 0;
  enemyScore = 0;

  scoreText!: phaser.GameObjects.Text;
  enemyScoreText!: phaser.GameObjects.Text;

  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("bullet", "assets/bullet.png");
  }

  create() {
    this.socket = io("ws://192.168.1.24:3000");

    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("start", () => {
      this.enemy = new Enemy(this, 500, 300);
    });

    this.socket.on("enemy-move", (data) => {
      console.log("Enemy moved");
      this.enemy.setPosition(this.enemy.x, data.y);
    });

    this.socket.on("enemy-fire", (data) => {
      console.log("Enemy fired");
      const bullet = new EnemyBullet(this, this.enemy.x, this.enemy.y);
      bullet.fire(this.enemy.x - 30, this.enemy.y);

      this.physics.add.overlap(bullet, this.player, () => {
        bullet.destroy();
      });
    });

    this.socket.on("enemy-left", () => {
      console.log("Enemy left");
      this.enemy.destroy();
    });

    this.socket.on("enemy-score", (data) => {
      console.log("Enemy scored");
      this.enemyScore = data.score;
    });

    this.player = new Player(this, 25, 300);
    this.cursors = this.input.keyboard?.createCursorKeys();

    let lastFiredAt = 0;

    // jab hmari goli hit kre
    this.cursors?.space?.on("down", () => {
      if (Date.now() - lastFiredAt < 500) {
        return;
      }

      lastFiredAt = Date.now();
      const bullet = new Bullet(this, this.player.x, this.player.y);
      bullet.fire(this.player.x + 30, this.player.y);

      this.physics.add.overlap(bullet, this.enemy, () => {
        bullet.destroy();
        this.score += 1;
        this.socket.emit("score", {
          score: this.score,
        });
      });

      this.socket.emit("fire", {
        x: bullet.x,
        y: bullet.y,
      });
    });
  }

  update() {
    // draw score
    if (this.scoreText) {
      this.scoreText.destroy();
    }

    if (this.enemyScoreText) {
      this.enemyScoreText.destroy();
    }

    this.scoreText = this.add.text(10, 50, `Score: ${this.score}`, {
      fontSize: "32px",
      color: "white",
    });

    this.enemyScoreText = this.add.text(
      500,
      50,
      `Enemy Score: ${this.enemyScore}`,
      {
        fontSize: "32px",
        color: "white",
      }
    );

    this.player.setVelocity(0, 0);
    if (this.cursors) {
      if (this.cursors.up.isDown) {
        this.player.setVelocity(0, -200);
      }
      if (this.cursors.down.isDown) {
        this.player.setVelocity(0, 200);
      }
    }

    if (Date.now() - this.lastMessageTime > 10) {
      this.socket.emit("move", {
        x: this.player.x,
        y: this.player.y,
      });
      this.lastMessageTime = Date.now();
    }
  }
}
