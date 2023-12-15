import { ICell, IPath } from './ICell';
import { ICellVisitor } from './ICellVisitor';
import { EDirection, ETurnAngle } from './Enums';
import { Point } from './Point';


export class Start implements IPath {
    private readonly point: Point;
    private readonly direction: EDirection;
    private readonly nextStep: ICell;

    constructor(point: Point,
        direction: EDirection,
        nextStep: ICell) {
        this.point = point;
        this.direction = direction;
        this.nextStep = nextStep;
    }

    GetNextPath(): [ICell, ETurnAngle]  {
        return [this.nextStep, ETurnAngle.Forward];
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

    Type: 'path' = 'path';

    AcceptVisitor(visitor: ICellVisitor): void {
        visitor.VisitStart(this);
    }
}
