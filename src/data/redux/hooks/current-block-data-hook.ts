import {Hook} from "./hook-iface";
import {RootStore} from "../store";
import {distinctUntilChanged, filter, from, map} from "rxjs";
import {failCurrentBlockData, setCurrentBlockData} from "../block-data";
import {isNonNull} from "../../../util/preconditions";
import {preparePattern} from "../../BlockData";
import {setPattern} from "../pattern";

export const CurrentBlockDataHook: Hook = {
    hook(store: RootStore): void {
        from(store)
            .pipe(
                map(state => state.blockData.upcoming),
                filter(isNonNull),
                distinctUntilChanged(),
            )
            .subscribe({
                next(v) {
                    if (v.type === "err") {
                        store.dispatch(failCurrentBlockData(v.value));
                        return;
                    }
                    store.dispatch(setPattern(preparePattern(store.getState().pattern.current, v.value)));
                    store.dispatch(setCurrentBlockData(v.value));
                },
                error(e: unknown) {
                    if (e instanceof Error) {
                        store.dispatch(failCurrentBlockData({
                            message: e.message,
                            stack: e.stack,
                        }));
                    }
                },
            });
    }
};
