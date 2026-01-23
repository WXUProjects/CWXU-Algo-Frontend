import CryptoJS from 'crypto-js';

/**
 * 使用SHA256对密码进行哈希加密
 * @param password 原始密码
 * @returns 加密后的哈希值
 */
export const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};