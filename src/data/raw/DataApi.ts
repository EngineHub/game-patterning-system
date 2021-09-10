import {RawBlockData} from "./RawBlockData";

export interface DataApi {
    getBlocks(): Promise<Record<string, RawBlockData>>;
}

export class DataApiError<T> extends Error {
    constructor(message: string, public data: T) {
        super(message);
        this.name = "DataApiError";
    }
}
