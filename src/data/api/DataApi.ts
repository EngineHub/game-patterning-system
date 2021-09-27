import {BlockData} from "../BlockData";

export interface DataApi {
    getLatestMinecraftVersion(type: 'release' | 'snapshot'): Promise<MinecraftVersion | undefined>;
    getMinecraftVersions(): AsyncIterable<MinecraftVersion>;
    getBlocks(dataVersion: number): Promise<Record<string, BlockData>>;
}

export interface MinecraftVersion {
    version: string;
    dataVersion: number;
    hasDataGenInfo: boolean;
}

export class DataApiError<T> extends Error {
    constructor(message: string, public data: T) {
        super(message);
        this.name = "DataApiError";
    }
}
