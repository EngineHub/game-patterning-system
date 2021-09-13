import React from "react";
import AppNavbar from "./AppNavbar";
import {Columns, Section} from "react-bulma-components";
import PatternBuilder from "./PatternBuilder";
import {Provider} from "react-redux";
import {store} from "../data/redux/store";
import {IdProvider} from "react-use-id-hook";
import {SimpleErrorBoundary} from "./SimpleErrorBoundary";

const App: React.FC = () => {
    return <SimpleErrorBoundary>
        <Provider store={store}>
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
                            <h2 className="title">Simple Block Pattern</h2>
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
