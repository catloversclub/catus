"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { PostDetail } from "@/components/post/post-detail"

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="fixed top-0 right-0 left-0 z-10 flex items-center justify-between bg-white px-4 py-3">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">게시물</h1>
        <div className="w-10" /> {/* 균형을 위한 빈 공간 */}
      </header>

      {/* 컨텐츠 */}
      <main className="pt-[60px]">
        <PostDetail postId={postId} />
      </main>
    </div>
  )
}
