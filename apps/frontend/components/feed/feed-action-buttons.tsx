import { Heart, MessageCircle, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommentDrawer } from "./comment-drawer"

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

interface FeedActionButtonsProps {
  liked: boolean
  bookmarked: boolean
  onLikeToggle: () => void
  onBookmarkToggle: () => void
  onComment: () => void
}

export function FeedActionButtons({
  liked,
  bookmarked,
  onLikeToggle,
  onBookmarkToggle,
  onComment,
}: FeedActionButtonsProps) {
  return (
    <div className="absolute right-[6px] bottom-[6px] z-10 flex">
      <Button
        variant="ghost"
        onClick={(event) => {
          event.stopPropagation()
          onLikeToggle()
        }}
        className="px-2 py-3"
      >
        <Heart className={`size-5 ${liked ? "fill-red-500 text-red-500" : "text-icon-tertiary"}`} />
      </Button>
      {/* 댓글 Drawer */}
      <CommentDrawer
        comments={dummyComments}
        totalComments={dummyComments.length}
        onComment={function (): void {
          throw new Error("Function not implemented.")
        }}
      />
      <Button
        variant="ghost"
        className="px-2 py-3"
        onClick={(event) => {
          event.stopPropagation()
          onBookmarkToggle()
        }}
      >
        <Bookmark
          className={`size-5 ${bookmarked ? "fill-yellow-400 text-yellow-400" : "text-icon-tertiary"}`}
        />
      </Button>
    </div>
  )
}
