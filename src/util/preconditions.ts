export function isNonNull<T>(val: T): val is NonNullable<T> {
    return val !== undefined && val !== null;
}

export function requireNonNull<T>(val: T, message?: string): asserts val is NonNullable<T> {
    if (!isNonNull(val)) {
        throw new Error(
            message || `Expected 'val' to be defined, but received ${val}`
        );
    }
}

export function asNonNull<T>(val: T, message?: string): NonNullable<T> {
    requireNonNull(val, message);
    return val;
}
