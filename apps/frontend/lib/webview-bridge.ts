/**
 * WebView와 React Native 간 통신을 위한 브릿지 유틸리티
 */

export interface Comment {
  id: string
  author: string
  authorImage: string
  content: string
  timeAgo: string
  liked: boolean
  isAuthor?: boolean
  replies?: Comment[]
}

export interface CommentModalPayload {
  postId: string
  comments: Comment[]
  totalComments: number
}

/**
 * WebView 환경인지 확인
 */
export function isInWebView(): boolean {
  if (typeof window === "undefined") return false
  return !!(window as any).ReactNativeWebView
}

/**
 * React Native로 메시지 전송
 */
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

/**
 * React Native 댓글 모달 열기
 */
export function openCommentModal(data: CommentModalPayload) {
  sendToReactNative("OPEN_COMMENT_MODAL", data)
}

/**
 * React Native로부터 메시지 수신 리스너 등록
 */
export function addWebViewMessageListener(callback: (event: MessageEvent) => void): () => void {
  if (typeof window === "undefined") return () => {}

  window.addEventListener("message", callback)

  return () => {
    window.removeEventListener("message", callback)
  }
}
