import { IPath } from './IPath';
import { IPathVisitor } from './IPathVisitor';
import { IStop } from './IStop';
import { EDirection, ETurnAngle, ELeverType, ELeverTurn } from './Enums';
import { Point } from './Point';
import { MakeTurn } from './PathUtils';

export class Lever implements IPath {
    private readonly point: Point;
    private readonly direction: EDirection;
    private readonly type: ELeverType;
    private readonly paths: IPath[];
    private currentTurn: ELeverTurn;

    constructor(point: Point,
        direction: EDirection,
        type: ELeverType,
        path1: IPath,
        path2: IPath,
        initTurn: ELeverTurn) {
        this.point = point;
        this.direction = direction;
        this.type = type;
        this.paths = [path1, path2];
        this.currentTurn = initTurn;
    }

    GetNextPath(): [IPath, ETurnAngle] | null {
        return [this.currentTurn === ELeverTurn.First ? this.paths[0] : this.paths[1], this.GetTurn()];
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

    TurnLever(): void {
        this.currentTurn = this.currentTurn === ELeverTurn.Second ? ELeverTurn.First : ELeverTurn.Second;
    }

    GetPosition(): Point {
        return this.point;
    }

    AcceptVisitor(visitor: IPathVisitor): void {
        visitor.VisitLever(this);
    }

    private GetTurn(): ETurnAngle {
        switch (this.type) {
            case ELeverType.ForwardAndLeft:
                return this.currentTurn === ELeverTurn.First ? ETurnAngle.Forward : ETurnAngle.Left;
            case ELeverType.ForwardAndRight:
                return this.currentTurn === ELeverTurn.First ? ETurnAngle.Forward : ETurnAngle.Right;
            default:
                throw new Error(`Unknown type ${this.type}`);
        }
    }
}
