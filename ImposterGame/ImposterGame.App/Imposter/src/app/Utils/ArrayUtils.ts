export function chunkArray<T>(array: Array<T>, chunkSize: number): Array<Array<T>> {
    var i, j;
    var arrays = [];

    for (i = 0, j = array.length; i < j; i += chunkSize) {
        arrays.push(array.slice(i, i + chunkSize));
    }

    return arrays;
}