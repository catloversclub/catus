// lib/webview-bridge.ts
import { Comment } from "@catus/constants"
import { WEBVIEW_MESSAGE_TYPE } from "@catus/constants"

// Types

interface LoginPayload {
  accessToken?: string
  refreshToken?: string
  onboardingRequired?: boolean
}

// 1. 유틸리티: WebView 환경 체크
export function isInWebView(): boolean {
  if (typeof window === "undefined") return false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(window as any).ReactNativeWebView
}

// 2. 유틸리티: 메시지 전송 공통 함수
export function sendToReactNative(type: string, payload?: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== "undefined" && (window as any).ReactNativeWebView) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).ReactNativeWebView.postMessage(JSON.stringify({ type, payload }))
  }
}

/* -------------------------------------------------------------------------- */
/* Auth & Onboarding                            */
/* -------------------------------------------------------------------------- */

// [수정] 문자열 리터럴 대신 상수를 사용
export function notifyLoginSuccess(payload: LoginPayload) {
  sendToReactNative(WEBVIEW_MESSAGE_TYPE.LOGIN_SUCCESS, payload)
}

// [수정] 상수를 사용 (payload 타입 정의 강화)
export function notifyOnboardingComplete(payload?: { accessToken?: string }) {
  sendToReactNative(WEBVIEW_MESSAGE_TYPE.ONBOARDING_COMPLETE, payload)
}

export function navigateOnboarding(route: string) {
  sendToReactNative(WEBVIEW_MESSAGE_TYPE.ONBOARDING_NAVIGATE, { route })
}

/* -------------------------------------------------------------------------- */
/* Features                                  */
/* -------------------------------------------------------------------------- */

export interface CommentSheetPayload {
  postId: string
  comments: Comment[]
}

export function openCommentSheet(data: CommentSheetPayload) {
  sendToReactNative(WEBVIEW_MESSAGE_TYPE.OPEN_COMMENT_SHEET, data)
}

export function openAdditionSheet() {
  sendToReactNative(WEBVIEW_MESSAGE_TYPE.OPEN_ADDITION_SHEET)
}

export function navigateToPost(postId: string) {
  sendToReactNative(WEBVIEW_MESSAGE_TYPE.NAVIGATE_TO_POST, { postId })
}
