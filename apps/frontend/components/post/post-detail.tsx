"use client"

import Image from "next/image"
import { MoreVertical } from "lucide-react"
import { useState, useEffect } from "react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { FeedActionButtons } from "@/components/feed/feed-action-buttons"
import { CommentList } from "./comment-list"

interface PostDetailProps {
  postId: string
}

export function PostDetail({ postId }: PostDetailProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // TODO: 실제 API에서 데이터 가져오기
  const post = {
    id: postId,
    ownerName: "김요모",
    ownerImage: "/images/user/placeholder-user-1.png",
    catName: "김요모",
    images: Array(10).fill("/images/cat/placeholder-cat-1.png"),
    daysAgo: "4분 전",
    content: `꽉 할 일 개할 때 앞짱 거리는 냥아지 고양이... 오허려좋아...
평개살아 더 누워잇기 ㅋㅋ
머리채 잡는 거 아니고
쓰다듬는 중`,
  }

  // 임시 댓글 데이터
  const dummyComments = [
    {
      id: "1",
      author: "랜선집사",
      authorImage: "/images/user/placeholder-user-1.png",
      content: "치즈 사진 빨리 재채 올려주세요 감사합니다 복 받으세요 선생님",
      timeAgo: "9분 전",
      liked: false,
      replies: [],
    },
    {
      id: "2",
      author: "김치즈튀김나나",
      authorImage: "/images/user/placeholder-user-2.png",
      content: "네~ 에빡께 박 주서서 감사해요~^^",
      timeAgo: "5초 전",
      liked: true,
      isAuthor: true,
      replies: [
        {
          id: "2-1",
          author: "너님엄동파이야",
          authorImage: "/images/user/placeholder-user-3.png",
          content: "너무 귀여워요!",
          timeAgo: "14분 전",
          liked: false,
        },
      ],
    },
    {
      id: "3",
      author: "나만고양이아이러닛",
      authorImage: "/images/user/placeholder-user-1.png",
      content: "치조도... 얌오도... 맘껏주세저 재채...",
      timeAgo: "20분 전",
      liked: false,
      replies: [],
    },
    {
      id: "4",
      author: "미리본편견",
      authorImage: "/images/user/placeholder-user-2.png",
      content: "치도요...",
      timeAgo: "20분 전",
      liked: false,
      replies: [],
    },
    {
      id: "5",
      author: "김치즈튀김나나",
      authorImage: "/images/user/placeholder-user-2.png",
      content: "네~ 그렇게나요 ^^^ 감사합니당~",
      timeAgo: "1분 전",
      liked: false,
      isAuthor: true,
      replies: [],
    },
    {
      id: "6",
      author: "김치즈튀김나나",
      authorImage: "/images/user/placeholder-user-2.png",
      content: "우리 치즈 항상 예뻐해주서서 더너 감사해요~🧡",
      timeAgo: "1시간 전",
      liked: true,
      isAuthor: true,
      replies: [],
    },
  ]

  return (
    <div className="pb-20">
      {/* 이미지 캐러셀 */}
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {post.images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative overflow-hidden bg-gray-100">
                <Image
                  src={image}
                  alt={`${post.catName} photo ${index + 1}`}
                  width={800}
                  height={800}
                  className="h-auto w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 이미지 카운터 (오른쪽 상단) */}
        {post.images.length > 1 && (
          <div className="absolute top-3 right-3 z-10 rounded-full bg-black/20 px-2 py-1 text-xs font-medium text-white">
            {current + 1} / {post.images.length}
          </div>
        )}

        {/* 이미지 네비게이션 도트 (하단 중앙) */}
        {post.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            {post.images.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  index === current ? "bg-yellow-400" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* 액션 버튼들 (이미지 오른쪽 하단) */}
        <FeedActionButtons
          liked={liked}
          bookmarked={bookmarked}
          onLikeToggle={() => setLiked(!liked)}
          onBookmarkToggle={() => setBookmarked(!bookmarked)}
          onComment={function (): void {
            throw new Error("Function not implemented.")
          }}
        />
      </Carousel>

      {/* 프로필 정보 (이미지 하단) */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src={post.ownerImage}
            alt={post.ownerName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{post.catName}</span>
            <span className="text-xs text-gray-500">{post.daysAgo}</span>
          </div>
        </div>
        <button className="p-2">
          <MoreVertical className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* 게시물 내용 */}
      <div className="px-4 pb-4 text-sm whitespace-pre-wrap">{post.content}</div>

      {/* 댓글 섹션 */}
      <div className="border-t-8 border-gray-100">
        <CommentList comments={dummyComments} totalComments={dummyComments.length} />
      </div>
    </div>
  )
}
