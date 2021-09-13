import React, {ReactNode} from "react";
import {Modal} from "react-bulma-components";

interface SimpleErrorBoundaryProps extends React.PropsWithChildren<Record<string, unknown>> {
    context?: string;
}

interface SimpleErrorBoundaryState {
    error?: Error;
}

export class SimpleErrorBoundary extends React.Component<SimpleErrorBoundaryProps, SimpleErrorBoundaryState> {
    constructor(props: SimpleErrorBoundaryProps) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromError(error: Error): Partial<SimpleErrorBoundaryState> {
        return {
            error: error
        };
    }

    override render(): ReactNode {
        if (typeof this.state.error !== "undefined") {
            const error = this.state.error;
            return <Modal show showClose={false}>
                <Modal.Card>
                    <Modal.Card.Header showClose={false}>
                        <Modal.Card.Title>
                            An error occurred in {this.props.context || "the application"}.
                        </Modal.Card.Title>
                    </Modal.Card.Header>
                    <Modal.Card.Body className="has-background-danger">
                        <p>
                            Please report this on our Discord in #enginehub-misc.
                        </p>
                        <p>
                            Raw Error:
                            <code className="bg-dark text-white p-1 m-1">
                                {error.message}
                            </code>
                        </p>
                        <details>
                            <summary>Stack</summary>
                            <pre className="bg-dark p-1">
                            {error.stack}
                        </pre>
                        </details>
                    </Modal.Card.Body>
                </Modal.Card>
            </Modal>;
        }
        return this.props.children;
    }
}
