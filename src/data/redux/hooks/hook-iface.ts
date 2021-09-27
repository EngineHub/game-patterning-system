import {RootStore} from "../store";

export interface Hook {
    hook(store: RootStore): void;
}
