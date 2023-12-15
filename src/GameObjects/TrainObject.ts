import { EDirection, ETurnAngle } from "../Logic/Enums";
import { ICell, IPath, IStop } from "../Logic/ICell";
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
        train.SubscribeOnStart((tr, path) =>  {
            this.createTrainObject(tr, path); 
            this.startTrain(path);
        });
        train.SubscribeOnStep((tr, oldPath, newPath, turnAngle) => this.moveTrain(oldPath, newPath, turnAngle));
        train.SubscribeOnFinish((tr, success, path) => this.finishTrain(success, path));
        train.GoNext();
    }

    private createTrainObject(train: Train, path: IPath): void {
        const point = path.GetPosition();
        this.gameObject = this.gameScene.add.rectangle(point.x * Constants.Line + Constants.Line / 2, point.y * Constants.Line + Constants.Line / 2, 20, 40, Helper.parseColor(train.color));
        this.gameObject.setAngle(Helper.getAngle(path.GetDirection()));
        this.gameScene.tweens.chain({
            targets: this.gameObject,
            tweens: [
                {
                    duration: 500,
                    width: 18,
                    height: 43,
                },
                {
                    duration: 500,
                    width: 20,
                    height: 40,
                },
            ],
            loop: -1,
        });
    }

    private startTrain(path: IPath): void {
        const oldPoint = path.GetPosition();

        const duration = Constants.Line / 2 / Constants.Speed;
        let xAdd = 0;
        let yAdd = 0;
        switch (path.GetDirection()) {
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
        this.gameScene.tweens.add({
            targets: this.gameObject,
            duration: duration,
            x: oldPoint.x * Constants.Line + Constants.Line / 2 + xAdd,
            y: oldPoint.y * Constants.Line + Constants.Line / 2 + yAdd,
            ease: 'linear',
            onComplete: () => this.train.GoNext(),
        });
    }

    private moveTrain(oldPath: IPath, newPath: ICell, angleType: ETurnAngle): void {
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
            this.gameScene.tweens.add({
                targets: this.gameObject,
                duration: duration,
                x: oldPoint.x * Constants.Line + Constants.Line / 2 + xAdd,
                y: oldPoint.y * Constants.Line + Constants.Line / 2 + yAdd,
                ease: 'linear',
                onComplete: () => this.train.GoNext(),
            });
        } else {
            const lineDuration = (Constants.Line / 2 - Constants.TurnRadius) / Constants.Speed;
            const turnDuration = (Math.PI * Constants.TurnRadius / 2) / Constants.Speed;
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
                        x: oldPoint.x * Constants.Line + Constants.Line / 2 + Constants.TurnRadius * xStartK,
                        y: oldPoint.y * Constants.Line + Constants.Line / 2 + Constants.TurnRadius * yStartK,
                    },
                    {
                        duration: turnDuration,
                        angle: {
                            value: angle,
                            ease: 'linear',
                        },
                        x: {
                            value: oldPoint.x * Constants.Line + Constants.Line / 2 + Constants.TurnRadius * xEndK,
                            ease: xEase,
                        },
                        y: {
                            value: oldPoint.y * Constants.Line + Constants.Line / 2 + Constants.TurnRadius * yEndK,
                            ease: yEase,
                        },
                    },
                    {
                        duration: lineDuration,
                        x: oldPoint.x * Constants.Line + Constants.Line / 2 + (Constants.Line / 2) * xEndK,
                        y: oldPoint.y * Constants.Line + Constants.Line / 2 + (Constants.Line / 2) * yEndK,
                    },
                ],
                onComplete: () => this.train.GoNext(),
            });
        }
    }

    private finishTrain(success: boolean, stop: IStop): void {
        const oldPoint = stop.GetPosition();

        const duration = Constants.Line / 2 / Constants.Speed;
        this.gameScene.tweens.add({
            targets: this.gameObject,
            duration: duration,
            x: oldPoint.x * Constants.Line + Constants.Line / 2,
            y: oldPoint.y * Constants.Line + Constants.Line / 2,
            ease: 'linear',
            onComplete: () => this.gameObject.removeFromDisplayList(),
        });
    }
}