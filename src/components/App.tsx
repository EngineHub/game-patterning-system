import React from "react";
import AppNavbar from "./AppNavbar";
import {Columns, Section} from "react-bulma-components";
import PatternBuilder from "./PatternBuilder";
import {Provider} from "react-redux";
import {store} from "../data/redux/store";

const App: React.FC = () => {
    return <>
        <Provider store={store}>
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
        </Provider>
    </>;
};
export default App;
