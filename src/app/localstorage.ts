/* eslint-disable @typescript-eslint/no-unused-vars */

export const getLocalStorageItem = (key: string) => {
    return typeof window !== undefined
      ? window.localStorage.getItem(key)
      : null;
  };

export const setLocalStorageItem = (key: string, value: string) => {
    return typeof window !== undefined
      ? window.localStorage.setItem(key, value)
      : { setItem: () => {} };
  }

export const removeLocalStorageItem = (key: string) => {
    return typeof window !== undefined
      ? window.localStorage.removeItem(key)
      : { removeItem: () => {} };
  }