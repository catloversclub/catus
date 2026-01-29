// utils/tokenStorage.ts
import * as SecureStore from "expo-secure-store";

export const tokenStorage = {
  save: async (accessToken: string, refreshToken?: string) => {
    await SecureStore.setItemAsync("access_token", accessToken);
    if (refreshToken) {
      await SecureStore.setItemAsync("refresh_token", refreshToken);
    }
  },
  getAccess: async () => await SecureStore.getItemAsync("access_token"),
  getRefresh: async () => await SecureStore.getItemAsync("refresh_token"),
  clear: async () => {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");
  },
};
