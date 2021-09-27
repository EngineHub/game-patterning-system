import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {Icon} from "react-bulma-components";

export interface LoadingStuffProps {
    text: string;
}

export const LoadingStuff: React.FC<LoadingStuffProps> = (props) => {
    return <div className="is-flex is-align-items-center">
        <Icon><FontAwesomeIcon icon={faSpinner} spin/></Icon>
        {props.text}
    </div>;
};
