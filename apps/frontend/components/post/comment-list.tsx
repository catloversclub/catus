"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { CommentItem } from "@/components/feed/comment-item"

interface Comment {
  id: string
  author: string
  authorImage: string
  content: string
  timeAgo: string
  liked: boolean
  isAuthor?: boolean
  replies?: Comment[]
}

interface CommentListProps {
  comments: Comment[]
  totalComments: number
}

export function CommentList({ comments, totalComments }: CommentListProps) {
  const [commentText, setCommentText] = useState("")
  const [replyingTo, setReplyingTo] = useState<{ id: string; author: string } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px"
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + "px"
    }
  }, [commentText])

  const handleSubmit = () => {
    if (!commentText.trim()) return
    // TODO: 댓글/대댓글 등록 API 호출
    console.log("Replying to:", replyingTo)
    setCommentText("")
    setReplyingTo(null)
  }

  const handleReply = (commentId: string, author: string, isReply: boolean) => {
    if (isReply) return // 대댓글의 답글은 불가
    setReplyingTo({ id: commentId, author })
  }

  return (
    <div className="bg-white">
      {/* 댓글 헤더 */}
      <div className="px-4 py-3">
        <h3 className="text-text-secondary text-base font-medium">댓글 {totalComments}</h3>
      </div>

      {/* 댓글 리스트 */}
      <div className="space-y-4 px-4 pb-4">
        {comments.map((comment) => (
          <div key={comment.id}>
            {/* 원댓글 */}
            <CommentItem {...comment} onReply={(id, author) => handleReply(id, author, false)} />

            {/* 대댓글 */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="bg-secondary mt-3 space-y-3 rounded-lg py-3 pl-3">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} {...reply} isReply />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 댓글 입력창 (고정) */}
      <div className="fixed right-0 bottom-0 left-0 border-t bg-white p-3 pb-8">
        {replyingTo && (
          <div className="text-text-tertiary mb-2 flex items-center gap-2 text-sm">
            <span>@{replyingTo.author}에게 답글 작성 중</span>
            <button onClick={() => setReplyingTo(null)} className="text-blue-500">
              취소
            </button>
          </div>
        )}
        <div className="relative flex items-end">
          <Textarea
            ref={textareaRef}
            placeholder={replyingTo ? `@${replyingTo.author}에게 답글...` : "댓글을 작성하세요..."}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            className="bg-secondary max-h-[120px] min-h-[44px] resize-none overflow-hidden rounded-md border-0 pr-[52px] pl-3"
            rows={1}
          />
          <Button
            onClick={handleSubmit}
            disabled={!commentText.trim()}
            className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 rounded-full p-0"
          >
            <Image
              src={"/icons/arrow-up.svg"}
              alt={"Send"}
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </Button>
        </div>
      </div>
    </div>
  )
}
