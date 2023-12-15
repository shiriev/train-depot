import { GameStat } from "./Logic/GameStat";
import { Level } from "./Logic/Levels";
import { SceneMeta } from "./SceneMeta";


export type FinishSceneInitData = {
    stat: GameStat,
    level: Level,
};

export class FinishSceneMeta implements SceneMeta<FinishSceneInitData> {
    name: string = 'FinishScene';
    type: FinishSceneInitData;
}
