import React from "react";
import {Form} from "react-bulma-components";

export interface StringSelectorProps {
    selected: string | undefined;
    setSelected: (selected: string) => void;
    options: string[];
}

export const StringSelector: React.FC<StringSelectorProps> = ({selected, setSelected, options}) => {
    return <Form.Select value={selected} onChange={(e): void => setSelected(e.currentTarget.value)}>
        {options.map(v => <option key={v}>{v}</option>)}
    </Form.Select>;
};
