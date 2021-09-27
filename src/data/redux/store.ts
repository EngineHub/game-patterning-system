import {configureStore} from "@reduxjs/toolkit";
import {blockDataReducer} from "./block-data";
import {versionReducer} from "./version";
import {hashReducer} from "./hash";
import {patternReducer} from "./pattern";

export const STORE = configureStore({
    reducer: {
        blockData: blockDataReducer,
        version: versionReducer,
        hash: hashReducer,
        pattern: patternReducer,
    },
});

export type RootStore = typeof STORE;
export type RootState = ReturnType<RootStore['getState']>;
