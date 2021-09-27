import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ParsedQuery} from "query-string";


export interface HashSlice {
    parsed: ParsedQuery;
}

const initialState: HashSlice = {
    parsed: {},
};

export const hash = createSlice({
    name: 'hash',
    initialState,
    reducers: {
        setParsedHash: (state, action: PayloadAction<ParsedQuery>) => {
            state.parsed = action.payload;
        },
    },
});

export const {setParsedHash} = hash.actions;

export const hashReducer = hash.reducer;
