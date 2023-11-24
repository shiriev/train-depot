import { IPath } from './IPath';
import { IPathVisitor } from './IPathVisitor';
import { IStop } from './IStop';
import { EDirection, ETurnAngle } from './Enums';
import { Point } from './Point';


export class Start implements IPath {
    private readonly point: Point;
    private readonly direction: EDirection;
    private readonly nextStep: IPath;

    constructor(point: Point,
        direction: EDirection,
        nextStep: IPath) {
        this.point = point;
        this.direction = direction;
        this.nextStep = nextStep;
    }

    GetNextPath(): [IPath, ETurnAngle] | null {
        return [this.nextStep, ETurnAngle.Forward];
    }

    IsStop(): boolean {
        return false;
    }

    GetStop(): IStop | null {
        return null;
    }

    GetDirection(): EDirection {
        return this.direction;
    }

    GetStartDirection(): EDirection {
        return this.direction;
    }

    GetPosition(): Point {
        return this.point;
    }

    AcceptVisitor(visitor: IPathVisitor): void {
        visitor.VisitStart(this);
    }
}
