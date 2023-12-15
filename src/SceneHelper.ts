import { SceneMeta } from "./SceneMeta";


export function Stop<T extends object>(ScenePlugin: Phaser.Scenes.ScenePlugin, meta: SceneMeta<T>) {
    ScenePlugin.stop(meta.name);
}

export function Launch<T extends object>(ScenePlugin: Phaser.Scenes.ScenePlugin, meta: SceneMeta<T>, data: T) {
    ScenePlugin.launch(meta.name, data);
}

export function Start<T extends object>(ScenePlugin: Phaser.Scenes.ScenePlugin, meta: SceneMeta<T>, data: T) {
    ScenePlugin.start(meta.name, data);
}

export function Pause<T extends object>(ScenePlugin: Phaser.Scenes.ScenePlugin, meta: SceneMeta<T>) {
    ScenePlugin.start(meta.name);
}

export function Resume<T extends object>(ScenePlugin: Phaser.Scenes.ScenePlugin, meta: SceneMeta<T>) {
    ScenePlugin.resume(meta.name);
}