import {Hook} from "./hook-iface";
import {RootStore} from "../store";
import {concatMap, distinctUntilChanged, filter, from, map} from "rxjs";
import {removeFromHash} from "../../../util/urlhash";
import {DATA_API} from "../../api/CassetteDeck";
import {failUpcomingBlockData, setUpcomingBlockData} from "../block-data";
import {BlockData} from "../../BlockData";
import {isAxiosError} from "../../../util/typecasts";
import {isNonNull} from "../../../util/preconditions";
import {ParsedQuery} from "query-string";

export const UpcomingBlockDataHook: Hook = {
    hook(store: RootStore): void {
        from(store)
            .pipe(
                map(state => state.version.data),
                filter(isNonNull),
                distinctUntilChanged(),
                concatMap(data => initializeBlockData(data, store.getState().hash.parsed)),
                filter(isNonNull),
                distinctUntilChanged(),
            )
            .subscribe({
                next(v) {
                    store.dispatch(setUpcomingBlockData(v));
                },
                error(e: unknown) {
                    if (e instanceof Error) {
                        store.dispatch(failUpcomingBlockData({
                            message: e.message,
                            stack: e.stack,
                        }));
                    }
                },
            });
    }
};

async function initializeBlockData(dataVersion: number, hash: ParsedQuery): Promise<Record<string, BlockData> | undefined> {
    try {
        return await DATA_API.getBlocks(dataVersion);
    } catch (e) {
        if (e instanceof Error) {
            if (isAxiosError(e) && e.response?.status === 404) {
                // Clear the data version, we'll be retried automatically
                console.log(
                    "[initializeBlockData] 404 when retrieving block data, returning to default data version"
                );
                window.location.hash = removeFromHash(hash, 'dataVersion');
                return;
            }
        }
        return;
    }
}
