import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Pattern} from "../Pattern";


export interface PatternSlice {
    current: Pattern | undefined;
    serialized: string | undefined;
    shareLink: string | undefined;
}

const initialState: PatternSlice = {
    current: undefined,
    serialized: undefined,
    shareLink: undefined,
};

export const pattern = createSlice({
    name: 'pattern',
    initialState,
    reducers: {
        setPattern: (state, action: PayloadAction<Pattern | undefined>) => {
            state.current = action.payload;
        },
        setShareLink: (state, action: PayloadAction<string | undefined>) => {
            state.shareLink = action.payload;
        },
        setSerializedPattern: (state, action: PayloadAction<string | undefined>) => {
            state.serialized = action.payload;
        },
    },
});

export const {setPattern, setShareLink, setSerializedPattern} = pattern.actions;

export const patternReducer = pattern.reducer;
