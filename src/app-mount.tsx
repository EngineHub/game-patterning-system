import React, {Suspense} from "react";
import * as ReactDOM from "react-dom";
import {attachHooks} from "./data/redux/store-hooks";
import {STORE} from "./data/redux/store";
import {LoadingStuff} from "./components/LoadingStuff";

const App = React.lazy(() => import(/* webpackPrefetch: true */ "./components/App"));

const AppMount: React.FC = () => {
    return <Suspense fallback={<LoadingStuff text={"Loading..."}/>}>
        <App/>
    </Suspense>;
};

export function mountApp(): void {
    const reactRoot = document.createElement("div");
    reactRoot.id = "react-root";
    document.body.appendChild(reactRoot);
    ReactDOM.render(
        <AppMount/>,
        reactRoot,
    );

    attachHooks(STORE);
}
