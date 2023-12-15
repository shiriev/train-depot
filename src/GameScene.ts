import Phaser from 'phaser';
import { Grid } from './Logic/Grid';
import { parseLevel } from './Logic/LevelParser';
import { Level } from './Logic/Levels';
import { CellVisitor } from './Logic/CellVisitor';
import * as Images from './public';
import * as SceneHelper from './SceneHelper';
import * as FinishSceneMeta from "./FinishSceneMeta";
import * as Constants from './GameObjects/Constants';
import { RailObject } from './GameObjects/RailObject';
import { LeverObject } from './GameObjects/LeverObject';
import { StartObject } from './GameObjects/StartObject';
import { TrainStopObject } from './GameObjects/TrainStopObject';
import { TrainObject } from './GameObjects/TrainObject';
import { Scoreboard } from './GameObjects/Scoreboard';
import { PauseButton } from './GameObjects/PauseButton';
import { GameSceneInitData, GameSceneMeta } from './GameSceneMeta';


export class GameScene extends Phaser.Scene {
    grid: Grid;
    level: Level;

    constructor() {
        super(new GameSceneMeta().name);
    }

    preload(): void {
        this.load.spritesheet(Constants.Tiles, Images.Tiles, { frameWidth: 100 });
    }

    init(data: GameSceneInitData) {
        this.level = data.level;
    }

    create(): void {
        const parsingLevelResult = parseLevel(this.level);

        if (parsingLevelResult.success === false) {
            throw new Error(parsingLevelResult.error);
        }

        this.grid = parsingLevelResult.grid;

        this.grid.visitPaths(new CellVisitor(
            rail => new RailObject(this, rail),
            start => new StartObject(this, start),
            trainStop => new TrainStopObject(this, trainStop),
            lever => new LeverObject(this, lever),
        ));

        const timedEvent = this.time.addEvent({
            startAt: 3000,
            delay: 4000,
            callback: () => {
                const train = this.grid.runNewTrain();
                if (train === undefined) {
                    timedEvent.remove();
                    return;
                }
                new TrainObject(this, train);
            },
            callbackScope: this,
            loop: true
        });

        new Scoreboard(this, this.grid, 300, 750);
        new PauseButton(this, 100, 750, this.level);

        this.grid.subscribeOnGameFinished(gameStat => {
            SceneHelper.Launch(this.scene, new FinishSceneMeta.FinishSceneMeta(), { stat: gameStat, level: this.level });
        });
    }
}