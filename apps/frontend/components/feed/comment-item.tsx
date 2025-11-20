"use client"

import Image from "next/image"
import { Heart, MessageCircle } from "lucide-react"

interface CommentItemProps {
  id: string
  author: string
  authorImage: string
  content: string
  timeAgo: string
  liked: boolean
  isAuthor?: boolean
  isReply?: boolean
  onReply?: (id: string, author: string) => void
  onToggleLike?: (id: string) => void
}

export function CommentItem({
  id,
  author,
  authorImage,
  content,
  timeAgo,
  liked,
  isAuthor,
  isReply = false,
  onReply,
  onToggleLike,
}: CommentItemProps) {
  const imageSize = isReply ? 32 : 40

  return (
    <div className={`flex gap-3 rounded-lg p-3 ${isReply ? "bg-secondary pl-13" : ""}`}>
      <Image
        src={authorImage}
        alt={author}
        width={imageSize}
        height={imageSize}
        className={`${isReply ? "h-8 w-8" : "h-10 w-10"} rounded-full object-cover`}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-text-secondary text-sm font-normal">{author}</span>
          {isAuthor && <span className="rounded px-1.5 py-0.5 text-xs text-blue-500">작성자</span>}
        </div>
        <p className="text-foreground mt-1 text-sm">{content}</p>
        <div className="text-text-tertiary mt-2 flex items-center justify-between text-xs">
          <span>{timeAgo}</span>
          <div className="flex gap-3">
            <button className="flex items-center gap-1" onClick={() => onToggleLike?.(id)}>
              <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            </button>
            {onReply && (
              <button onClick={() => onReply(id, author)}>
                <MessageCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
