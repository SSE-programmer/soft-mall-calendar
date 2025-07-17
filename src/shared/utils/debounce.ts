export function debounce(f: (...ar: any[]) => any, delay: number) {
    let timer = 0;

    return function (this: any, ...args: any[]) {
        clearTimeout(timer);
        timer = setTimeout(() => f.apply(this, args), delay);
    };
}
