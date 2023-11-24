import { TrainStop } from "../Logic/TrainStop";
import * as Constants from "./Constants";
import * as Helper from './Helper';


export class TrainStopObject {
    constructor(gameScene: Phaser.Scene, trainStop: TrainStop) {
        const point = trainStop.GetPosition();
        gameScene.add.circle(point.x * Constants.Line + Constants.Line / 2, point.y * Constants.Line + Constants.Line / 2, Constants.Line / 2, Helper.parseColor(trainStop.GetColor()));
    }
}