import {format} from "./formatters";

type TemplateTagFunction<P, R> = (literals: TemplateStringsArray, ...placeholders: P[]) => R;

export function formatLater<P extends (string | number | symbol)>(
    literals: TemplateStringsArray,
    ...placeholders: P[]
): FormatLater<P, string, string> {
    return new FormatLaterImpl(literals, placeholders, format);
}

export interface FormatLater<P extends (string | number | symbol), MP, R> {
    format(parameters: Record<P, MP>): R;

    tag<FP, R>(tag: TemplateTagFunction<FP, R>): FormatLater<P, FP, R>;
}

class FormatLaterImpl<P extends (string | number | symbol), MP, R> implements FormatLater<P, MP, R> {
    constructor(
        private literals: TemplateStringsArray,
        private placeholders: P[],
        private tagFunction: TemplateTagFunction<MP, R>,
    ) {
    }

    format(parameters: Record<P, MP>): R {
        return this.tagFunction(this.literals, ...this.placeholders.map(p => parameters[p]));
    }

    tag<FP, R>(tag: TemplateTagFunction<FP, R>): FormatLater<P, FP, R> {
        return new FormatLaterImpl(this.literals, this.placeholders, tag);
    }
}
