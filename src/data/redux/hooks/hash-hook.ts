import {Hook} from "./hook-iface";
import {RootStore} from "../store";
import {fromEvent, map, startWith} from "rxjs";
import {setParsedHash} from "../hash";
import {parse} from "query-string";

export const HashHook: Hook = {
    hook(store: RootStore) {
        fromEvent(window, 'hashchange')
            .pipe(
                startWith('initial'),
                map(() => ({...parse(window.location.hash)}))
            )
            .subscribe(v => store.dispatch(setParsedHash(v)));
    }
};
