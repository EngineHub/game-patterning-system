import {RawBlockData, RawBlockProperty} from "./raw/RawBlockData";
import {requireNonNull} from "../util/preconditions";

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
    int: number,
    enum: string,
    direction: Direction,
    boolean: boolean,
};

export type BlockPropertyType = keyof BlockPropertyTypeInJs;

const parserImplementations: {
    [k in BlockPropertyType]: (value: string) => BlockPropertyTypeInJs[k] | undefined
} = {
    int(value: string): number | undefined {
        const n = parseInt(value);
        return isNaN(n) ? undefined : n;
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
    boolean(value: string): boolean | undefined {
        return value === "true" ? true : (value === "false" ? false : undefined);
    },
};

export function parseFromString<T extends BlockPropertyType>(type: T, value: string): BlockPropertyTypeInJs[T] | undefined {
    return parserImplementations[type](value) as BlockPropertyTypeInJs[T];
}

function fromStringIter<T extends BlockPropertyType>(type: T, values: Iterable<string>): BlockPropertyTypeInJs[T][] {
    return Array.from(new Set(Array.from(values).map(v => {
        const parsed = parseFromString(type, v);
        requireNonNull(parsed, `Value ${v} is invalid for this property`);
        return parsed;
    })));
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


export function loadFromRaw(blockManifest: RawBlockData): BlockData {
    const properties = loadRawProperties(blockManifest.properties);
    const defaultState = deserializeStateChecked(blockManifest.defaultstate, properties);
    return {
        defaultState,
        properties,
    };
}

function convertToNonRaw<T extends BlockPropertyType>(type: T, rawValues: string[]): BaseBlockProperty<T> {
    return {
        type,
        values: fromStringIter(type, rawValues),
    };
}

function loadRawProperties(properties: Record<string, RawBlockProperty>): Record<string, BlockProperty> {
    const newRecord = {} as Record<string, BlockProperty>;
    for (const key of Object.keys(properties)) {
        const property = properties[key];
        requireNonNull(property);
        let fixedType: BlockPropertyType;
        switch (property.type) {
            case "int":
            case "enum":
            case "direction":
                fixedType = property.type;
                break;
            case "bool":
                fixedType = "boolean";
                break;
            default:
                throw new Error(`[${key}] Unknown type: ${property.type}`);
        }
        newRecord[key] = convertToNonRaw(fixedType, property.values) as BlockProperty;
    }
    return newRecord;
}

export function extractIdFromStateString(stateString: string) : string {
    const leftBracketIdx = stateString.indexOf('[');
    if (leftBracketIdx < 0) {
        return stateString;
    }
    return stateString.substring(0, leftBracketIdx);
}

export function deserializeStateChecked(stateString: string, properties: Record<string, BlockProperty>): BlockState {
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
        const property = properties[key];
        requireNonNull(property, `Assigning to a non-existent property ${key}: ${stateString}`);
        const value = parseFromString(property.type, rawValue);
        if (typeof value === "undefined" || (property.values as unknown[]).indexOf(value) < 0) {
            throw new Error(`Value ${rawValue} is not allowed by the property ${key}: ${stateString}`);
        }
        newProperties[key] = value;
    }
    return {id: stateString.substring(0, leftBracketIdx), properties: newProperties};
}

export function serializeState(blockData: BlockData, state: BlockState['properties']): string {
    let result = blockData.defaultState.id;
    const nonDefaultAssignments = Object.entries(state)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .filter(([k, v]) => v !== blockData.defaultState.properties[k]);
    if (nonDefaultAssignments.length > 0) {
        const assignmentsString = nonDefaultAssignments
            .map(([k, v]) => `${k}=${v}`)
            .join(",");
        result += "[" + assignmentsString + "]";
    }
    return result;
}
