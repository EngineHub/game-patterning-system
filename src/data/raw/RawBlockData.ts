export interface RawBlockData {
    defaultstate: string;
    properties: Record<string, RawBlockProperty>;
}

export interface RawBlockProperty {
    type: "enum" | "int" | "bool" | "direction";
    values: string[];
}
