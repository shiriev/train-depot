import { ELeverTurn, ELeverType } from "../Logic/Enums";
import { Lever } from "../Logic/Lever";
import * as Constants from "./Constants";
import * as Helper from './Helper';


export class LeverObject {
    constructor(gameScene: Phaser.Scene, lever: Lever) {
        const point = lever.GetPosition();
        const leverObject = gameScene.make.image({
            key: Constants.Tiles,
            frame: this.getFrame(lever),
            x: point.x * Constants.Line,
            y: point.y * Constants.Line,
            origin: 0
        });
        leverObject.setAngle(Helper.getAngle(lever.GetStartDirection()));
        Phaser.Actions.RotateAroundDistance([leverObject], { x: point.x * Constants.Line + Constants.Line / 2, y: point.y * Constants.Line + Constants.Line / 2 }, Phaser.Math.DegToRad(Helper.getAngle(lever.GetStartDirection())), Constants.Line * Math.SQRT2 / 2);
        leverObject.setInteractive();
        leverObject.on('pointerdown', () => {
            const turn = lever.TurnLever();
            leverObject.setFrame(this.getFrame(lever));
            console.log('turn', turn);
        });
    }

    private getFrame(lever: Lever): number {
        const currentTurn = lever.GetCurrentTurn();
        switch (lever.GetType()) {
            case ELeverType.ForwardAndLeft:
                return currentTurn === ELeverTurn.First ? 0 : 2;
            case ELeverType.ForwardAndRight:
                return currentTurn === ELeverTurn.First ? 1 : 3;
        }
    }
}