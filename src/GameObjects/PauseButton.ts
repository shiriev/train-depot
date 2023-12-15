import { Level } from "../Logic/Levels";
import { PauseSceneMeta } from "../PauseSceneMeta";
import * as SceneHelper from "../SceneHelper";


export class PauseButton {
    constructor(scene: Phaser.Scene, x: number, y: number, level: Level) {
        // const rectangle = scene.add.rectangle(x + 50, y + 20, 100, 40, 0x000000);
        const style: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: 30,
        };
        const button = scene.add.text(x, y, "Пауза", style);
        button.setInteractive();
        button.on("pointerdown", () => {
            scene.scene.pause(scene);
            SceneHelper.Launch(scene.scene, new PauseSceneMeta(), { level: level });
        });
    }
}