import Phaser from "phaser";
import { Rail } from "../Logic/Rail";
import { ERailType } from "../Logic/Enums";
import * as Constants from "./Constants";
import * as Helper from './Helper';

export class RailObject
{
    constructor(gameScene: Phaser.Scene, rail: Rail) {
        const point = rail.GetPosition();
        let frame: number;
        switch (rail.GetRailType())
        {
            case ERailType.Forward:
                frame = 4;
                break;
            case ERailType.Left:
                frame = 5
                break;
            case ERailType.Right:
                frame = 6;
                break;
        }
        const railObject = gameScene.make.image({
            key: Constants.Tiles,
            frame: frame,
            x: point.x * Constants.Line,
            y: point.y * Constants.Line,
            origin: 0
        });
        railObject.setAngle(Helper.getAngle(rail.GetStartDirection()));
        Phaser.Actions.RotateAroundDistance([railObject], { x: point.x * Constants.Line + Constants.Line / 2, y: point.y * Constants.Line + Constants.Line / 2 }, Phaser.Math.DegToRad(Helper.getAngle(rail.GetStartDirection())), Constants.Line * Math.SQRT2 / 2);
    }
}