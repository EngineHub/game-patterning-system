import React from "react";
import {Form} from "react-bulma-components";
import {BlockProperty, BlockPropertyType, BlockPropertyTypeInJs, BlockState, parseFromString} from "../data/BlockData";
import {asNonNull, requireNonNull} from "../util/preconditions";

export interface BlockStateSelectorProps {
    state: BlockState['properties'];
    setState: (modifier: (existing: BlockState['properties']) => BlockState['properties']) => void;
    properties: Record<string, BlockProperty>;
}

export const BlockStateSelector: React.FC<BlockStateSelectorProps> = ({state, setState, properties}) => {
    return <div className="is-flex is-flex-direction-column">
        {Object.entries(properties).sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => {
            return <BlockPropertySelector
                key={k}
                value={asNonNull(state[k], `Missing '${k}' in state`)}
                setValue={(v): void => setState(existing => ({...existing, [k]: v}))}
                propertyKey={k}
                property={v}
            />;
        })}
    </div>;
};

interface BlockPropertySelectorProps {
    value: BlockPropertyTypeInJs[BlockPropertyType];
    setValue: (selected: BlockPropertyTypeInJs[BlockPropertyType]) => void;
    propertyKey: string;
    property: BlockProperty;
}

const BlockPropertySelector: React.FC<BlockPropertySelectorProps> = ({value, setValue, propertyKey, property}) => {
    return <div className="block is-flex is-align-items-center is-justify-content-space-between">
        <Form.Label className="my-0">Select value for <code>{propertyKey}</code></Form.Label>
        <div>
        <Form.Select value={value} onChange={
            (e): void => {
                const selected = parseFromString(property.type, e.currentTarget.value);
                requireNonNull(selected, "Should always be valid");
                return setValue(selected);
            }
        }>
            {property.values.map(v => <option key={`${v}`}>{`${v}`}</option>)}
        </Form.Select>
        </div>
    </div>;
};
