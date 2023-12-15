import { ICell, IPath } from './ICell';
import { ICellVisitor } from './ICellVisitor';
import { EDirection, ETurnAngle, ERailType } from './Enums';
import { Point } from './Point';
import { MakeTurn } from './PathUtils';


export class Rail implements IPath {
    private readonly point: Point;
    private readonly direction: EDirection;
    private readonly type: ERailType;
    private readonly nextStep: ICell;

    constructor(point: Point,
        direction: EDirection,
        type: ERailType,
        nextStep: ICell) {
        this.point = point;
        this.direction = direction;
        this.type = type;
        this.nextStep = nextStep;
    }

    GetNextPath(): [ICell, ETurnAngle] {
        return [this.nextStep, this.GetTurn()];
    }

    GetDirection(): EDirection {
        return MakeTurn(this.direction, this.GetTurn());
    }

    GetStartDirection(): EDirection {
        return this.direction;
    }

    GetPosition(): Point {
        return this.point;
    }

    GetRailType(): ERailType {
        return this.type;
    }

    AcceptVisitor(visitor: ICellVisitor): void {
        visitor.VisitRail(this);
    }

    Type: 'path' = 'path';

    private GetTurn(): ETurnAngle {
        switch (this.type) {
            case ERailType.Forward:
                return ETurnAngle.Forward;
            case ERailType.Left:
                return ETurnAngle.Left;
            case ERailType.Right:
                return ETurnAngle.Right;
            default:
                throw new Error(`Unknown type ${this.type}`);
        }
    }
}
