import { Point } from './Point';
import { ETurnAngle, EDirection } from './Enums';
import { IStop } from './IStop';
import { IPathVisitor } from './IPathVisitor';

export interface IPath
{
    GetDirection(): EDirection | null;
    IsStop(): boolean;
    GetStop(): IStop | null;
    GetNextPath(): [IPath, ETurnAngle] | null;
    GetPosition(): Point;
    AcceptVisitor(visitor: IPathVisitor): void;
}
