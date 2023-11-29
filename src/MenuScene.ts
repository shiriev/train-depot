import Phaser from 'phaser';
import { Levels } from './Logic/Levels';

export class MenuScene extends Phaser.Scene {
    preload(): void {
    }

    constructor() {
        super('MenuScene');
    }

    create(): void {
        for (let i = 0; i < Levels.length; ++i) {
            const button = this.add.text(200, 200 + i * 100, (i + 1).toString());
            button.setInteractive();
            button.on('pointerdown', () => {
                this.loadLevel(i);
            })
        }
    }

    loadLevel(levelNumber: number) {
        this.scene.start('GameScene', { level: Levels[levelNumber] });
    }
}
