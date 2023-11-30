import { IPath } from './IPath';
import { EDirection, ETurnAngle, EColor } from './Enums';
import { Point } from './Point';
import { Tilemaps } from 'phaser';

export class Train {
    public readonly color: EColor;

    private currentPath: IPath;
    private onStartCallacks: ((train: Train, path: IPath) => void)[];
    private onStepCallacks: ((train: Train, oldPath: IPath, newPath: IPath, angle: ETurnAngle) => void)[];
    private onFinishCallacks: ((train: Train, success: boolean, path: IPath) => void)[];
    private pathNumber: number;

    constructor(color: EColor, initPath: IPath) {
        this.color = color;
        this.currentPath = initPath;
        this.onStartCallacks = [];
        this.onStepCallacks = [];
        this.onFinishCallacks = [];
        this.pathNumber = 0;
    }

    goNext(): void {
        if (this.currentPath.IsStop()) {
            const stop = this.currentPath.GetStop();
            this.onFinishCallacks.forEach(callback => callback(this, stop.GetColor() === this.color, this.currentPath));
            this.pathNumber++;
            return;
        }
        const [newPath, angle] = this.currentPath.GetNextPath();
        const oldPath = this.currentPath;
        this.currentPath = newPath;
        if (this.pathNumber === 0) {
            this.onStartCallacks.forEach(callback => callback(this, oldPath));
        } else {
            this.onStepCallacks.forEach(callback => callback(this, oldPath, newPath, angle));
        }
        this.pathNumber++;
    }

    GetPosition(): Point {
        return this.currentPath.GetPosition();
    }

    GetDirection(): EDirection {
        return this.currentPath.GetDirection();
    }

    subscribeOnStart(onStart: (train: Train, path: IPath) => void) {
        this.onStartCallacks.push(onStart);
    }

    subscribeOnStep(onStep: (train: Train, oldPath: IPath, newPath: IPath, angle: ETurnAngle) => void) {
        this.onStepCallacks.push(onStep);
    }

    subscribeOnFinish(onFinish: (train: Train, success: boolean, path: IPath) => void) {
        this.onFinishCallacks.push(onFinish);
    }
}
