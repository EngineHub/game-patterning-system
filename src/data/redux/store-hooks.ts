import {RootStore} from "./store";
import {UpcomingBlockDataHook} from "./hooks/upcoming-block-data-hook";
import {DataVersionHook} from "./hooks/data-version-hook";
import {HashHook} from "./hooks/hash-hook";
import {CurrentBlockDataHook} from "./hooks/current-block-data-hook";
import {PatternHook} from "./hooks/pattern-hook";
import {AvailableVersionHook} from "./hooks/available-version-hook";
import {PatternSerializeHook} from "./hooks/pattern-serialize-hook";
import {ShareLinkHook} from "./hooks/share-link-hook";

export function attachHooks(store: RootStore): void {
    for (const hook of [
        UpcomingBlockDataHook, CurrentBlockDataHook, DataVersionHook, PatternHook, HashHook,
        AvailableVersionHook, PatternSerializeHook, ShareLinkHook,
    ]) {
        hook.hook(store);
    }
}
