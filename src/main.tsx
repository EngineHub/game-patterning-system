import "./css";
import * as ReactDOM from "react-dom";
import {AppMount} from "./app-mount";

const reactRoot = document.createElement("div");
reactRoot.id = "react-root";
document.body.appendChild(reactRoot);
ReactDOM.render(
    <AppMount/>,
    reactRoot,
);
