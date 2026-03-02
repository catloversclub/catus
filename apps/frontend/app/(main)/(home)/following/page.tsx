import { FeedList } from "@/components/feed/feed-list"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

export default function Home() {
  return (
    <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
      <Suspense fallback={<div>피드를 불러오는 중...</div>}>
        <FeedList />
      </Suspense>
    </ErrorBoundary>
  )
}
