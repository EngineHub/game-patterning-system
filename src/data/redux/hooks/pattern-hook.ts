import {Hook} from "./hook-iface";
import {RootState, RootStore} from "../store";
import {distinctUntilChanged, filter, from, map, OperatorFunction, pipe, startWith} from "rxjs";
import {coerceString} from "../../../util/urlhash";
import {Pattern} from "../../Pattern";
import {deserializeState, preparePattern} from "../../BlockData";
import {setPattern} from "../pattern";
import {isNonNull} from "../../../util/preconditions";

function mapStateToPattern(store: RootStore): OperatorFunction<RootState, Pattern | undefined> {
    return pipe(
        map(state => coerceString(state.hash.parsed['pattern'])),
        distinctUntilChanged(),
        map(patternString => {
            if (typeof patternString === "undefined") {
                return undefined;
            }
            const pattern: Pattern = {
                type: "simple-block-pattern",
                state: deserializeState(patternString),
            };
            const blockTable = store.getState().blockData.current;
            if (blockTable?.type === "ok") {
                return preparePattern(pattern, blockTable.value);
            }
            return pattern;
        }),
    );
}

export const PatternHook: Hook = {
    hook(store: RootStore): void {
        from(store)
            .pipe(
                startWith(store.getState()),
                mapStateToPattern(store),
                filter(isNonNull),
            )
            .subscribe(v => store.dispatch(setPattern(v)));
    }
};
