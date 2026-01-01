import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { isInWebView, openAdditionSheet } from "@/lib/webview-bridge"

export function ActionDrawer() {
  return (
    <Button
      variant="ghost"
      className="p-2"
      onClick={(event) => {
        event.stopPropagation()

        // WebView 환경에서는 React Native 모달로 열기
        if (isInWebView()) {
          event.preventDefault()
          openAdditionSheet()
          return
        }
      }}
    >
      <MoreVertical className="text-icon-tertiary h-5 w-5" />
    </Button>
  )
}
