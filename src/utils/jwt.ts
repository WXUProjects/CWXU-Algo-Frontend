import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  exp?: number;
  [key: string]: any;
}

export default class JWT {
  private static readonly TOKEN_KEY = 'jwtToken';
  
  static get token(): string {
    if (!this._token) {
      this._token = localStorage.getItem(this.TOKEN_KEY) || '';
    }
    return this._token;
  }

  static set token(value: string) {
    this._token = value;
    if (value) {
      localStorage.setItem(this.TOKEN_KEY, value);
    } else {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  private static _token: string = '';

  /**
   * 获取用户信息（解码JWT payload）
   * 仅在token有效时返回用户信息
   */
  static getUserInfo(): JwtPayload | null {
    // 检查token是否有效（存在且未过期）
    if (!this.isValid()) {
      return null;
    }
    
    const token = this.token;
    if (!token) {
      return null;
    }
    
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('JWT decode error:', error);
      // 解码失败时也清除无效token
      this.clearToken();
      return null;
    }
  }

  /**
   * 检查token是否过期，如果过期则清理token
   */
  static isTokenExpired(): boolean {
    const userInfo = this.getUserInfoWithoutValidation();
    if (!userInfo || !userInfo.exp) {
      this.clearToken();
      return true;
    }

    // 添加1分钟的缓冲时间，提前认为token已过期
    const currentTime = Math.floor(Date.now() / 1000) + 60;
    const isExpired = userInfo.exp < currentTime;
    
    // 如果token已过期，则清理它
    if (isExpired) {
      this.clearToken();
    }
    
    return isExpired;
  }

  /**
   * 检查token是否有效
   * 同时清理过期的token
   */
  static isValid(): boolean {
    // 如果没有token，则无效
    if (!this.token) {
      return false;
    }
    
    // 检查是否过期（自动清理过期的token）
    return !this.isTokenExpired();
  }

  /**
   * 清除token
   */
  static clearToken(): void {
    this.token = '';
    this._token = '';
  }

  /**
   * 设置新的token
   */
  static setNewToken(token: string): void {
    this.token = token;
  }

  /**
   * 检查token是否有效并清理过期的token
   * 返回true表示token有效，false表示token无效或已过期
   */
  static checkAndRefreshToken(): boolean {
    if (!this.token) {
      return false;
    }
    
    const isExpired = this.isTokenExpired();
    return !isExpired;
  }

  /**
   * 不验证直接获取用户信息
   * 避免死循环递归调用
   */
  private static getUserInfoWithoutValidation(): JwtPayload | null {
    const token = this.token;
    if (!token) {
      return null;
    }
    
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('JWT decode error in validation:', error);
      // 解码失败时清除token
      this.clearToken();
      return null;
    }
  }
}