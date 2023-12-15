import { ICellVisitor } from './ICellVisitor';
import { IPath } from './ICell';
import { EDirection, ETurnAngle, ELeverType, ELeverTurn } from './Enums';
import { Point } from './Point';
import { MakeTurn } from './PathUtils';
import { ICell } from './ICell';

export class Lever implements IPath {
    private readonly point: Point;
    private readonly direction: EDirection;
    private readonly type: ELeverType;
    private readonly cells: ICell[];
    private currentTurn: ELeverTurn;

    constructor(point: Point,
        direction: EDirection,
        type: ELeverType,
        cell1: ICell,
        cell2: ICell,
        initTurn: ELeverTurn) {
        this.point = point;
        this.direction = direction;
        this.type = type;
        this.cells = [cell1, cell2];
        this.currentTurn = initTurn;
    }

    GetNextPath(): [ICell, ETurnAngle] {
        return [this.currentTurn === ELeverTurn.First ? this.cells[0] : this.cells[1], this.GetTurn()];
    }

    GetDirection(): EDirection {
        return MakeTurn(this.direction, this.GetTurn());
    }

    TurnLever(): ELeverTurn {
        this.currentTurn = this.currentTurn === ELeverTurn.Second ? ELeverTurn.First : ELeverTurn.Second;
        return this.currentTurn;
    }

    GetPosition(): Point {
        return this.point;
    }

    GetType(): ELeverType {
        return this.type;
    }

    GetCurrentTurn(): ELeverTurn {
        return this.currentTurn;
    }

    GetStartDirection(): EDirection {
        return this.direction;
    }

    AcceptVisitor(visitor: ICellVisitor): void {
        visitor.VisitLever(this);
    }

    Type: 'path' = 'path';

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
