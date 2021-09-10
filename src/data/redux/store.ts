import {configureStore} from "@reduxjs/toolkit";
import {blockDataReducer, failBlockData, setBlockData} from "./block-data";
import {DATA_API} from "../raw/AwfulRawGitHubDataApi";
import {BlockData, loadFromRaw} from "../BlockData";

export const store = configureStore({
    reducer: {
        blockData: blockDataReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

async function loadBlockData(): Promise<Record<string, BlockData>> {
    const rawBlockData = await DATA_API.getBlocks();
    return Object.entries(rawBlockData)
        .map<[string, BlockData]>(([k, v]) => [k, loadFromRaw(v)])
        .reduce((x, [k, v]) => ({...x, [k]: v}), {});
}

async function init(): Promise<void> {
    try {
        store.dispatch(setBlockData(await loadBlockData()));
    } catch (e) {
        if (e instanceof Error) {
            store.dispatch(failBlockData(e));
        }
    }
}

init().catch(e => console.error(e));
