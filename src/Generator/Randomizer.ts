import { Point } from "../Logic/Point";
import { IRandomizer } from "./IRandomizer";


export class Randomizer implements IRandomizer {
    RandomPoint(width: number, height: number): Point {
        return { x: this.getRandomInt(width), y: this.getRandomInt(height) };
    }

    private getRandomInt(max: number): number {
        return Math.floor(Math.random() * max);
    }
}