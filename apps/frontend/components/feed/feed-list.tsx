"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import { ApiPost, mapApiToUI } from "./util"
import { FeedCard } from "./feed-card"

export function FeedList() {
  const { ref, inView } = useInView()

  // 위에서 만든 ApiPost 인터페이스를 가져온다고 가정합니다.
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery<
    ApiPost[],
    Error
  >({
    // <데이터타입, 에러타입> 명시
    queryKey: ["posts"],
    queryFn: async ({ pageParam = "1" }) => {
      const res = await fetch(`/api/post/feed?take=20&cursor=${1}`)
      if (!res.ok) throw new Error("네트워크 응답에 문제가 있습니다.")
      return res.json() // 이제 여기서 ApiPost[]로 추론됩니다.
    },
    getNextPageParam: (lastPage) =>
      lastPage.length > 0 ? lastPage[lastPage.length - 1].id : undefined,
    initialPageParam: "",
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  // 상위 컴포넌트의 <Suspense> 덕분에 여기서 data?.pages 라고 쓸 필요가 없습니다.
  return (
    <div className="pb-20">
      {data.pages.map((page) =>
        page.map((post) => (
          <FeedCard
            key={post.id}
            {...mapApiToUI(post)} // 매핑 함수로 분리하면 더 깨끗합니다.
          />
        ))
      )}

      <div ref={ref} className="h-10">
        {isFetchingNextPage && "더 불러오는 중..."}
      </div>
    </div>
  )
}
