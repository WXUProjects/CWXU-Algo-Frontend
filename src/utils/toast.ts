/**
 * 通知管理工具类
*/

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

    /**
     * @brief 自动处理API工具类产生的标准响应
     * @param response 标准响应
     * @param showSuccess 是否处理成功响应
    */
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