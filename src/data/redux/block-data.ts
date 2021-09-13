import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {BlockData} from "../BlockData";

export interface BlockDataSlice {
    data: Record<string, BlockData> | string | undefined;
}

const initialState: BlockDataSlice = {
    data: undefined,
};

export const blockData = createSlice({
    name: 'blockData',
    initialState,
    reducers: {
        setBlockData: (state, action: PayloadAction<Record<string, BlockData>>) => {
            state.data = action.payload;
        },
        failBlockData: (state, action: PayloadAction<string>) => {
            state.data = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const {setBlockData, failBlockData} = blockData.actions;

export const blockDataReducer = blockData.reducer;
