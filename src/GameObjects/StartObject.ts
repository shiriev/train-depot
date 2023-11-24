import { Start } from "../Logic/Start";
import * as Constants from "./Constants";
import * as Helper from './Helper';


export class StartObject {
    constructor(gameScene: Phaser.Scene, start: Start) {
        const point = start.GetPosition();
        gameScene.add.rectangle(point.x * Constants.Line + Constants.Line / 2, point.y * Constants.Line + Constants.Line / 2, Constants.Line, Constants.Line, 0xAAAAAA);
        // gameObject.setAngle(getAngle(start.GetStartDirection()));
    }
}