import Phaser from 'phaser';
import { Grid } from './Logic/Grid';
import { parseLevel } from './Logic/LevelParser';
import { Levels } from './Logic/Levels';
import { PathVisitor } from './Logic/PathVisitor';
import * as Images from './public';
import { RailObject } from './GameObjects/RailObject';
import { LeverObject } from './GameObjects/LeverObject';
import { StartObject } from './GameObjects/StartObject';
import { TrainStopObject } from './GameObjects/TrainStopObject';
import { TrainObject } from './GameObjects/TrainObject';
import * as Constants from './GameObjects/Constants';

export class GameScene extends Phaser.Scene {
    grid: Grid;

    preload(): void {
        // this.load.setPath('public/');
        this.load.image(Constants.RailLeftImage, Images.RailLeftImage);
        this.load.image(Constants.RailRightImage, Images.RailRightImage);
        this.load.image(Constants.RailForwardImage, Images.RailForwardImage);
        this.load.image(Constants.LeverForwardNotLeftImage, Images.LeverForwardNotLeftImage);
        this.load.image(Constants.LeverForwardNotRightImage, Images.LeverForwardNotRightImage);
        this.load.image(Constants.LeverLeftNotForwardImage, Images.LeverLeftNotForwardImage);
        this.load.image(Constants.LeverRightNotForwardImage, Images.LeverRightNotForwardImage);
        this.load.spritesheet(Constants.Tiles, Images.Tiles, { frameWidth: 100 });
    }

    create(): void {
        const parsingLevelResult = parseLevel(Levels[1]);

        if (parsingLevelResult.success === false) {
            throw new Error(parsingLevelResult.error);
        }

        this.grid = parsingLevelResult.grid;

        this.grid.visitPaths(new PathVisitor(
            rail => new RailObject(this, rail),
            start => new StartObject(this, start),
            trainStop => new TrainStopObject(this, trainStop),
            lever => new LeverObject(this, lever),
        ));

        const timedEvent = this.time.addEvent({
            delay: 4000,
            callback: () => {
                const train = this.grid.runNewTrain();
                if (train === undefined) {
                    // clearInterval(timerId);
                    timedEvent.remove();
                    return;
                }
                new TrainObject(this, train);
            },
            callbackScope: this,
            loop: true
        });

        // const timerId = setInterval(() => {
        //     const train = this.grid.runNewTrain();
        //     if (train === undefined) {
        //         clearInterval(timerId);
        //         return;
        //     }
        //     const trainObject = this.createTrainObject(train);
        //     train.subscribeOnStep((tr, oldPath, newPath, angle) => this.actTrain(trainObject, tr, oldPath, newPath, angle));
        //     train.subscribeOnFinish((tr, success) => console.log(success));
        //     train.goNext();
        // }, 2000);

        this.grid.subscribeOnGameFinished(gameStat => {
            console.log('FINISH', gameStat);
        });
    }
}