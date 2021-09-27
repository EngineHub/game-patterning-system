import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {BlockData} from "../BlockData";
import {Result} from "../../util/types";

export interface SerializableError {
    message: string;
    stack?: string | undefined;
}

export interface BlockDataSlice {
    // Used by react, the current redux.pattern is validated to work with this data
    current: Result<Record<string, BlockData>, SerializableError> | undefined;
    // Set with new data, used to re-validate redux.pattern before moving it to `current`.
    upcoming: Result<Record<string, BlockData>, SerializableError> | undefined;
}

const initialState: BlockDataSlice = {
    current: undefined,
    upcoming: undefined,
};

export const blockData = createSlice({
    name: 'blockData',
    initialState,
    reducers: {
        setCurrentBlockData: (state, action: PayloadAction<Record<string, BlockData>>) => {
            state.current = {type: "ok", value: action.payload};
        },
        failCurrentBlockData: (state, action: PayloadAction<SerializableError>) => {
            state.current = {type: "err", value: action.payload};
        },
        setUpcomingBlockData: (state, action: PayloadAction<Record<string, BlockData>>) => {
            state.upcoming = {type: "ok", value: action.payload};
        },
        failUpcomingBlockData: (state, action: PayloadAction<SerializableError>) => {
            state.upcoming = {type: "err", value: action.payload};
        },
    },
});

export const {
    setCurrentBlockData,
    failCurrentBlockData,
    setUpcomingBlockData,
    failUpcomingBlockData
} = blockData.actions;

export const blockDataReducer = blockData.reducer;
