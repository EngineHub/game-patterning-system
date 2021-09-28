import React from "react";
import {Form} from "react-bulma-components";
import {CopyPastaButton} from "./CopyPastaButton";

export interface ShareButtonProps {
    link: string;
}

export const SharingIsCaring: React.FC<ShareButtonProps> = ({link}) => {
    return <Form.Field kind="addons">
        <Form.Control style={{width: "20vw"}}>
            <Form.Input
                aria-label="Share"
                readOnly
                value={link}
                style={{textOverflow: "ellipsis"}}
                onFocus={(e): void => e.currentTarget.select()}
            />
        </Form.Control>
        <Form.Control>
            <CopyPastaButton textToCopy={link} idleButtonText="Copy" detailText="Copy a link to this pattern"/>
        </Form.Control>
    </Form.Field>;
};
