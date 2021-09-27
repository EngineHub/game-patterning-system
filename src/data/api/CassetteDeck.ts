import {DataApi, DataApiError, MinecraftVersion} from "./DataApi";
import axios, {AxiosResponse} from "axios";
import {BlockData} from "../BlockData";
import {formatLater} from "../../util/format-later";
import {urlEncoded} from "../../util/formatters";

const BASE_URL = "https://services.enginehub.org/cassette-deck";
const VERSIONS_URL = formatLater`/minecraft-versions/list?before=${"before"}`.tag(urlEncoded);
const BLOCK_STATES_URL = formatLater`/block-states/${"dataVersion"}`.tag(urlEncoded);

class CassetteDeck implements DataApi {
    async getLatestMinecraftVersion(type: 'release' | 'snapshot'): Promise<MinecraftVersion | undefined> {
        for await (const x of CassetteDeck.iterateMinecraftVersions()) {
            if (x.type === type) {
                return x;
            }
        }
        return undefined;
    }

    getMinecraftVersions(): AsyncIterable<MinecraftVersion> {
        return CassetteDeck.iterateMinecraftVersions();
    }

    async getBlocks(dataVersion: number): Promise<Record<string, BlockData>> {
        const result = await axios.get(BASE_URL + BLOCK_STATES_URL.format({
            dataVersion: dataVersion.toString()
        }));
        CassetteDeck.failIfUnsuccessful(result);
        return result.data['blocks'] as Record<string, BlockData>;
    }

    private static async* iterateMinecraftVersions(): AsyncGenerator<CDMinecraftVersion> {
        let next = "";
        do {
            const result = await axios.get(BASE_URL + VERSIONS_URL.format({before: next}));
            CassetteDeck.failIfUnsuccessful(result);
            const cursor = result.data as Cursor<CDMinecraftVersion, string>;
            for (const item of cursor.items) {
                yield item;
            }
            next = cursor.next;
        } while (next);
    }

    private static failIfUnsuccessful(result: AxiosResponse<unknown>): void {
        if (result.status != 200) {
            throw new DataApiError("Failed to get data from cassette-deck: " + result.statusText, result.data);
        }
    }
}

interface CDMinecraftVersion extends MinecraftVersion {
    type: 'release' | 'snapshot' | 'old_beta' | 'old_alpha';
}

interface Cursor<T, N> {
    items: T[];
    next: N;
}

export const DATA_API: DataApi = new CassetteDeck();
