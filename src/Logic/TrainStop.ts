import { IPath } from './IPath';
import { IPathVisitor } from './IPathVisitor';
import { IStop } from './IStop';
import { EDirection, ETurnAngle, EColor } from './Enums';
import { Point } from './Point';


export class TrainStop implements IPath, IStop {
    private readonly point: Point;
    private readonly direction: EDirection;
    private readonly color: EColor;

    constructor(
        point: Point,
        direction: EDirection,
        color: EColor) {
        this.point = point;
        this.direction = direction;
        this.color = color;
    }

    GetNextPath(): [IPath, ETurnAngle] | null {
        return null;
    }

    GetColor(): EColor {
        return this.color;
    }

    GetDirection(): EDirection | null {
        return this.direction;
    }

    IsStop(): boolean {
        return true;
    }

    GetStop(): IStop | null {
        return this;
    }

    GetPosition(): Point {
        return this.point;
    }

    AcceptVisitor(visitor: IPathVisitor): void {
        visitor.VisitTrainStop(this);
    }
}
