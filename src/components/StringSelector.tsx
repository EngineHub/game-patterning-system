import React, {useMemo, useState} from "react";
import Select, {StylesConfig, Theme} from "react-select";

export interface StringSelectorProps {
    selected: string | undefined;
    setSelected: (selected: string) => void;
    options: string[];
}

interface OptionObject {
    label: string;
    value: string;
}

const SELECT_STYLES: StylesConfig<OptionObject, false> = {
    container(styles) {
        return {
            ...styles,
            zIndex: 5,
        };
    },
    menuPortal(styles) {
        return {
            ...styles,
            width: "min(50%, 40ch)",
            zIndex: 9999,
        };
    },
};

const SELECT_THEME: (theme: Theme) => Theme = (theme) => {
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
    const fixedOptionValues = useMemo(() => Array.from(fixedOptions.values()), [fixedOptions]);
    const selectedOptionObject = useMemo(
        () => typeof selected === "string" ? fixedOptions.get(selected) : undefined,
        [selected, fixedOptions]
    );
    const [showing, setShowing] = useState(true);

    return <Select
        aria-label="Pick a block"
        options={fixedOptionValues}
        value={selectedOptionObject}
        isMulti={false}
        onChange={(v) => void (v && setSelected(v.value))}
        isSearchable
        styles={SELECT_STYLES}
        theme={SELECT_THEME}
        menuPortalTarget={document.body}
        menuPosition="absolute"
        menuShouldScrollIntoView={false}
        controlShouldRenderValue={showing}
        onMenuOpen={(): void => setShowing(false)}
        onMenuClose={(): void => setShowing(true)}
    />;
};
