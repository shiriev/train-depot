import { Level } from "./Logic/Levels";
import { SceneMeta } from "./SceneMeta";


export type PauseSceneInitData = {
    level: Level,
};

export class PauseSceneMeta implements SceneMeta<PauseSceneInitData> {
    name: string = 'PauseScene';
    type: PauseSceneInitData;
}
