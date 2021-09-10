import React from "react";
import AppNavbar from "./AppNavbar";
import {Container, Section} from "react-bulma-components";
import PatternBuilder from "./PatternBuilder";
import {Provider} from "react-redux";
import {store} from "../data/redux/store";

const App: React.FC = () => {
    return <>
        <Provider store={store}>
            <AppNavbar/>
            <Section>
                <Container>
                    <PatternBuilder/>
                </Container>
            </Section>
        </Provider>
    </>;
};
export default App;
