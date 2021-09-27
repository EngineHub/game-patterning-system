import * as queryString from "query-string";
import {isNonNull} from "./preconditions";
import {ParsedQuery} from "query-string";

export function coerceString(value: string[] | string | null | undefined): string | undefined {
    if (!isNonNull(value)) {
        return undefined;
    }
    if (value instanceof Array) {
        return value[0];
    }
    return value;
}

export function removeFromHash(hash: ParsedQuery, key: string): string {
    const copy = {...hash};
    delete copy[key];
    return queryString.stringify(copy) || '';
}
