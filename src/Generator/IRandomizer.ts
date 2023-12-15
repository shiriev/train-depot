import { Point } from "../Logic/Point";


export interface IRandomizer {
    RandomPoint(width: number, height: number): Point;
}
