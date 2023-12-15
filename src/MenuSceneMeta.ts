import { SceneMeta } from "./SceneMeta";


export type MenuSceneInitData = {};

export class MenuSceneMeta implements SceneMeta<MenuSceneInitData> {
    name: string = 'MenuScene';
    type: MenuSceneInitData;
}
