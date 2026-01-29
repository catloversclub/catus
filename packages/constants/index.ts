// WebView와 App이 공유할 메시지 타입
export const WEBVIEW_MESSAGE_TYPE = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS", // [추가됨] 로그인 토큰 전달용
  OPEN_COMMENT_SHEET: "OPEN_COMMENT_SHEET",
  OPEN_ADDITION_SHEET: "OPEN_ADDITION_SHEET",
  NAVIGATE_TO_POST: "NAVIGATE_TO_POST",
  ONBOARDING_COMPLETE: "ONBOARDING_COMPLETE",
  ONBOARDING_NAVIGATE: "ONBOARDING_NAVIGATE",
} as const;

// 타입 추론을 위한 타입 정의
export type WebviewMessageType = keyof typeof WEBVIEW_MESSAGE_TYPE;

// 타입 정의
export interface Comment {
  id: string;
  author: string;
  authorImage: string;
  content: string;
  timeAgo: string;
  liked: boolean;
  replies?: Comment[];
}
