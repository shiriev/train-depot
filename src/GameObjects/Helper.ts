import { EColor, EDirection } from "../Logic/Enums";

export function parseColor(color: EColor): number {
    switch (color) {
        case EColor.Blue:
            return 0x0000FF;
        case EColor.Red:
            return 0xFF0000;
        case EColor.Green:
            return 0x00FF00;
        case EColor.Black:
            return 0x000000;
        case EColor.White:
            return 0xFFFFFF;
        case EColor.Orange:
            return 0xFF6600;
        case EColor.Purple:
            return 0x800080;
        case EColor.Brown:
            return 0xA52A2A;
        default:
            return 0;
    }
}

export function getAngle(direction: EDirection): number {
    switch (direction) {
        case EDirection.Up:
            return 0;
        case EDirection.Down:
            return 180;
        case EDirection.Left:
            return 270;
        case EDirection.Right:
            return 90;
    }
}