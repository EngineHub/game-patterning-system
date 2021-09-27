export function urlEncoded(literals: TemplateStringsArray, ...parameters: string[]): string {
    return format(literals, ...parameters.map(p => encodeURIComponent(p)));
}

/**
 * The equivalent of using un-tagged template strings.
 */
export function format(literal: TemplateStringsArray, ...placeholders: string[]): string {
    let result = "";
    for (let i = 0; i < placeholders.length; i++) {
        result += literal[i] + "" + placeholders[i];
    }
    result += literal[literal.length - 1];
    return result;
}
