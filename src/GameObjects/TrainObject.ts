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
        const newPoint = newPath.GetPosition();

        if (angleType === ETurnAngle.Forward) {
            const duration = Constants.Line / Constants.Speed;
            let xAdd = 0;
            let yAdd = 0;
            switch (oldPath.GetDirection()) {
                case EDirection.Up:
                    yAdd = Constants.Line / 2;
                    break;
                case EDirection.Down:
                    yAdd = -Constants.Line / 2;
                    break;
                case EDirection.Left:
                    xAdd = Constants.Line / 2;
                    break;
                case EDirection.Right:
                    xAdd = -Constants.Line / 2;
                    break;
            }
            console.log('step forward', angleType, oldPath, newPath, xAdd, yAdd);
            this.gameScene.tweens.add({
                targets: this.gameObject,
                duration: duration,
                x: newPoint.x * Constants.Line + Constants.Line / 2 + xAdd,
                y: newPoint.y * Constants.Line + Constants.Line / 2 + yAdd,
                ease: 'linear',
                onComplete: () => this.train.goNext(),
            });
        }
        else {
            const duration = (Math.PI * (Constants.Line / 2) / 2) / Constants.Speed;
            let angle = '';
            let xAdd = 0;
            let yAdd = 0;
            let xEase = '';
            let yEase = '';
            if (angleType === ETurnAngle.Left) {
                angle = '-=90';
            }
            else {
                angle = '+=90';
            }
            switch (oldPath.GetDirection()) {
                case EDirection.Up:
                    yAdd = Constants.Line / 2;
                    xEase = 'sine.out';
                    yEase = 'sine.in';
                    break;
                case EDirection.Down:
                    yAdd = -Constants.Line / 2;
                    xEase = 'sine.out';
                    yEase = 'sine.in';
                    break;
                case EDirection.Left:
                    xAdd = Constants.Line / 2;
                    xEase = 'sine.in';
                    yEase = 'sine.out';
                    break;
                case EDirection.Right:
                    xAdd = -Constants.Line / 2;
                    xEase = 'sine.in';
                    yEase = 'sine.out';
                    break;
            }
            console.log('step turn', angleType, oldPath, newPath, xAdd, yAdd, angle);

            this.gameScene.tweens.add({
                targets: this.gameObject,
                duration: duration,
                angle: {
                    value: angle,
                    ease: 'linear',
                    duration: duration,
                },
                x: {
                    value: newPoint.x * Constants.Line + Constants.Line / 2 + xAdd,
                    ease: xEase,
                    duration: duration,
                },
                y: {
                    value: newPoint.y * Constants.Line + Constants.Line / 2 + yAdd,
                    ease: yEase,
                    duration: duration,
                },
                onComplete: () => this.train.goNext(),
            });
        }
    }
}