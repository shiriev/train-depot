import Phaser from 'phaser';
import { Level } from './Logic/Levels';

export class PauseScene extends Phaser.Scene {
    level: Level;
    preload(): void {
    }

    constructor() {
        super('PauseScene');
    }

    init(data: { level: Level }) {
        this.level = data.level;
    }

    create(): void {
        const style: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: 30,
        };
        const resumeButton = this.add.text(200, 200, "Продолжить", style);
        resumeButton.setInteractive();
        resumeButton.on('pointerdown', () => {
            this.scene.resume('GameScene');
            this.scene.stop('PauseScene');
        });

        const restartButton = this.add.text(200, 300, "Заново", style);
        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.stop('FinishScene');
            this.scene.stop('GameScene');
            this.scene.start('GameScene', { level: this.level });
        });

        const menuButton = this.add.text(200, 400, "Меню", style);
        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            this.scene.stop('GameScene');
            this.scene.start('MenuScene');
        });
    }
}
