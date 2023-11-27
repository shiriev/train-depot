

export class PauseButton {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        const rectangle = scene.add.rectangle(x + 25, y + 10, 50, 20, 0x000000);
        const button = scene.add.text(x, y, "pause");
        rectangle.setInteractive();
        rectangle.on("pointerdown", () => {
            if (scene.sys.game.scene.isPaused(scene)) {
                scene.sys.game.scene.resume(scene);
                button.text = "pause";
            } else {
                scene.sys.game.scene.pause(scene);
                button.text = "resume";
            }
        });
    }
}