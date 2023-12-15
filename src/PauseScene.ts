import Phaser from 'phaser';
import { Level } from './Logic/Levels';
import { PauseSceneInitData, PauseSceneMeta } from './PauseSceneMeta';
import { GameSceneMeta } from './GameSceneMeta';
import * as SceneHelper from './SceneHelper';
import { MenuSceneMeta } from './MenuSceneMeta';


export class PauseScene extends Phaser.Scene {
    level: Level;
    preload(): void {
    }

    constructor() {
        super(new PauseSceneMeta().name);
    }

    init(data: PauseSceneInitData) {
        this.level = data.level;
    }

    create(): void {
        const style: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: 30,
        };
        const resumeButton = this.add.text(200, 200, "Продолжить", style);
        resumeButton.setInteractive();
        resumeButton.on('pointerdown', () => {
            SceneHelper.Stop(this.scene, new PauseSceneMeta());
            SceneHelper.Resume(this.scene, new GameSceneMeta());
        });

        const restartButton = this.add.text(200, 300, "Заново", style);
        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            SceneHelper.Stop(this.scene, new PauseSceneMeta());
            SceneHelper.Stop(this.scene, new GameSceneMeta());
            SceneHelper.Start(this.scene, new GameSceneMeta(), { level: this.level });
        });

        const menuButton = this.add.text(200, 400, "Меню", style);
        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            SceneHelper.Stop(this.scene, new PauseSceneMeta());
            SceneHelper.Stop(this.scene, new GameSceneMeta());
            SceneHelper.Start(this.scene, new MenuSceneMeta(), {});
        });
    }
}
