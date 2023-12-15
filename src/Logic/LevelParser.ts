import { EColor, EDirection, ELeverTurn, ELeverType, ERailType, ETurnAngle } from "./Enums";
import { Grid } from "./Grid";
import { ICell, IPath } from "./ICell";
import { Level } from "./Levels";
import { Lever } from "./Lever";
import { MakeTurn } from "./PathUtils";
import { Point } from "./Point";
import { Rail } from "./Rail";
import { Start } from "./Start";
import { Train } from "./Train";
import { TrainStop } from "./TrainStop";

export function parseLevel(level: Level): LevelParsingResult {
    try {
        const startPoint = getStartPoint(level);

        const cells: ICell[] = [];
        const colors: EColor[] = [];
        const startPath = fillCells(startPoint, level, cells, colors);
        const trainColors = generateTrainColors(level.trainCount, colors);
        const trains = trainColors.map(c => new Train(c, startPath));

        return { success: true, grid: new Grid(cells, trains) };
    }
    catch (errorAny) {
        const error: Error = errorAny;
        return { success: false, error: error.message };
    }
}

export type LevelParsingResult = {
    success: true,
    grid: Grid,
} | {
    success: false,
    error: string,
}

function getStartPoint(level: Level): Point {
    let y = 0;
    for (const line of level.map) {
        for (let x = 0; x * 2 < line.length; x++) {
            if (line[x * 2] === '+') {
                return { x: x, y: y };
            }
        }
        y++;
    }
    throw new Error(`Level does not have start symbol (+)`);
}

function fillCells(point: Point, level: Level, cells: ICell[], colors: EColor[]): ICell {
    const direction = parseDirection(level.map, point);
    if (typeof level.map[point.y] === 'undefined' || typeof level.map[point.y][point.x * 2] === 'undefined') {
        throw new Error(`Map does not have element at [${point.y}][${point.x * 2}]`);
    }

    switch (level.map[point.y][point.x * 2]) {
        case '+':
            const startNextPath = fillCells(getNewPathPoint(point, direction), level, cells, colors);
            const start = new Start(point, direction, startNextPath);
            cells.push(start);
            return start;
        case '|':
            const railForwardNextPath = fillCells(getNewPathPoint(point, direction), level, cells, colors);
            const railForward = new Rail(point, direction, ERailType.Forward, railForwardNextPath);
            cells.push(railForward);
            return railForward;
        case '[':
            const railLeftNextPath = fillCells(getNewPathPoint(point, MakeTurn(direction, ETurnAngle.Left)), level, cells, colors);
            const railLeft = new Rail(point, direction, ERailType.Left, railLeftNextPath);
            cells.push(railLeft);
            return railLeft;
        case ']':
            const railRightNextPath = fillCells(getNewPathPoint(point, MakeTurn(direction, ETurnAngle.Right)), level, cells, colors);
            const railRight = new Rail(point, direction, ERailType.Right, railRightNextPath);
            cells.push(railRight);
            return railRight;
        case '{':
            const leverLeftNextPath1 = fillCells(getNewPathPoint(point, MakeTurn(direction, ETurnAngle.Forward)), level, cells, colors);
            const leverLeftNextPath2 = fillCells(getNewPathPoint(point, MakeTurn(direction, ETurnAngle.Left)), level, cells, colors);
            const leverLeft = new Lever(point, direction, ELeverType.ForwardAndLeft, leverLeftNextPath1, leverLeftNextPath2, ELeverTurn.First);
            cells.push(leverLeft);
            return leverLeft;
        case '}':
            const leverRightNextPath1 = fillCells(getNewPathPoint(point, MakeTurn(direction, ETurnAngle.Forward)), level, cells, colors);
            const leverRightNextPath2 = fillCells(getNewPathPoint(point, MakeTurn(direction, ETurnAngle.Right)), level, cells, colors);
            const leverRight = new Lever(point, direction, ELeverType.ForwardAndRight, leverRightNextPath1, leverRightNextPath2, ELeverTurn.Second);
            cells.push(leverRight);
            return leverRight;
        case '#':
            const newColor: EColor = colors.length;
            if (newColor >= EColor.__LENGTH) {
                throw new Error(`There are too many train stops (${newColor} >= ${EColor.__LENGTH})`);
            }
            const stop = new TrainStop(point, direction, newColor);
            colors.push(newColor);
            cells.push(stop);
            return stop;
        default:
            throw new Error(`Unknown tile symbol ('${level.map[point.y][point.x * 2]}' at [${point.y}][${point.x * 2}])`);
    }
}

function parseDirection(map: string[], point: Point): EDirection {
    if (typeof map[point.y] === 'undefined' || typeof map[point.y][point.x * 2 + 1] === 'undefined') {
        throw new Error(`Map does not have element at [${point.y}][${point.x * 2 + 1}]`);
    }
    const char = map[point.y][point.x * 2 + 1];
    switch (char) {
        case '^':
            return EDirection.Up;
        case 'v':
            return EDirection.Down;
        case '>':
            return EDirection.Right;
        case '<':
            return EDirection.Left;
        default:
            throw new Error(`Unknown direction symbol (${char} at [${point.y}][${point.x * 2 + 1}]))`);
    }
}

function getNewPathPoint(point: Point, direction: EDirection): Point {
    switch (direction) {
        case EDirection.Up:
            return { x: point.x, y: point.y - 1 };
        case EDirection.Down:
            return { x: point.x, y: point.y + 1 };
        case EDirection.Right:
            return { x: point.x + 1, y: point.y };
        case EDirection.Left:
            return { x: point.x - 1, y: point.y };
        default:
            throw new Error(`Unknown direction type (${direction})`);
    }
}

function generateTrainColors(trainCount: number, colors: EColor[]): EColor[] {
    const trainColors: EColor[] = [];
    let tempColors: EColor[] = [];
    for (let i = 0; i < trainCount; i++) {
        if (tempColors.length == 0) {
            tempColors = [...colors];
        }
        const randomIndex = getRandomIntInclusive(0, tempColors.length - 1);
        trainColors[i] = tempColors[randomIndex];
        tempColors[randomIndex] = tempColors[tempColors.length - 1];
        tempColors.pop();
    }
    return trainColors;
}

function getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}