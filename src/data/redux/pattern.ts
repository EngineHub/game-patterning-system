import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Pattern} from "../Pattern";


export interface PatternSlice {
    current: Pattern | undefined;
}

const initialState: PatternSlice = {
    current: undefined,
};

export const pattern = createSlice({
    name: 'pattern',
    initialState,
    reducers: {
        setPattern: (state, action: PayloadAction<Pattern | undefined>) => {
            state.current = action.payload;
        },
    },
});

export const {setPattern} = pattern.actions;

export const patternReducer = pattern.reducer;
