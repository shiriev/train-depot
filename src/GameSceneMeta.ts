import { SceneMeta } from "./SceneMeta";
import { Level } from "./Logic/Levels";


export type GameSceneInitData = {
    level: Level
};

export class GameSceneMeta implements SceneMeta<GameSceneInitData> {
    name: string = 'GameScene';
    type: GameSceneInitData;
}
