import React from "react";
import {Columns, Form} from "react-bulma-components";
import {BlockProperty, BlockPropertyType, BlockPropertyTypeInJs, BlockState, parseFromString} from "../data/BlockData";
import {asNonNull, requireNonNull} from "../util/preconditions";

export interface BlockStateSelectorProps {
    state: BlockState['properties'];
    setState: (properties: BlockState['properties']) => void;
    properties: Record<string, BlockProperty>;
}

export const BlockStateSelector: React.FC<BlockStateSelectorProps> = ({state, setState, properties}) => {
    return <div className="is-flex is-flex-direction-column">
        {Object.entries(properties).sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => {
            return <BlockPropertySelector
                key={k}
                value={asNonNull(state[k], `Missing '${k}' in state`)}
                setValue={(v): void => setState({...state, [k]: v})}
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
    return <Columns centered className="block">
        <Columns.Column>
            <Form.Label className="my-0">Select value for <code>{propertyKey}</code></Form.Label>
        </Columns.Column>
        <div>
            <Columns.Column>
                <Form.Select size="small" value={value} onChange={
                    (e): void => {
                        const selected = parseFromString(property.type, e.currentTarget.value);
                        requireNonNull(selected, "Should always be valid");
                        return setValue(selected);
                    }
                }>
                    {property.values.map(v => <option key={`${v}`}>{`${v}`}</option>)}
                </Form.Select>
            </Columns.Column>
        </div>
    </Columns>;
};
