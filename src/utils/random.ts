export default class Random {
    static range(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static choice = <T>(arr: T[]): T => {
        return arr[Math.floor(Math.random() * arr.length)] as T;
    }
}