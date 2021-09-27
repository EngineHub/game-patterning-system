import React from "react";
import AppNavbar from "./AppNavbar";
import {Columns, Section} from "react-bulma-components";
import PatternBuilder from "./PatternBuilder";
import {Provider, useSelector} from "react-redux";
import {RootState, STORE} from "../data/redux/store";
import {IdProvider} from "react-use-id-hook";
import {SimpleErrorBoundary} from "./SimpleErrorBoundary";
import {SharingIsCaring} from "./SharingIsCaring";

const ShareCurrentPattern: React.FC = () => {
    const link = useSelector((state: RootState) => state.pattern.shareLink);
    if (typeof link === "undefined") {
        return <></>;
    }
    return <SharingIsCaring link={link}/>;
};

const App: React.FC = () => {
    return <SimpleErrorBoundary>
        <Provider store={STORE}>
            <IdProvider>
                <AppNavbar/>
                <Section>
                    <Columns>
                        <Columns.Column size="one-fifth">
                            <p>
                                This is the Game Patterning System, a website designed by{' '}
                                <a href="https://enginehub.org/">EngineHub</a> to assist with
                                discovering, creating, and sharing{' '}
                                <a href="https://worldedit.enginehub.org/en/latest/usage/general/patterns/">
                                    patterns
                                </a>
                                {' '}for <a href="https://enginehub.org/worldedit/">WorldEdit</a>.
                            </p>
                        </Columns.Column>
                        <Columns.Column>
                            <Columns>
                                <Columns.Column>
                                    <h2 className="title">Simple Block Pattern</h2>
                                </Columns.Column>
                                <Columns.Column className="is-flex is-justify-content-end">
                                    <ShareCurrentPattern/>
                                </Columns.Column>
                            </Columns>
                            <PatternBuilder/>
                        </Columns.Column>
                        <Columns.Column size="one-fifth"/>
                    </Columns>
                </Section>
            </IdProvider>
        </Provider>
    </SimpleErrorBoundary>;
};
export default App;
