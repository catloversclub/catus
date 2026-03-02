import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

// API 응답 타입 정의 (브루노 응답 기준)
interface ApiImage {
  id: string
  url: string
  order: number
  postId: string
}

export interface ApiPost {
  id: string
  likeCount: number
  content: string
  createdAt: string
  updatedAt: string
  authorId: string
  catId: string | null
  author: {
    id: string
    nickname: string
    profileImageUrl: string | null
  }
  images: ApiImage[]
}

// 매핑 함수
export const mapApiToUI = (post: ApiPost) => {
  const STORAGE_BASE_URL = "http://minio:9000/catus-media" // 실제 스토리지 주소

  return {
    id: post.id,
    ownerName: post.author.nickname,
    ownerImage: post.author.profileImageUrl ?? "/images/user/placeholder-user-1.png",
    catName: post.author.nickname,
    images: post.images
      .sort((a, b) => a.order - b.order)
      .map((img) => `${STORAGE_BASE_URL}/${img.url}`),

    // 🔥 핵심: 여기서 Date 객체를 넘기지 말고, 완전히 포맷팅된 '문자열'을 넘기세요.
    daysAgo: formatDistanceToNow(new Date(post.createdAt), {
      addSuffix: true,
      locale: ko,
    }),

    isLiked: post.likeCount > 0,
    isBookmarked: false,
    content: post.content,
  }
}
