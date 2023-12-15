import { ICellVisitor } from './ICellVisitor';
import { IStop } from './ICell';
import { EDirection, EColor } from './Enums';
import { Point } from './Point';


export class TrainStop implements IStop {
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

    GetColor(): EColor {
        return this.color;
    }

    GetDirection(): EDirection | null {
        return this.direction;
    }

    GetStartDirection(): EDirection {
        return this.direction;
    }

    IsStop(): boolean {
        return true;
    }

    GetPosition(): Point {
        return this.point;
    }

    Type: 'stop' = 'stop';

    AcceptVisitor(visitor: ICellVisitor): void {
        visitor.VisitTrainStop(this);
    }
}
