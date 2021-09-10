import React, {useCallback, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../data/redux/store";
import {BlockData, BlockState, serializeState} from "../data/BlockData";
import {StringSelector} from "./StringSelector";
import {Columns, Form} from "react-bulma-components";
import {BlockStateSelector} from "./BlockStateSelector";
import {asNonNull} from "../util/preconditions";

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
            <h2>Pick a block</h2>
            <StringSelector selected={selectedId} setSelected={safeSetSelectedId} options={validIds}/>
            <div className="has-background-info-dark p-3">
                <BlockStateSelector
                    state={state}
                    setState={setState}
                    properties={currentBlockData.properties}/>
            </div>
        </Columns.Column>
        <Columns.Column size="one-third" className="has-background-success-dark">
            <h2>Pattern</h2>
            <code>{Array.from(pattern).map((x, i) => {
                if (x === ',' || x === '[') {
                    // safe to use index here, these are all interchangeable
                    return <React.Fragment key={`${i}-${x}`}>{x}<wbr/></React.Fragment>;
                }
                return x;
            })}</code>
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
