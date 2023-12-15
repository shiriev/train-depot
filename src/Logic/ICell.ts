import { Point } from './Point';
import { EColor, EDirection, ETurnAngle } from './Enums';
import { ICellVisitor } from './ICellVisitor';

type BaseCell =
{
    GetStartDirection: () => EDirection;
    GetPosition: () => Point;
    AcceptVisitor: (visitor: ICellVisitor) => void;
}

export type IPath = BaseCell &
{
    GetDirection: () => EDirection;
    GetNextPath: () => [ICell, ETurnAngle];
    Type: 'path';
}

export type IStop = BaseCell &
{
    GetColor(): EColor;
    Type: 'stop';
}

export type ICell = IPath | IStop;