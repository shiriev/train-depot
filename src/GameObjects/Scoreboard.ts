import { Grid } from "../Logic/Grid";

export class Scoreboard {
    constructor(scene: Phaser.Scene, grid: Grid, xOffset: number, yOffset: number) {
        const text = scene.add.text(xOffset, yOffset, "0/0");
        grid.subscribeOnStatChanged(gameStat => {
            text.text = `${gameStat.succesfullFinishedTrainCount}/${gameStat.finishedTrainCount}`;
        });
    }
}