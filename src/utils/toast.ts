import type { stdResponse } from "./api";

export default class Toast {
    static success = (message: string) => {
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message, type: 'success' }
        }));
    }

    static info = (message: string) => {
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message, type: 'info' }
        }));
    }

    static warn = (message: string) => {
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message, type: 'warn' }
        }));
    }

    static error = (message: string) => {
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message, type: 'error' }
        }));
    }

    static stdResponse = (response: stdResponse, showSuccess: boolean = true) => {
        if (response.success) {
            if (showSuccess) {
                Toast.success(response.message);
            }
        } else {
            Toast.error(response.message);
        }
    }
}