import React from "react";
import {Dropdown, Form, Icon} from "react-bulma-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShareAlt} from "@fortawesome/free-solid-svg-icons";

export interface ShareButtonProps {
    link: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({link}) => {
    return <Dropdown
        right
        icon={<Icon><FontAwesomeIcon icon={faShareAlt}/></Icon>}
        label="Share"
    >
        <div className="m-2" style={{width: "20vw"}}>
            <Form.Input
                readOnly
                value={link}
                style={{textOverflow: "ellipsis"}}
                onFocus={e => e.currentTarget.select()}
            />
        </div>
    </Dropdown>;
};
