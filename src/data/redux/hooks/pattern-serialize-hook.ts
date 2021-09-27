import {Hook} from "./hook-iface";
import {RootStore} from "../store";
import {distinctUntilChanged, from, map} from "rxjs";
import {Pattern} from "../../Pattern";
import {setSerializedPattern} from "../pattern";
import {BlockDataSlice} from "../block-data";
import {serializeState} from "../../BlockData";

export const PatternSerializeHook: Hook = {
    hook(store: RootStore): void {
        from(store)
            .pipe(
                map(state => state.pattern.current),
                map(pattern => serializePattern(store.getState().blockData.current, pattern)),
                distinctUntilChanged(),
            )
            .subscribe({
                next(v) {
                    store.dispatch(setSerializedPattern(v));
                },
                error(e) {
                    console.warn("Error serializing pattern", e);
                },
            });
    }
};

function serializePattern(
    blockDataSlice: BlockDataSlice['current'],
    pattern: Pattern | undefined,
): string | undefined {
    if (blockDataSlice?.type !== "ok" || typeof pattern === "undefined") {
        return undefined;
    }
    const defaultState = blockDataSlice.value[pattern.state.id]?.defaultState;
    if (typeof defaultState === "undefined") {
        return undefined;
    }
    return serializeState(defaultState, pattern.state);
}
