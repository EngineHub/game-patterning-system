import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../data/redux/store";
import {
    BlockData,
    BlockState,
    deserializeStateChecked,
    extractIdFromStateString,
    serializeState
} from "../data/BlockData";
import {StringSelector} from "./StringSelector";
import {Box, Columns, Icon} from "react-bulma-components";
import {BlockStateSelector} from "./BlockStateSelector";
import {asNonNull} from "../util/preconditions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfo} from "@fortawesome/free-solid-svg-icons";
import {ShareButton} from "./ShareButton";
import {useLocation} from "react-use";
import * as queryString from "query-string";

interface PatternBuilderImplProps {
    blockData: Record<string, BlockData>;
}

function useHashState(
    blockData: Record<string, BlockData>,
    setSelectedId: (value: string) => void,
    setState: (value: BlockState['properties']) => void,
): void {
    const {hash} = useLocation();
    const parsedHash = useMemo(() => queryString.parse(hash || ''), [hash]);
    const patternStringFromHash = useMemo(() => {
        const pattern = parsedHash['pattern'];
        if (pattern instanceof Array) {
            return pattern[0];
        }
        return pattern;
    }, [parsedHash]);

    useEffect(() => {
        if (!patternStringFromHash) {
            return;
        }
        const hashBlockData = blockData[extractIdFromStateString(patternStringFromHash)];
        if (typeof hashBlockData === "undefined") {
            return;
        }
        const state = deserializeStateChecked(patternStringFromHash, hashBlockData.properties);
        setSelectedId(state.id);
        setState({...hashBlockData.defaultState.properties, ...state.properties});
    }, [blockData, patternStringFromHash, setSelectedId, setState]);
}

const PatternBuilderImpl: React.FC<PatternBuilderImplProps> = ({blockData}) => {
    const validIds = useMemo(() => Object.keys(blockData), [blockData]);
    const [selectedId, setSelectedId] = useState<string>(asNonNull(validIds[0]));

    const currentBlockData = asNonNull(blockData[selectedId]);
    const [state, setState] = useState<BlockState['properties']>({...currentBlockData.defaultState.properties});

    const pattern = useMemo(() => serializeState(currentBlockData, state), [currentBlockData, state]);
    const shareLink = useMemo(
        () => new URL(`#pattern=${encodeURIComponent(pattern)}`, document.location.href).href,
        [pattern]
    );

    const safeSetSelectedId = useCallback((selected: string) => {
        setSelectedId(selected);
        setState({...asNonNull(blockData[selected]).defaultState.properties});
    }, [blockData]);

    useHashState(blockData, setSelectedId, setState);

    return <Columns centered>
        <Columns.Column size="one-third" className="has-background-primary-dark">
            <h3 className="subtitle">Pick a block</h3>
            <StringSelector selected={selectedId} setSelected={safeSetSelectedId} options={validIds}/>
            <div className="has-background-info-dark p-3">
                <BlockStateSelector
                    state={state}
                    setState={setState}
                    properties={currentBlockData.properties}/>
            </div>
        </Columns.Column>
        <Columns.Column className="has-background-success-dark">
            <div className="is-flex is-justify-content-space-between">
                <div>
                    <h3 className="subtitle">Pattern</h3>
                </div>
                <ShareButton link={shareLink}/>
            </div>
            <p className="mb-3">
                <Icon text color="info" colorVariant="light">
                    <Icon>
                        <FontAwesomeIcon icon={faInfo}/>
                    </Icon>
                </Icon>
                <small>
                    We&apos;re showing <code>minecraft:</code> here for clarity, but you don&apos;t need
                    it
                </small>
            </p>
            <Box>
                <span className="is-family-code">{Array.from(pattern).map((x, i) => {
                    if (x === ',' || x === '[' || x === ':') {
                        // safe to use index here, these are all interchangeable
                        return <React.Fragment key={`${i}-${x}`}>
                            {x}
                            <wbr/>
                        </React.Fragment>;
                    }
                    return x;
                })}</span>
            </Box>
        </Columns.Column>
    </Columns>;
};

const PatternBuilder: React.FC = () => {
    const blockData = useSelector((state: RootState) => state.blockData.data);
    if (typeof blockData === "undefined") {
        return <div>Loading...</div>;
    }
    if (typeof blockData === "string") {
        return <div>Error: {blockData}</div>;
    }
    return <PatternBuilderImpl blockData={blockData}/>;
};

export default PatternBuilder;
