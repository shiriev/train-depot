import { IPath } from './IPath';
import { Train } from './Train';
import { IPathVisitor } from './IPathVisitor';
import { GameStat } from './GameStat';

export class Grid
{
    private readonly paths: IPath[];
    private readonly trains: Train[];
    private readonly totalTrainCount: number;
    private finishedTrainCount: number;
    private succesfullFinishedTrainCount: number;
    private onStatChangedCallbacks: ((stat: GameStat) => void)[];
    private onGameFinishedCallbacks: ((stat: GameStat) => void)[];

    constructor(paths: IPath[], trains: Train[]) {
        this.paths = paths;
        this.trains = trains.reverse();
        this.totalTrainCount = trains.length;
        this.finishedTrainCount = 0;
        this.succesfullFinishedTrainCount = 0;
        for (const train of trains) {
            train.subscribeOnFinish((train: Train, success: boolean) => this.onTrainFinished(train, success));
        }
        this.onStatChangedCallbacks = [];
        this.onGameFinishedCallbacks = [];
    }

    visitPaths(visitor: IPathVisitor): void {
        for (const path of this.paths) {
            path.AcceptVisitor(visitor);
        }
    }

    subscribeOnStatChanged(onStatChanged: (stat: GameStat) => void): void {
        this.onStatChangedCallbacks.push(onStatChanged);
    }

    subscribeOnGameFinished(onGameFinished: (stat: GameStat) => void): void {
        this.onGameFinishedCallbacks.push(onGameFinished);
    }

    runNewTrain(): Train {
        return this.trains.pop();
    }

    private onTrainFinished(train: Train, success: boolean): void {
        this.finishedTrainCount++;
        if (success) {
            this.succesfullFinishedTrainCount++;
        }

        const stat: GameStat = {         
            totalTrainCount: this.totalTrainCount,
            finishedTrainCount: this.finishedTrainCount,
            succesfullFinishedTrainCount: this.succesfullFinishedTrainCount
        };

        this.onStatChangedCallbacks.forEach(callback => callback(stat));

        if (this.finishedTrainCount === this.totalTrainCount) {
            this.onGameFinishedCallbacks.forEach(callback => callback(stat));
        }
    }
}

