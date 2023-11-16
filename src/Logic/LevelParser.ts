import { EColor, EDirection, ELeverTurn, ELeverType, ERailType, ETurnAngle } from "./Enums";
import { Grid } from "./Grid";
import { IPath } from "./IPath";
import { Level } from "./Levels";
import { Lever } from "./Lever";
import { MakeTurn } from "./PathUtils";
import { Point } from "./Point";
import { Rail } from "./Rail";
import { Start } from "./Start";
import { TrainStop } from "./TrainStop";

export function parseLevel(level: Level): LevelParsingResult {
    try {
        const startPoint = getStartPoint(level);

        const paths: IPath[] = [];
        const colors: EColor[] = [];
        const startPath = fillPaths(startPoint, level, paths, colors);

        return { success: true, grid: new Grid(paths, startPath, level.trainCount) };
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
                return new Point(x, y);
            }
        }
        y++;
    }
    throw new Error(`Level does not have start symbol (+)`);
}

function fillPaths(point: Point, level: Level, paths: IPath[], colors: EColor[]): IPath {
    const direction = parseDirection(level.map, point);
    if (typeof level.map[point.y] === 'undefined' || typeof level.map[point.y][point.x * 2] === 'undefined') {
        throw new Error(`Map does not have element at [${point.y}][${point.x * 2}]`);
    }

    switch (level.map[point.y][point.x * 2]) {
        case '+':
            const startNextPath = fillPaths(getNewPathPoint(point, direction), level, paths, colors);
            const start = new Start(point, direction, startNextPath);
            paths.push(start);
            return start;
        case '|':
            const railForwardNextPath = fillPaths(getNewPathPoint(point, direction), level, paths, colors);
            const railForward = new Rail(point, direction, ERailType.Forward, railForwardNextPath);
            paths.push(railForward);
            return railForward;
        case '[':
            const railLeftNextPath = fillPaths(getNewPathPoint(point, MakeTurn(direction, ETurnAngle.Left)), level, paths, colors);
            const railLeft = new Rail(point, direction, ERailType.Left, railLeftNextPath);
            paths.push(railLeft);
            return railLeft;
        case ']':
            const railRightNextPath = fillPaths(getNewPathPoint(point, MakeTurn(direction, ETurnAngle.Right)), level, paths, colors);
            const railRight = new Rail(point, direction, ERailType.Right, railRightNextPath);
            paths.push(railRight);
            return railRight;
        case '{':
            const leverLeftNextPath1 = fillPaths(getNewPathPoint(point, MakeTurn(direction, ETurnAngle.Forward)), level, paths, colors);
            const leverLeftNextPath2 = fillPaths(getNewPathPoint(point, MakeTurn(direction, ETurnAngle.Left)), level, paths, colors);
            const leverLeft = new Lever(point, direction, ELeverType.ForwardAndLeft, leverLeftNextPath1, leverLeftNextPath2, ELeverTurn.First);
            paths.push(leverLeft);
            return leverLeft;
        case '}':
            const leverRightNextPath1 = fillPaths(getNewPathPoint(point, MakeTurn(direction, ETurnAngle.Forward)), level, paths, colors);
            const leverRightNextPath2 = fillPaths(getNewPathPoint(point, MakeTurn(direction, ETurnAngle.Right)), level, paths, colors);
            const leverRight = new Lever(point, direction, ELeverType.ForwardAndRight, leverRightNextPath1, leverRightNextPath2, ELeverTurn.Second);
            paths.push(leverRight);
            return leverRight;
        case '#':
            const newColor: EColor = colors.length;
            if (newColor >= EColor.__LENGTH) {
                throw new Error(`There are too many train stops (${newColor} >= ${EColor.__LENGTH})`);
            }
            const stop = new TrainStop(point, direction, newColor);
            colors.push(newColor);
            paths.push(stop);
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
            return new Point(point.x, point.y - 1);
        case EDirection.Down:
            return new Point(point.x, point.y + 1);
        case EDirection.Right:
            return new Point(point.x + 1, point.y);
        case EDirection.Left:
            return new Point(point.x - 1, point.y);
        default:
            throw new Error(`Unknown direction type (${direction})`);
    }
}