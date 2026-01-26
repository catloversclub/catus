import React, { createContext, useContext, useState, useEffect } from "react";
import { authStorage } from "./storage";

type AuthContextType = {
  session: any | null;
  isLoading: boolean;
  signIn: (token: string, refreshToken: string, user: any) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 스토리지 체크
  useEffect(() => {
    const loadSession = async () => {
      const savedSession = await authStorage.getSession();
      setSession(savedSession);
      setIsLoading(false);
    };
    loadSession();
  }, []);

  // 로그인 함수 (LoginScreen에서 호출)
  const signIn = async (
    accessToken: string,
    refreshToken: string,
    user: any,
  ) => {
    // 1. 스토리지 저장
    await authStorage.saveSession(accessToken, refreshToken, user);
    // 2. 상태 업데이트 (이게 핵심! 문지기에게 알림)
    setSession({ accessToken, user });
  };

  // 로그아웃 함수
  const signOut = async () => {
    await authStorage.clearSession();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
