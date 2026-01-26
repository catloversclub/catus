import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_INFO_KEY = "auth_user_info";

export const authStorage = {
  // 1. 세션 저장 (토큰 + 유저정보)
  async saveSession(accessToken: string, refreshToken: string, user: any) {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      }
      await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("세션 저장 실패:", error);
    }
  },

  // 2. 세션 불러오기
  async getSession() {
    try {
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const userInfoStr = await SecureStore.getItemAsync(USER_INFO_KEY);

      if (!accessToken || !userInfoStr) return null;

      return {
        accessToken,
        user: JSON.parse(userInfoStr),
      };
    } catch (error) {
      return null;
    }
  },

  // 3. 로그아웃 (삭제)
  async clearSession() {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_INFO_KEY);
  },
};
