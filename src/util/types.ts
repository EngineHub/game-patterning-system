import React from "react";

export type ReactComponentProp<T> = T extends React.Component<infer P> ? P : never;
