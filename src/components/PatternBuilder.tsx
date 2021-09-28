import React, {useCallback, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState, RootStore} from "../data/redux/store";
import {BlockData, BlockState} from "../data/BlockData";
import {StringSelector} from "./StringSelector";
import {Box, Columns, Form, Icon} from "react-bulma-components";
import {BlockStateSelector} from "./BlockStateSelector";
import {asNonNull, requireNonNull} from "../util/preconditions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfo} from "@fortawesome/free-solid-svg-icons";
import {LoadingStuff} from "./LoadingStuff";
import {SimpleBlockPattern} from "../data/Pattern";
import {setPattern} from "../data/redux/pattern";
import {CopyPastaButton} from "./CopyPastaButton";

interface PatternBuilderImplProps {
    blockData: Record<string, BlockData>;
    pattern: SimpleBlockPattern;
}

const CopyCurrentPattern: React.FC<{className: string}> = ({className}) => {
    const serializedPattern = useSelector((state: RootState) => state.pattern.serialized);
    if (typeof serializedPattern === "undefined") {
        return <></>;
    }
    return <CopyPastaButton className={className}
                            textToCopy={serializedPattern}
                            idleButtonText="Copy pattern"
                            detailText="Copy this pattern"/>;
};

const PatternBuilderImpl: React.FC<PatternBuilderImplProps> = ({blockData, pattern}) => {
    const validIds = useMemo(
        () => Object.keys(blockData).sort((a, b) => a.localeCompare(b)),
        [blockData]
    );

    const currentBlockData: BlockData = asNonNull(blockData[pattern.state.id]);

    const dispatch: RootStore['dispatch'] = useDispatch();
    const setStateId = useCallback(
        (id: string) => dispatch(setPattern({
            type: pattern.type,
            state: {...asNonNull(blockData[id]).defaultState},
        })),
        [blockData, pattern, dispatch],
    );

    const state = useMemo(
        () => ({...currentBlockData.defaultState.properties, ...pattern.state.properties}),
        [currentBlockData, pattern],
    );
    const setState = useCallback(
        (properties: BlockState['properties']) => dispatch(setPattern({
            type: pattern.type,
            state: {
                id: pattern.state.id,
                properties: {...properties},
            },
        })),
        [pattern, dispatch],
    );

    const patternString = useSelector((state: RootState) => state.pattern.serialized) || '';

    return <Columns centered>
        <Columns.Column size="one-third" className="has-background-primary-dark">
            <h3 className="subtitle">Pick a block</h3>
            <StringSelector selected={pattern.state.id} setSelected={setStateId} options={validIds}/>
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
            <Form.Field kind="addons">
                <Form.Control className="is-flex-grow-1">
                    <Box className="no-border-right">
                        <span className="is-family-code">{Array.from(patternString).map((x, i) => {
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
                </Form.Control>
                <Form.Control className="is-flex is-flex-direction-column">
                    <CopyCurrentPattern className="is-flex-grow-1"/>
                </Form.Control>
            </Form.Field>
        </Columns.Column>
    </Columns>;
};

const PatternBuilder: React.FC = () => {
    const blockData = useSelector((state: RootState) => state.blockData.current);
    const pattern = useSelector((state: RootState) => state.pattern.current);
    if (typeof blockData === "undefined") {
        return <LoadingStuff text={"Loading block data..."}/>;
    }
    if (blockData.type === "err") {
        return <div>
            <p>
                Error loading block data:
                <code className="bg-dark text-white p-1 m-1">
                    {blockData.value.message}
                </code>
            </p>
            <details>
                <summary>Stack</summary>
                <pre className="bg-dark p-1">
                    {blockData.value.stack}
                </pre>
            </details>
        </div>;
    }
    requireNonNull(pattern, "Pattern should never be undefined if block data is present.");
    return <PatternBuilderImpl blockData={blockData.value} pattern={pattern}/>;
};

export default PatternBuilder;
