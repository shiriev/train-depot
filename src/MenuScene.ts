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
            const style: Phaser.Types.GameObjects.Text.TextStyle = {
                fontSize: 30,
            };
            const button = this.add.text(200, 200 + i * 100, `Уровень ${i + 1}`, style);
            button.setInteractive();
            button.on('pointerdown', () => {
                this.loadLevel(i);
            });
        }
    }

    loadLevel(levelNumber: number) {
        this.scene.start('GameScene', { level: Levels[levelNumber] });
    }
}
