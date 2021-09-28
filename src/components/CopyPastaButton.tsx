import React, {MouseEvent, useState} from "react";
import {Button, Icon} from "react-bulma-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClipboard} from "@fortawesome/free-solid-svg-icons";

export interface CopyPastaButtonProps {
    textToCopy: string;
    idleButtonText: string;
    detailText: string;
    className?: string;
}

export const CopyPastaButton: React.FC<CopyPastaButtonProps> = ({
                                                                    textToCopy,
                                                                    idleButtonText,
                                                                    detailText,
                                                                    className
                                                                }) => {
    const [copyText, setCopyText] = useState(idleButtonText);
    const [copyTimeout, setCopyTimeout] = useState<number | undefined>();

    function shoveInClipboard(): void {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setCopyText("Copied!");
                if (typeof copyTimeout !== "undefined") {
                    clearTimeout(copyTimeout);
                }
                setCopyTimeout(
                    window.setTimeout(() => setCopyText(idleButtonText), 1000)
                );
            })
            .catch(err => console.error("Failed to copy to clipboard", err));
    }

    return <Button
        className={className}
        title={detailText}
        onClick={(e: MouseEvent<HTMLButtonElement>): void => {
            e.preventDefault();
            shoveInClipboard();
        }}>
        <Icon text><FontAwesomeIcon icon={faClipboard}/></Icon>
        &nbsp;{copyText}
    </Button>;
};
