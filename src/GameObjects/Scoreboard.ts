import { Grid } from "../Logic/Grid";

export class Scoreboard {
    constructor(scene: Phaser.Scene, grid: Grid, xOffset: number, yOffset: number) {
        const style: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: 30,
        };
        const text = scene.add.text(xOffset, yOffset, "Завершено 0/0", style);
        grid.subscribeOnStatChanged(gameStat => {
            text.text = `Завершено ${gameStat.succesfullFinishedTrainCount}/${gameStat.finishedTrainCount}`;
        });
    }
}