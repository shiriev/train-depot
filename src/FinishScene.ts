import Phaser from 'phaser';
import { GameStat } from './Logic/GameStat';
import { Level } from './Logic/Levels';
import { FinishSceneInitData, FinishSceneMeta } from './FinishSceneMeta';
import * as SceneHelper from './SceneHelper';
import { GameSceneMeta } from './GameSceneMeta';
import { MenuSceneMeta } from './MenuSceneMeta';


export class FinishScene extends Phaser.Scene {
    stat: GameStat;
    level: Level;

    preload(): void {
    }

    constructor() {
        super(new FinishSceneMeta().name);
    }

    init(data: FinishSceneInitData) {
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
            SceneHelper.Stop(this.scene, new FinishSceneMeta());
            SceneHelper.Stop(this.scene, new GameSceneMeta());
            SceneHelper.Start(this.scene, new GameSceneMeta(), { level: this.level });
        });

        const menuButton = this.add.text(200, 300, "Меню", style);
        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            SceneHelper.Stop(this.scene, new FinishSceneMeta());
            SceneHelper.Stop(this.scene, new GameSceneMeta());
            SceneHelper.Start(this.scene, new MenuSceneMeta(), {});
        });
    }
}
