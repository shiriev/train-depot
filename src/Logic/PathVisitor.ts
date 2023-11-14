import { IPathVisitor } from './IPathVisitor';
import { Rail } from './Rail';
import { Start } from './Start';
import { TrainStop } from './TrainStop';
import { Lever } from './Lever';

export class PathVisitor implements IPathVisitor {
    private readonly railVisit: (rail: Rail) => void;
    private readonly startVisit: (start: Start) => void;
    private readonly trainStopVisit: (trainStop: TrainStop) => void;
    private readonly leverVisit: (lever: Lever) => void;

    constructor(railVisit: (rail: Rail) => void,
        startVisit: (start: Start) => void,
        trainStopVisit: (trainStop: TrainStop) => void,
        leverVisit: (lever: Lever) => void) {
        this.railVisit = railVisit;
        this.startVisit = startVisit;
        this.trainStopVisit = trainStopVisit;
        this.leverVisit = leverVisit;
    }

    VisitRail(rail: Rail): void {
        this.railVisit(rail);
    }

    VisitStart(start: Start): void {
        this.startVisit(start);
    }

    VisitTrainStop(stop: TrainStop): void {
        this.trainStopVisit(stop);
    }

    VisitLever(lever: Lever): void {
        this.leverVisit(lever);
    }
}
