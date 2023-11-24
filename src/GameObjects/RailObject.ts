import Phaser from "phaser";
import { Rail } from "../Logic/Rail";
import { ERailType } from "../Logic/Enums";
import * as Constants from "./Constants";
import * as Helper from './Helper';

export class RailObject
{
    constructor(gameScene: Phaser.Scene, rail: Rail) {
        const point = rail.GetPosition();
        let imagePath: string = '';
        switch (rail.GetRailType())
        {
            case ERailType.Forward:
                imagePath = Constants.RailForwardImage;
                break;
            case ERailType.Left:
                imagePath = Constants.RailLeftImage;
                break;
            case ERailType.Right:
                imagePath = Constants.RailRightImage;
                break;
        }
        const image = gameScene.add.image(point.x * Constants.Line + Constants.Line / 2, point.y * Constants.Line + Constants.Line / 2, imagePath);
        image.setAngle(Helper.getAngle(rail.GetStartDirection()));
    }
}