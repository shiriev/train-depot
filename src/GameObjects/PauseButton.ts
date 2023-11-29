

export class PauseButton {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        const rectangle = scene.add.rectangle(x + 25, y + 10, 50, 20, 0x000000);
        const button = scene.add.text(x, y, "pause");
        rectangle.setInteractive();
        rectangle.on("pointerdown", () => {
            scene.scene.pause(scene);
            scene.scene.launch('PauseScene');
        });
    }
}