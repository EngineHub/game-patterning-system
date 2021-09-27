import React from "react";

export type ReactComponentProps<T> = T extends React.Component<infer P> ? P : never;

export type Result<T, E> = { type: "ok", value: T } | { type: "err", value: E };
