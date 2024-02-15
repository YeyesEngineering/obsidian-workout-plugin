export function wrapAround(value: number, size: number): number {
    if (size <= 0) {
        throw Error('size may not be zero or negative');
    }
    return mod(value, size);
}

export function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}
