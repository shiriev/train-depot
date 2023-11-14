import { IPath } from './IPath';
import { EDirection, ETurnAngle, EColor } from './Enums';
import { Point } from './Point';

export class Train {
    public readonly color: EColor;

    private currentPath: IPath;
    private onFinish: (train: Train, success: boolean) => void;
    private onStep: (train: Train, oldPath: IPath, newPath: IPath, angle: ETurnAngle) => void;

    constructor(color: EColor, initPath: IPath) {
        this.color = color;
        this.currentPath = initPath;
    }

    goNext(): void {
        if (this.currentPath.IsStop()) {
            const stop = this.currentPath.GetStop();
            this.onFinish(this, stop.GetColor() === this.color);
            return;
        }
        const [newPath, angle] = this.currentPath.GetNextPath();
        const oldPath = this.currentPath;
        this.currentPath = newPath;
        this.onStep(this, oldPath, newPath, angle);
    }

    GetPosition(): Point {
        return this.currentPath.GetPosition();
    }

    GetDirection(): EDirection {
        return this.currentPath.GetDirection();
    }

    subscribeOnFinish(onFinish: (train: Train, success: boolean) => void) {
        this.onFinish = onFinish;
    }

    subscribeOnStep(onStep: (train: Train, oldPath: IPath, newPath: IPath, angle: ETurnAngle) => void) {
        this.onStep = onStep;
    }
}
