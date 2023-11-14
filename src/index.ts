import Phaser from 'phaser';
import { GameScene } from './GameScene';

class MenuScene extends Phaser.Scene
{

}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [GameScene],
};

const game = new Phaser.Game(config);
