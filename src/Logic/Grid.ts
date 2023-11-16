import { IPath } from './IPath';
import { EDirection, EColor, ERailType, ELeverType, ELeverTurn } from './Enums';
import { Point } from './Point';
import { Train } from './Train';
import { Rail } from './Rail';
import { Start } from './Start';
import { TrainStop } from './TrainStop';
import { Lever } from './Lever';

export class Grid
{
    public paths: IPath[];
    public trains: Train[];

    constructor(paths: IPath[], startPath: IPath, trainCount: number) {
        this.paths = paths;
        const train = new Train(EColor.Blue, startPath);
        this.trains = [train];
        // const stop1 = new TrainStop(new Point(1, 2), EColor.Blue, EDirection.Down);
        // const rail1Stop1 = new Rail(new Point(1, 1), EDirection.Left, ERailType.Left, stop1);
        // const rail2Stop1 = new Rail(new Point(2, 1), EDirection.Down, ERailType.Right, rail1Stop1);
        // const stop2 = new TrainStop(new Point(3, 0), EColor.Red, EDirection.Right);
        // const lever = new Lever(new Point(2, 0), EDirection.Right, ELeverType.ForwardAndRight, stop2, rail2Stop1, ELeverTurn.First);
        // lever.TurnLever();
        // const rail = new Rail(new Point(1, 0), EDirection.Right, ERailType.Forward, lever);
        // const start = new Start(new Point(0, 0), EDirection.Right, rail);
        // this.paths = [start, rail, lever, stop1, stop2, rail1Stop1, rail2Stop1];
// 
        // const train = new Train(EColor.Blue, start);
        // this.trains = [train];
    }
}
