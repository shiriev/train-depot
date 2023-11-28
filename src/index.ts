import Phaser from 'phaser';
import { GameScene } from './GameScene';

class MenuScene extends Phaser.Scene
{

}

const config = {
    type: Phaser.AUTO,
    scene: [GameScene],
    backgroundColor: '#4488aa',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 600,
        height: 800
    },
};

const game = new Phaser.Game(config);
