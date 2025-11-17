"use client"

import { FeedCard } from "./feed-card"

// 임시 더미 데이터
const DUMMY_POSTS = [
  {
    id: "1",
    ownerName: "치즈",
    ownerImage: "/images/user/placeholder-user-1.png",
    catName: "치즈",
    images: ["/images/cat/placeholder-cat-1.png", "/images/cat/placeholder-cat-1.png"],
    daysAgo: "3일 전",
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "2",
    ownerName: "김삼순",
    ownerImage: "/images/user/placeholder-user-2.png",
    catName: "김삼순",
    images: [
      "/images/cat/placeholder-cat-2.png",
      "/images/cat/placeholder-cat-2.png",
      "/images/cat/placeholder-cat-2.png",
    ],
    daysAgo: "4일 전",
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: "3",
    ownerName: "오해요",
    ownerImage: "/images/user/placeholder-user-3.png",
    catName: "오해요",
    images: ["/images/cat/placeholder-cat-3.png", "/images/cat/placeholder-cat-3.png"],
    daysAgo: "8시간 전",
    isLiked: true,
    isBookmarked: true,
  },
]

export function FeedList() {
  // TODO: 실제 API에서 데이터 가져오기
  const posts = DUMMY_POSTS

  return (
    <div className="pb-20">
      {posts.map((post) => (
        <FeedCard key={post.id} {...post} />
      ))}
    </div>
  )
}
