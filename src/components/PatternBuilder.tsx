import React, {useCallback, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../data/redux/store";
import {BlockData, BlockState, serializeState} from "../data/BlockData";
import {StringSelector} from "./StringSelector";
import {Box, Columns} from "react-bulma-components";
import {BlockStateSelector} from "./BlockStateSelector";
import {asNonNull} from "../util/preconditions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfo} from "@fortawesome/free-solid-svg-icons";

interface PatternBuilderImplProps {
    blockData: Record<string, BlockData>;
}

const PatternBuilderImpl: React.FC<PatternBuilderImplProps> = ({blockData}) => {
    const validIds = useMemo(() => Object.keys(blockData), [blockData]);
    const [selectedId, setSelectedId] = useState<string>(asNonNull(validIds[0]));

    const currentBlockData = asNonNull(blockData[selectedId]);
    const [state, setState] = useState<BlockState['properties']>({...currentBlockData.defaultState.properties});

    const pattern = useMemo(() => serializeState(currentBlockData, state), [currentBlockData, state]);

    const safeSetSelectedId = useCallback((selected: string) => {
        setSelectedId(selected);
        setState({...asNonNull(blockData[selected]).defaultState.properties});
    }, [setSelectedId, setState, blockData]);

    return <Columns centered>
        <Columns.Column narrow className="has-background-primary-dark">
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
            <h3 className="subtitle">Pattern</h3>
            <p className="mb-3">
                <span className="icon-text">
                    <span className="icon has-text-info-light">
                        <FontAwesomeIcon icon={faInfo}/>
                    </span>
                </span>
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
    if (blockData instanceof Error) {
        return <div>Error: {blockData.message}</div>;
    }
    return <PatternBuilderImpl blockData={blockData}/>;
};

export default PatternBuilder;
