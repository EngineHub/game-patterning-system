import {BlockState} from "./BlockData";

export interface SimpleBlockPattern {
    type: 'simple-block-pattern',
    state: BlockState,
}

export type Pattern = SimpleBlockPattern;
