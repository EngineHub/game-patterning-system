import React from "react";

export type ReactComponentProps<T> = T extends React.Component<infer P> ? P : never;
