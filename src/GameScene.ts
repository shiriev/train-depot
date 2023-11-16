import Phaser from 'phaser';
import { IPath } from './Logic/IPath';
import { EDirection, ELeverTurn, ETurnAngle } from './Logic/Enums';
import { Train } from './Logic/Train';
import { Grid } from './Logic/Grid';
import { PathVisitor } from './Logic/PathVisitor';
import { parseLevel } from './Logic/LevelParser';
import { Levels } from './Logic/Levels';

const speed = 0.05;
const line = 100;

export class GameScene extends Phaser.Scene {
    grid: Grid;

    preload(): void {
    }

    create(): void {
        const parsingLevelResult = parseLevel(Levels[0]);

        if (parsingLevelResult.success === false) {
            throw new Error(parsingLevelResult.error);
        }

        this.grid = parsingLevelResult.grid;

        for (const path of this.grid.paths) {
            path.AcceptVisitor(new PathVisitor(
                rail => {
                    const point = rail.GetPosition();
                    this.add.rectangle(point.x * line + line / 2, point.y * line + line / 2, line, line, 16711680);
                },
                start => {
                    const point = start.GetPosition();
                    this.add.rectangle(point.x * line + line / 2, point.y * line + line / 2, line, line, 16776960);
                },
                trainStop => {
                    const point = trainStop.GetPosition();
                    this.add.rectangle(point.x * line + line / 2, point.y * line + line / 2, line, line, 16711935);
                },
                lever => {
                    const point = lever.GetPosition();
                    const leverObject = this.add.rectangle(point.x * line + line / 2, point.y * line + line / 2, line, line, 65280);
                    leverObject.setInteractive();
                    leverObject.on('pointerdown', () => {
                        const turn = lever.TurnLever();
                        leverObject.fillColor = turn === ELeverTurn.First ? 0xFFFF00 : 0xFFAAAA;
                        console.log('turn', turn);
                    });
                }
            ));
        }

        for (const train of this.grid.trains) {
            const trainObject = this.createTrainObject(train);
            train.subscribeOnStep((tr, oldPath, newPath, angle) => this.actTrain(trainObject, tr, oldPath, newPath, angle));
            train.subscribeOnFinish((tr, success) => console.log(success));
            train.goNext();
        }
    }

    private createTrainObject(train: Train): Phaser.GameObjects.GameObject {
        const point = train.GetPosition();
        let angle = 0;
        let xAdd = 0;
        let yAdd = 0;
        switch (train.GetDirection()) {
            case EDirection.Up:
                yAdd = line / 2;
                angle = 0;
                break;
            case EDirection.Down:
                yAdd = -line / 2;
                angle = 180;
                break;
            case EDirection.Left:
                xAdd = line / 2;
                angle = 270;
                break;
            case EDirection.Right:
                xAdd = -line / 2;
                angle = 90;
                break;
        }
        console.log('train', train, train.GetPosition(), train.GetDirection(), angle, xAdd, yAdd);
        const rectangle = this.add.rectangle(point.x * line + line / 2 + xAdd, point.y * line + line / 2 + yAdd, 30, 70, 0xFFFFFF);
        rectangle.setAngle(angle);
        return rectangle;
    }

    private actTrain(gameObject: Phaser.GameObjects.GameObject, train: Train, oldPath: IPath, newPath: IPath, angleType: ETurnAngle): void {
        const newPoint = newPath.GetPosition();

        if (angleType === ETurnAngle.Forward) {
            const duration = line / speed;
            let xAdd = 0;
            let yAdd = 0;
            switch (oldPath.GetDirection()) {
                case EDirection.Up:
                    yAdd = line / 2;
                    break;
                case EDirection.Down:
                    yAdd = -line / 2;
                    break;
                case EDirection.Left:
                    xAdd = line / 2;
                    break;
                case EDirection.Right:
                    xAdd = -line / 2;
                    break;
            }
            console.log('step forward', angleType, oldPath, newPath, xAdd, yAdd);
            this.tweens.add({
                targets: gameObject,
                duration: duration,
                x: newPoint.x * line + line / 2 + xAdd,
                y: newPoint.y * line + line / 2 + yAdd,
                ease: 'linear',
                onComplete: () => train.goNext(),
            });
        }
        else {
            const duration = (Math.PI * (line / 2) / 2) / speed;
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
                    yAdd = line / 2;
                    xEase = 'sine.out';
                    yEase = 'sine.in';
                    break;
                case EDirection.Down:
                    yAdd = -line / 2;
                    xEase = 'sine.out';
                    yEase = 'sine.in';
                    break;
                case EDirection.Left:
                    xAdd = line / 2;
                    xEase = 'sine.in';
                    yEase = 'sine.out';
                    break;
                case EDirection.Right:
                    xAdd = -line / 2;
                    xEase = 'sine.in';
                    yEase = 'sine.out';
                    break;
            }
            console.log('step turn', angleType, oldPath, newPath, xAdd, yAdd, angle);

            this.tweens.add({
                targets: gameObject,
                duration: duration,
                angle: {
                    value: angle,
                    ease: 'linear',
                    duration: duration,
                },
                x: {
                    value: newPoint.x * line + line / 2 + xAdd,
                    ease: xEase,
                    duration: duration,
                },
                y: {
                    value: newPoint.y * line + line / 2 + yAdd,
                    ease: yEase,
                    duration: duration,
                },
                onComplete: () => train.goNext(),
            });
        }
    }
}
