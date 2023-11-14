import Phaser from 'phaser';
import { IPath } from './Logic/IPath';
import { EDirection, ETurnAngle } from './Logic/Enums';
import { Train } from './Logic/Train';
import { Grid } from './Logic/Grid';
import { PathVisitor } from './Logic/PathVisitor';

export class GameScene extends Phaser.Scene {
    grid: Grid;

    preload(): void {
    }

    create(): void {
        this.grid = new Grid();

        for (const path of this.grid.paths) {
            path.AcceptVisitor(new PathVisitor(
                r => {
                    const point = r.GetPosition();
                    this.add.rectangle(point.x * 100 + 50, point.y * 100 + 50, 100, 100, 16711680);
                },
                s => {
                    const point = s.GetPosition();
                    this.add.rectangle(point.x * 100 + 50, point.y * 100 + 50, 100, 100, 16776960);
                },
                ts => {
                    const point = ts.GetPosition();
                    this.add.rectangle(point.x * 100 + 50, point.y * 100 + 50, 100, 100, 16711935);
                },
                l => {
                    const point = l.GetPosition();
                    this.add.rectangle(point.x * 100 + 50, point.y * 100 + 50, 100, 100, 65280);
                }
            ));

            // this.add.rectangle(point.x * 100, point.y * 100, 100, 100, 0xff0000);
        }

        for (const train of this.grid.trains) {
            const point = train.GetPosition();
            const rectangle = this.add.rectangle(point.x * 100, point.y * 100 + 50, 30, 70, 16777215);
            rectangle.setAngle(90);
            train.subscribeOnStep((tr, oldPath, newPath, angle) => this.actTrain(rectangle, tr, oldPath, newPath, angle));
            train.subscribeOnFinish((tr, success) => console.log(success));
            train.goNext();
        }
    }

    private actTrain(gameObject: Phaser.GameObjects.GameObject, train: Train, oldPath: IPath, newPath: IPath, angleType: ETurnAngle): void {
        const speed = 0.05;
        const line = 100;
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
