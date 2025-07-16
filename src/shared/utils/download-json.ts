export function downloadJSON<T = any>(object: T, filename: string) {
    const dataUri = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(object));
    const anchorElement = document.createElement('a');

    anchorElement.href = dataUri;
    anchorElement.download = `${filename}.json`;
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
}
