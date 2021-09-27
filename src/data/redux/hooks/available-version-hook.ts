import {Hook} from "./hook-iface";
import {RootStore} from "../store";
import {DATA_API} from "../../api/CassetteDeck";
import {addAvailableVersions} from "../version";

export const AvailableVersionHook: Hook = {
    hook(store: RootStore) {
        setAvailableVersions(store)
            .catch(err => console.warn("Failed to load available versions", err));
    }
};

async function setAvailableVersions(store: RootStore): Promise<void> {
    let batch = [];
    for await (const version of DATA_API.getMinecraftVersions()) {
        if (!version.hasDataGenInfo) {
            continue;
        }
        batch.push(version);
        if (batch.length >= 10) {
            store.dispatch(addAvailableVersions(batch));
            batch = [];
        }
    }
    if (batch) {
        store.dispatch(addAvailableVersions(batch));
    }
}
