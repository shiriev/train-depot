import { Level } from "../Logic/Levels";
import { IRandomizer } from "./IRandomizer";


export class Generator {
    private randomizer: IRandomizer;
    constructor(randomizer: IRandomizer) {
        this.randomizer = randomizer;
    }

    GenerateLevel(stopCount: number, trainCount: number, width: number, height: number): Level {
        let attemptCount = 0;
        while (attemptCount < 1000) {
            // поставить случайным образом начальную точку
            // поставить случайным образом все конечные точки
            // отсортировать конечные точки в порядке уменьшения расстояния до начальной точки
            // для каждой точки
            //    построить кротчайший маршрут
            //    если до точки не удаётся построить маршрут, то начать с новой попытки
            attemptCount++;
        }
        throw new Error();
    }
}
