import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {
    preload(): void {
    }

    constructor() {
        super('PauseScene');
    }

    create(): void {
        const resumeButton = this.add.text(200, 200, "resume");
        resumeButton.setInteractive();
        resumeButton.on('pointerdown', () => {
            this.scene.resume('GameScene');
            this.scene.stop('PauseScene');
        });

        const menuButton = this.add.text(200, 300, "menu");
        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            this.scene.stop('GameScene');
            this.scene.start('MenuScene');
        })
    }
}
