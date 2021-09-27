import {Hook} from "./hook-iface";
import {RootState, RootStore} from "../store";
import {concatMap, distinctUntilChanged, from, map, of, OperatorFunction, pipe, startWith} from "rxjs";
import {coerceString} from "../../../util/urlhash";
import {setDataVersion} from "../version";
import {DATA_API} from "../../api/CassetteDeck";
import {asNonNull} from "../../../util/preconditions";

function mapStateToDataVersion(): OperatorFunction<RootState, number | undefined> {
    return pipe(
        map(v => coerceString(v.hash.parsed['dataVersion'])),
        map(x => typeof x === "undefined" ? undefined : parseInt(x, 10)),
        map(x => typeof x === "undefined" || !isFinite(x) ? undefined : x),
    );
}

async function computeDefaultDataVersion(): Promise<number> {
    const releaseDataVersion = (await DATA_API.getLatestMinecraftVersion("release"))?.dataVersion;
    return asNonNull(releaseDataVersion, "No release version");
}

export const DataVersionHook: Hook = {
    hook(store: RootStore): void {
        from(store)
            .pipe(
                startWith(store.getState()),
                mapStateToDataVersion(),
                distinctUntilChanged(),
                // Coerce to default if needed
                concatMap(v => typeof v === "undefined" ? computeDefaultDataVersion() : of(v)),
                distinctUntilChanged(),
            )
            .subscribe(v => store.dispatch(setDataVersion(v)));
    }
};
