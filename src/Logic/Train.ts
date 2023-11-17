import { IPath } from './IPath';
import { EDirection, ETurnAngle, EColor } from './Enums';
import { Point } from './Point';
import { Tilemaps } from 'phaser';

export class Train {
    public readonly color: EColor;

    private currentPath: IPath;
    private onFinishCallacks: ((train: Train, success: boolean) => void)[];
    private onStepCallacks: ((train: Train, oldPath: IPath, newPath: IPath, angle: ETurnAngle) => void)[];

    constructor(color: EColor, initPath: IPath) {
        this.color = color;
        this.currentPath = initPath;
        this.onFinishCallacks = [];
        this.onStepCallacks = [];
    }

    goNext(): void {
        if (this.currentPath.IsStop()) {
            const stop = this.currentPath.GetStop();
            this.onFinishCallacks.forEach(callback => callback(this, stop.GetColor() === this.color));
            return;
        }
        const [newPath, angle] = this.currentPath.GetNextPath();
        const oldPath = this.currentPath;
        this.currentPath = newPath;
        this.onStepCallacks.forEach(callback => callback(this, oldPath, newPath, angle));
    }

    GetPosition(): Point {
        return this.currentPath.GetPosition();
    }

    GetDirection(): EDirection {
        return this.currentPath.GetDirection();
    }

    subscribeOnFinish(onFinish: (train: Train, success: boolean) => void) {
        this.onFinishCallacks.push(onFinish);
    }

    subscribeOnStep(onStep: (train: Train, oldPath: IPath, newPath: IPath, angle: ETurnAngle) => void) {
        this.onStepCallacks.push(onStep);
    }
}
