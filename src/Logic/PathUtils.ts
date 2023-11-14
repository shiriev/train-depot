import { EDirection, ETurnAngle } from './Enums';

export function MakeTurn(direction: EDirection, angle: ETurnAngle): EDirection
{
    switch (angle) {
        case ETurnAngle.Forward:
            return direction;
        case ETurnAngle.Back:
            switch (direction) {
                case EDirection.Up:
                    return EDirection.Down;
                case EDirection.Down:
                    return EDirection.Up;
                case EDirection.Left:
                    return EDirection.Right;
                case EDirection.Right:
                    return EDirection.Left;
                default:
                    throw new Error(`Unknown direction ${direction}`);
            }
        case ETurnAngle.Left:
            switch (direction) {
                case EDirection.Up:
                    return EDirection.Left;
                case EDirection.Down:
                    return EDirection.Right;
                case EDirection.Left:
                    return EDirection.Down;
                case EDirection.Right:
                    return EDirection.Up;
                default:
                    throw new Error(`Unknown direction ${direction}`);
            }
        case ETurnAngle.Right:
            switch (direction) {
                case EDirection.Up:
                    return EDirection.Right;
                case EDirection.Down:
                    return EDirection.Left;
                case EDirection.Left:
                    return EDirection.Up;
                case EDirection.Right:
                    return EDirection.Down;
                default:
                    throw new Error(`Unknown direction ${direction}`);
            }
        default:
            throw new Error(`Unknown angle ${angle}`);
    }
}
