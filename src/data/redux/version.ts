import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {MinecraftVersion} from "../api/DataApi";


export interface VersionSlice {
    data: number | undefined;
    available: MinecraftVersion[];
}

const initialState: VersionSlice = {
    data: undefined,
    available: [],
};

export const version = createSlice({
    name: 'version',
    initialState,
    reducers: {
        setDataVersion(state, action: PayloadAction<number>) {
            state.data = action.payload;
        },
        addAvailableVersions(state, action: PayloadAction<MinecraftVersion[]>) {
            state.available.push(...action.payload);
        },
    },
});

export const {setDataVersion, addAvailableVersions} = version.actions;

export const versionReducer = version.reducer;
