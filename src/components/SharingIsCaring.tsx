import React, {MouseEvent, useState} from "react";
import {Button, Form, Icon} from "react-bulma-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClipboard} from "@fortawesome/free-solid-svg-icons";

export interface ShareButtonProps {
    link: string;
}

export const SharingIsCaring: React.FC<ShareButtonProps> = ({link}) => {
    const [copyText, setCopyText] = useState("Copy");
    const [copyTimeout, setCopyTimeout] = useState<number | undefined>();

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
            <Button title="Copy a link to this pattern" onClick={(e: MouseEvent<HTMLButtonElement>): void => {
                e.preventDefault();
                shoveInClipboard(link, setCopyText, copyTimeout, setCopyTimeout);
            }}>
                <Icon text><FontAwesomeIcon icon={faClipboard}/></Icon>
                &nbsp;{copyText}
            </Button>
        </Form.Control>
    </Form.Field>;
};

function shoveInClipboard(
    link: string,
    setCopyText: (value: string) => void,
    copyTimeout: number | undefined,
    setCopyTimeout: (value: number | undefined) => void,
): void {
    navigator.clipboard.writeText(link)
        .then(() => {
            setCopyText("Copied!");
            if (typeof copyTimeout !== "undefined") {
                clearTimeout(copyTimeout);
            }
            setCopyTimeout(
                window.setTimeout(() => setCopyText("Copy"), 1000)
            );
        })
        .catch(err => console.error("Failed to copy to clipboard", err));
}
