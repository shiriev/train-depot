import { Train } from './Train';
import { ICellVisitor } from './ICellVisitor';
import { GameStat } from './GameStat';
import { ICell } from './ICell';

export class Grid
{
    private readonly cells: ICell[];
    private readonly trains: Train[];
    private readonly totalTrainCount: number;
    private finishedTrainCount: number;
    private succesfullFinishedTrainCount: number;
    private onStatChangedCallbacks: ((stat: GameStat) => void)[];
    private onGameFinishedCallbacks: ((stat: GameStat) => void)[];

    constructor(cells: ICell[], trains: Train[]) {
        this.cells = cells;
        this.trains = trains.reverse();
        this.totalTrainCount = trains.length;
        this.finishedTrainCount = 0;
        this.succesfullFinishedTrainCount = 0;
        for (const train of trains) {
            train.SubscribeOnFinish((train: Train, success: boolean) => this.onTrainFinished(train, success));
        }
        this.onStatChangedCallbacks = [];
        this.onGameFinishedCallbacks = [];
    }

    visitPaths(visitor: ICellVisitor): void {
        for (const cell of this.cells) {
            cell.AcceptVisitor(visitor);
        }
    }

    subscribeOnStatChanged(onStatChanged: (stat: GameStat) => void): void {
        this.onStatChangedCallbacks.push(onStatChanged);
    }

    subscribeOnGameFinished(onGameFinished: (stat: GameStat) => void): void {
        this.onGameFinishedCallbacks.push(onGameFinished);
    }

    runNewTrain(): Train | undefined {
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

