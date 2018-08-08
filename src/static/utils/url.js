export function getUrlParamsString(params) {
    return Object.keys(params)
        .filter(key => !!params[key])
        .map(key => `${key}=${params[key]}`)
        .reduce((acc, val) => acc ? `${acc}&${val}` : val);
}