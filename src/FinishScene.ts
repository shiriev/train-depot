import Phaser from 'phaser';
import { GameStat } from './Logic/GameStat';
import { Level } from './Logic/Levels';

export class FinishScene extends Phaser.Scene {
    stat: GameStat;
    level: Level;

    preload(): void {
    }

    constructor() {
        super('FinishScene');
    }

    init(data: { stat: GameStat, level: Level }) {
        this.stat = data.stat;
        this.level = data.level;
    }

    create(): void {
        const style: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: 30,
        };
        const restartButton = this.add.text(200, 200, "Заново", style);
        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.stop('FinishScene');
            this.scene.stop('GameScene');
            this.scene.start('GameScene', { level: this.level });
        });

        const menuButton = this.add.text(200, 300, "Меню", style);
        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            this.scene.stop('GameScene');
            this.scene.start('MenuScene');
        });
    }
}
