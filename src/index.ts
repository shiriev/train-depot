import Phaser from 'phaser';
import { GameScene } from './GameScene';
import { MenuScene } from './MenuScene';
import { PauseScene } from './PauseScene';

const config = {
    type: Phaser.AUTO,
    scene: [ MenuScene, GameScene, PauseScene ],
    backgroundColor: '#4488aa',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 600,
        height: 800
    },
};

const game = new Phaser.Game(config);
