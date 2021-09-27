import {requireNonNull} from "../util/preconditions";
import {Pattern} from "./Pattern";

export interface BlockState {
    id: string;
    properties: Record<string, BlockPropertyTypeInJs[BlockPropertyType]>;
}

export interface BlockData {
    defaultState: BlockState;
    properties: Record<string, BlockProperty>;
}

type Direction = "north" | "east" | "west" | "south" | "up" | "down";

export type BlockPropertyTypeInJs = {
    int: string,
    enum: string,
    direction: Direction,
    boolean: "true" | "false",
};

export type BlockPropertyType = keyof BlockPropertyTypeInJs;

const parserImplementations: {
    [k in BlockPropertyType]: (value: string) => BlockPropertyTypeInJs[k] | undefined
} = {
    int(value: string): string | undefined {
        const n = parseInt(value);
        return isNaN(n) ? undefined : n.toString();
    },
    enum(value: string): string {
        return value;
    },
    direction(value: string): Direction | undefined {
        switch (value) {
            case "north":
            case "east":
            case "west":
            case "south":
            case "up":
            case "down":
                return value;
            default:
                return undefined;
        }
    },
    boolean(value: string): "true" | "false" | undefined {
        return value === "true" ? "true" : (value === "false" ? "false" : undefined);
    },
};

export function parseFromString<T extends BlockPropertyType>(type: T, value: string): BlockPropertyTypeInJs[T] | undefined {
    return parserImplementations[type](value) as BlockPropertyTypeInJs[T];
}

type BaseBlockProperty<T extends BlockPropertyType> = {
    type: T;
    values: BlockPropertyTypeInJs[T][];
}

export type IntBlockProperty = BaseBlockProperty<"int">;
export type EnumBlockProperty = BaseBlockProperty<"enum">;
export type DirectionBlockProperty = BaseBlockProperty<"direction">;
export type BooleanBlockProperty = BaseBlockProperty<"boolean">;

export type BlockProperty = IntBlockProperty | EnumBlockProperty | DirectionBlockProperty | BooleanBlockProperty;

export function checkState(blockState: BlockState, properties: Record<string, BlockProperty>): void {
    for (const [key, rawValue] of Object.entries(blockState.properties)) {
        const property = properties[key];
        requireNonNull(property, `Assigning to a non-existent property ${key}`);
        const value = parseFromString(property.type, rawValue);
        if (typeof value === "undefined" || (property.values as unknown[]).indexOf(value) < 0) {
            throw new Error(`Value ${rawValue} is not allowed by the property ${key}`);
        }
    }
}

export function deserializeState(stateString: string): BlockState {
    const leftBracketIdx = stateString.indexOf('[');
    if (leftBracketIdx < 0) {
        return {id: stateString, properties: {}};
    }
    if (stateString.indexOf(']') !== stateString.length - 1) {
        throw new Error(`End bracket does not exist or is not at end of state: ${stateString}`);
    }
    const propertyAssigns = stateString.substring(leftBracketIdx + 1, stateString.length - 1).split(",");
    const newProperties: BlockState['properties'] = {};
    for (const assignment of propertyAssigns) {
        const [key, rawValue] = assignment.split('=', 2);
        requireNonNull(key);
        requireNonNull(rawValue, `Missing property assignment for ${key}: ${stateString}`);
        newProperties[key] = rawValue;
    }
    return {id: stateString.substring(0, leftBracketIdx), properties: newProperties};
}

export function serializeState(defaultState: BlockState, state: BlockState): string {
    let result = state.id;
    const nonDefaultAssignments = Object.entries(state.properties)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .filter(([k, v]) => v !== defaultState.properties[k]);
    if (nonDefaultAssignments.length > 0) {
        const assignmentsString = nonDefaultAssignments
            .map(([k, v]) => `${k}=${v}`)
            .join(",");
        result += "[" + assignmentsString + "]";
    }
    return result;
}

/**
 * Filter the current pattern to work with the upcoming data table.
 *
 * @param pattern the pattern to filter
 * @param upcomingDataTable the new data table to validate against
 */
export function preparePattern(
    pattern: Pattern | undefined,
    upcomingDataTable: Record<string, BlockData>
): Pattern {
    if (typeof pattern === "undefined") {
        // Nothing to filter. Set default pattern.
        return {
            type: "simple-block-pattern",
            state: getDefaultState(upcomingDataTable),
        };
    }
    const upcomingBlockData = upcomingDataTable[pattern.state.id];
    if (typeof upcomingBlockData === "undefined") {
        // The ID is missing, reset entire pattern.
        return {
            type: "simple-block-pattern",
            state: getDefaultState(upcomingDataTable),
        };
    }
    let modified = false;
    const newProperties: Record<string, BlockPropertyTypeInJs[BlockPropertyType]> = {};
    for (const [k, v] of Object.entries(pattern.state.properties)) {
        const upcomingProperty = upcomingBlockData.properties[k];
        if (typeof upcomingProperty === "undefined") {
            // Property doesn't exist, drop it.
            modified = true;
            continue;
        }
        if (!(upcomingProperty.values as string[]).includes(v)) {
            // Value isn't allowed, drop it.
            modified = true;
            continue;
        }
        newProperties[k] = v;
    }
    if (!modified) {
        return pattern;
    } else {
        return {
            type: "simple-block-pattern",
            state: {
                id: pattern.state.id,
                properties: newProperties,
            },
        };
    }
}

function getDefaultState(dataTable: Record<string, BlockData>): BlockState {
    const firstEntry = Object.entries(dataTable)
        .sort((a, b) => a[0].localeCompare(b[0]))[0];
    requireNonNull(firstEntry, "No first entry in data table");
    return firstEntry[1].defaultState;
}
