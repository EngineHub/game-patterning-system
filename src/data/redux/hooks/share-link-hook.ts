import {Hook} from "./hook-iface";
import {RootStore} from "../store";
import {distinctUntilChanged, from, map} from "rxjs";
import {setShareLink} from "../pattern";
import {urlEncoded} from "../../../util/formatters";

export const ShareLinkHook: Hook = {
    hook(store: RootStore): void {
        from(store)
            .pipe(
                map(state => state.pattern.serialized),
                distinctUntilChanged(),
                map(serializedPattern => createShareLink(store.getState().version.data, serializedPattern)),
            )
            .subscribe({
                next(v) {
                    store.dispatch(setShareLink(v));
                },
                error(e) {
                    console.warn("Error creating share link", e);
                },
            });
    }
};

function createShareLink(
    dataVersion: number | undefined,
    serializedPattern: string | undefined,
): string | undefined {
    if (typeof dataVersion === "undefined" || typeof serializedPattern === "undefined") {
        return undefined;
    }
    return new URL(
        urlEncoded`#dataVersion=${dataVersion.toString()}&pattern=${serializedPattern}`,
        document.location.href
    ).href;
}
