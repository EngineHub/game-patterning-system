import React, {useMemo} from "react";
import Select, {Theme} from "react-select";
import {ReactComponentProps} from "../util/types";

export interface StringSelectorProps {
    selected: string | undefined;
    setSelected: (selected: string) => void;
    options: string[];
}

// noinspection JSUnusedGlobalSymbols
const SELECT_STYLES: ReactComponentProps<Select>['styles'] = {
    container(styles) {
        return {
            ...styles,
            zIndex: 5,
        };
    },
};

const SELECT_THEME: (theme: Theme) => Theme = (theme) => {
    console.log(theme.colors);
    return {
        ...theme,
        colors: {
            ...theme.colors,
            neutral0: 'var(--scheme-main)',
            neutral80: 'var(--text)',
            primary25: 'var(--info-light)',
        },
    };
};

export const StringSelector: React.FC<StringSelectorProps> = ({selected, setSelected, options}) => {
    const fixedOptions = useMemo(
        () => new Map(options.map(o => [o, {label: o, value: o}])),
        [options]
    );
    const selectedOptionObject = useMemo(
        () => typeof selected === "string" ? fixedOptions.get(selected) : undefined,
        [selected, fixedOptions]
    );
    return <Select
        options={Array.from(fixedOptions.values())}
        value={selectedOptionObject}
        onChange={(v) => void (v && setSelected(v.value))}
        isSearchable
        styles={SELECT_STYLES}
        theme={SELECT_THEME}
    />;
};
