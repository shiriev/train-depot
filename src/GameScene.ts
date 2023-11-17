import Phaser from 'phaser';
import { IPath } from './Logic/IPath';
import { EColor, EDirection, ELeverTurn, ERailType, ETurnAngle } from './Logic/Enums';
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

        this.grid.visitPaths(new PathVisitor(
            rail => {
                const point = rail.GetPosition();
                let gameObject: Phaser.GameObjects.Shape;
                switch (rail.GetRailType())
                {
                    case ERailType.Forward:
                        gameObject = this.add.rectangle(point.x * line + line / 2, point.y * line + line / 2, 5, line, 16711680);
                        break;
                    case ERailType.Left:
                        gameObject = this.add.rectangle(point.x * line + line / 2, point.y * line + line / 2, 5, line, 16711680);
                        break;
                    case ERailType.Right:
                        gameObject = this.add.rectangle(point.x * line + line / 2, point.y * line + line / 2, 5, line, 16711680);
                        break;
                }
                gameObject.setAngle(getAngle(rail.GetStartDirection()));
            },
            start => {
                const point = start.GetPosition();
                this.add.circle(point.x * line + line / 2, point.y * line + line / 2, line / 2, 0xAAAAAA);
            },
            trainStop => {
                const point = trainStop.GetPosition();
                this.add.circle(point.x * line + line / 2, point.y * line + line / 2, line / 2, parseColor(trainStop.GetColor()));
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

        const timerId = setInterval(() => {
            const train = this.grid.runNewTrain();
            if (train === undefined) {
                clearInterval(timerId);
                return;
            }
            const trainObject = this.createTrainObject(train);
            train.subscribeOnStep((tr, oldPath, newPath, angle) => this.actTrain(trainObject, tr, oldPath, newPath, angle));
            train.subscribeOnFinish((tr, success) => console.log(success));
            train.goNext();
        }, 2000);

        this.grid.subscribeOnGameFinished(gameStat => {
            console.log('FINISH', gameStat);
        });
    }

    private createTrainObject(train: Train): Phaser.GameObjects.GameObject {
        const point = train.GetPosition();
        let xAdd = 0;
        let yAdd = 0;
        switch (train.GetDirection()) {
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
        console.log('train', train, train.GetPosition(), train.GetDirection(), getAngle(train.GetDirection()), xAdd, yAdd);
        const rectangle = this.add.rectangle(point.x * line + line / 2 + xAdd, point.y * line + line / 2 + yAdd, 30, 70, parseColor(train.color));
        rectangle.setAngle(getAngle(train.GetDirection()));
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

function parseColor(color: EColor): number {
    switch (color) {
        case EColor.Blue:
            return 0x0000FF;
        case EColor.Red:
            return 0xFF0000;
        case EColor.Green:
            return 0x00FF00;
        default:
            return 0;
    }
}

function getAngle(direction: EDirection): number {
    switch (direction) {
        case EDirection.Up:
            return 0;
        case EDirection.Down:
            return 180;
        case EDirection.Left:
            return 270;
        case EDirection.Right:
            return 90;
    }
}