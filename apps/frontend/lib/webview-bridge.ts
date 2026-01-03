import { Comment } from "@catus/constants"
import { WEBVIEW_MESSAGE_TYPE } from "@catus/constants"
// WebView 환경인지 확인
export function isInWebView(): boolean {
  if (typeof window === "undefined") return false
  return !!(window as any).ReactNativeWebView
}

// React Native로 메시지 전송
export function sendToReactNative(type: string, payload?: any) {
  if (typeof window !== "undefined" && (window as any).ReactNativeWebView) {
    ;(window as any).ReactNativeWebView.postMessage(
      JSON.stringify({
        type,
        payload,
      })
    )
  }
}

// React Native 댓글 모달 열기
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

// React Native Post 상세 화면으로 이동
export function navigateToPost(postId: string) {
  sendToReactNative(WEBVIEW_MESSAGE_TYPE.NAVIGATE_TO_POST, { postId })
}

// React Native로부터 메시지 수신 리스너 등록
export function addWebViewMessageListener(callback: (event: MessageEvent) => void): () => void {
  if (typeof window === "undefined") return () => {}

  window.addEventListener("message", callback)

  return () => {
    window.removeEventListener("message", callback)
  }
}
