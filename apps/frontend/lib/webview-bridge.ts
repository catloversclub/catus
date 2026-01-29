// lib/webview-bridge.ts
import { Comment } from "@catus/constants"
import { WEBVIEW_MESSAGE_TYPE } from "@catus/constants"

// Types
interface ReactNativeWebView {
  postMessage: (message: string) => void
}

interface WindowWithWebView extends Window {
  ReactNativeWebView?: ReactNativeWebView
}

interface LoginPayload {
  accessToken?: string
  refreshToken?: string
  onboardingRequired?: boolean
  user?: any
}

// 1. 유틸리티: WebView 환경 체크
export function isInWebView(): boolean {
  if (typeof window === "undefined") return false
  return !!(window as WindowWithWebView).ReactNativeWebView
}

// 2. 유틸리티: 메시지 전송 공통 함수
export function sendToReactNative(type: string, payload?: unknown) {
  if (typeof window !== "undefined" && (window as WindowWithWebView).ReactNativeWebView) {
    ;(window as WindowWithWebView).ReactNativeWebView!.postMessage(
      JSON.stringify({ type, payload })
    )
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
