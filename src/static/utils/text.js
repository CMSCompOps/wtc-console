
export function trimTextFn(maxLen) {
    return (text) =>
        text && text.length > maxLen
            ? `${text.substring(0, maxLen)}...`
            : text;

}