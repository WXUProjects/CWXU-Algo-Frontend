export default class Validate {
    static checkEmail(email: string): boolean {
        if (!email) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}