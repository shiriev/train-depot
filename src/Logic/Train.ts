import { ICell, IPath, IStop } from './ICell';
import { EDirection, EColor, ETurnAngle } from './Enums';
import { Point } from './Point';

export class Train {
    public readonly color: EColor;

    private currentPath: ICell;
    private onStartCallacks: ((train: Train, path: IPath) => void)[];
    private onStepCallacks: ((train: Train, oldPath: IPath, newPath: ICell, turnAngle: ETurnAngle) => void)[];
    private onFinishCallacks: ((train: Train, success: boolean, path: ICell) => void)[];
    private pathNumber: number;

    constructor(color: EColor, initPath: ICell) {
        this.color = color;
        this.currentPath = initPath;
        this.onStartCallacks = [];
        this.onStepCallacks = [];
        this.onFinishCallacks = [];
        this.pathNumber = 0;
    }

    GoNext(): void {
        if (this.currentPath.Type === 'stop') {
            const stop = this.currentPath;
            this.onFinishCallacks.forEach(callback => callback(this, stop.GetColor() === this.color, this.currentPath));
            this.pathNumber++;
            return;
        }
        
        const [newPath, turnAngle] = this.currentPath.GetNextPath();
        const oldPath = this.currentPath;
        this.currentPath = newPath;
        if (this.pathNumber === 0) {
            this.onStartCallacks.forEach(callback => callback(this, oldPath));
        } else {
            this.onStepCallacks.forEach(callback => callback(this, oldPath, newPath, turnAngle));
        }
        this.pathNumber++;
    }

    GetPosition(): Point {
        return this.currentPath.GetPosition();
    }

    SubscribeOnStart(onStart: (train: Train, path: IPath) => void) {
        this.onStartCallacks.push(onStart);
    }

    SubscribeOnStep(onStep: (train: Train, oldPath: IPath, newPath: ICell, turnAngle: ETurnAngle) => void) {
        this.onStepCallacks.push(onStep);
    }

    SubscribeOnFinish(onFinish: (train: Train, success: boolean, path: IStop) => void) {
        this.onFinishCallacks.push(onFinish);
    }
}
