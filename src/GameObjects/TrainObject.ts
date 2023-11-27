import { EDirection, ETurnAngle } from "../Logic/Enums";
import { IPath } from "../Logic/IPath";
import { Train } from "../Logic/Train";
import * as Constants from "./Constants";
import * as Helper from './Helper';

export class TrainObject {
    gameScene: Phaser.Scene;
    gameObject: Phaser.GameObjects.Shape;
    train: Train;
    constructor(gameScene: Phaser.Scene, train: Train) {
        this.gameScene = gameScene;
        this.train = train;
        this.createTrainObject(train);
        train.subscribeOnStep((tr, oldPath, newPath, angle) => this.actTrain(oldPath, newPath, angle));
        train.subscribeOnFinish((tr, success) => console.log(success));
        train.goNext();
    }

    private createTrainObject(train: Train): void {
        const point = train.GetPosition();
        let xAdd = 0;
        let yAdd = 0;
        switch (train.GetDirection()) {
            case EDirection.Up:
                yAdd = Constants.Line / 2;
                break;
            case EDirection.Down:
                yAdd = -Constants.Line  / 2;
                break;
            case EDirection.Left:
                xAdd = Constants.Line  / 2;
                break;
            case EDirection.Right:
                xAdd = -Constants.Line  / 2;
                break;
        }
        console.log('train', train, train.GetPosition(), train.GetDirection(), Helper.getAngle(train.GetDirection()), xAdd, yAdd);
        this.gameObject = this.gameScene.add.rectangle(point.x * Constants.Line + Constants.Line / 2 + xAdd, point.y * Constants.Line + Constants.Line / 2 + yAdd, 20, 50, Helper.parseColor(train.color));
        this.gameObject.setAngle(Helper.getAngle(train.GetDirection()));
    }

    private actTrain(oldPath: IPath, newPath: IPath, angleType: ETurnAngle): void {
        // const newPoint = newPath.GetPosition();
        const oldPoint = oldPath.GetPosition();

        if (angleType === ETurnAngle.Forward) {
            const duration = Constants.Line / Constants.Speed;
            let xAdd = 0;
            let yAdd = 0;
            switch (oldPath.GetDirection()) {
                case EDirection.Up:
                    yAdd = -Constants.Line / 2;
                    break;
                case EDirection.Down:
                    yAdd = Constants.Line / 2;
                    break;
                case EDirection.Left:
                    xAdd = -Constants.Line / 2;
                    break;
                case EDirection.Right:
                    xAdd = Constants.Line / 2;
                    break;
            }
            console.log('step forward', angleType, oldPath, newPath, xAdd, yAdd);
            this.gameScene.tweens.add({
                targets: this.gameObject,
                duration: duration,
                x: oldPoint.x * Constants.Line + Constants.Line / 2 + xAdd,
                y: oldPoint.y * Constants.Line + Constants.Line / 2 + yAdd,
                ease: 'linear',
                onComplete: () => this.train.goNext(),
            });
        } else {
            const turnRadius = 15;
            const lineDuration = (Constants.Line / 2 - turnRadius) / Constants.Speed;
            const turnDuration = (Math.PI * turnRadius / 2) / Constants.Speed;
            let angle = '';
            let xStartK = 0;
            let yStartK = 0;
            let xEndK = 0;
            let yEndK = 0;
            let xEase = '';
            let yEase = '';
            if (angleType === ETurnAngle.Left) {
                angle = '-=90';
            }
            else {
                angle = '+=90';
            }
            switch (oldPath.GetStartDirection()) {
                case EDirection.Up:
                    yStartK = 1; 
                    break;
                case EDirection.Down:
                    yStartK = -1;
                    break;
                case EDirection.Left:
                    xStartK = 1;
                    break;
                case EDirection.Right:
                    xStartK = -1;
                    break;
            }

            switch (oldPath.GetDirection()) {
                case EDirection.Up:
                    yEndK = -1;
                    xEase = 'sine.out';
                    yEase = 'sine.in';
                    break;
                case EDirection.Down:
                    yEndK = 1;
                    xEase = 'sine.out';
                    yEase = 'sine.in';
                    break;
                case EDirection.Left:
                    xEndK = -1;
                    xEase = 'sine.in';
                    yEase = 'sine.out';
                    break;
                case EDirection.Right:
                    xEndK = 1;
                    xEase = 'sine.in';
                    yEase = 'sine.out';
                    break;
            }

            this.gameScene.tweens.chain({
                targets: this.gameObject,
                tweens: [
                    {
                        duration: lineDuration,
                        x: oldPoint.x * Constants.Line + Constants.Line / 2 + turnRadius * xStartK,
                        y: oldPoint.y * Constants.Line + Constants.Line / 2 + turnRadius * yStartK,
                    },
                    {
                        duration: turnDuration,
                        angle: {
                            value: angle,
                            ease: 'linear',
                        },
                        x: {
                            value: oldPoint.x * Constants.Line + Constants.Line / 2 + turnRadius * xEndK,
                            ease: xEase,
                        },
                        y: {
                            value: oldPoint.y * Constants.Line + Constants.Line / 2 + turnRadius * yEndK,
                            ease: yEase,
                        },
                    },
                    {
                        duration: lineDuration,
                        x: oldPoint.x * Constants.Line + Constants.Line / 2 + (Constants.Line / 2) * xEndK,
                        y: oldPoint.y * Constants.Line + Constants.Line / 2 + (Constants.Line / 2) * yEndK,
                    },
                ],
                onComplete: () => this.train.goNext(),
            });
        }
    }
}