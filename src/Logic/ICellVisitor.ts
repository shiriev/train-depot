import { Lever } from './Lever';
import { TrainStop } from './TrainStop';
import { Start } from './Start';
import { Rail } from './Rail';

export interface ICellVisitor
{
    VisitRail(rail: Rail): void;
    VisitStart(start: Start): void;
    VisitTrainStop(stop: TrainStop): void;
    VisitLever(lever: Lever): void;
}
