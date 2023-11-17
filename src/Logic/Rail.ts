import { IPath } from './IPath';
import { IPathVisitor } from './IPathVisitor';
import { IStop } from './IStop';
import { EDirection, ETurnAngle, ERailType } from './Enums';
import { Point } from './Point';
import { MakeTurn } from './PathUtils';


export class Rail implements IPath {
    private readonly point: Point;
    private readonly direction: EDirection;
    private readonly type: ERailType;
    private readonly nextStep: IPath;

    constructor(point: Point,
        direction: EDirection,
        type: ERailType,
        nextStep: IPath) {
        this.point = point;
        this.direction = direction;
        this.type = type;
        this.nextStep = nextStep;
    }

    GetNextPath(): [IPath, ETurnAngle] | null {
        return [this.nextStep, this.GetTurn()];
    }

    IsStop(): boolean {
        return false;
    }

    GetStop(): IStop | null {
        return null;
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

    AcceptVisitor(visitor: IPathVisitor): void {
        visitor.VisitRail(this);
    }

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
