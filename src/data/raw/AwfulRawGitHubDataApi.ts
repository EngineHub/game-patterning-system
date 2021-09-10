import {DataApi, DataApiError} from "./DataApi";
import {RawBlockData} from "./RawBlockData";
import axios from "axios";

const URL = "https://raw.githubusercontent.com/EngineHub/WorldEdit/7.2.6/worldedit-cli/src/main/resources/com/sk89q/worldedit/cli/data/2724.json";

class AwfulRawGitHubDataApi implements DataApi {
    async getBlocks(): Promise<Record<string, RawBlockData>> {
        const result = await axios.get(URL);
        if (result.status != 200) {
            throw new DataApiError("Failed to get data from GitHub: " + result.statusText, result.data);
        }
        return result.data['blocks'] as Record<string, RawBlockData>;
    }
}

export const DATA_API: DataApi = new AwfulRawGitHubDataApi();
