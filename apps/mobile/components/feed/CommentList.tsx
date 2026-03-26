import { View, Text } from "react-native"

import { usePostCommentsQuery } from "@/api/domains/comment/queries" // 경로에 맞게 수정
import { formatRelativeTime } from "@/lib/utils" // 시간 포맷팅 유틸 (앞서 쓰시던 것 재활용)
import { CommentItem } from "@/components/feed/CommentItem"
import { Comment } from "@/api/domains/comment/types"

const CommentCount = ({ count }: { count: number }) => {
  return (
    <View className="flex-row gap-1">
      <Text className="typo-body1 text-gray-900">댓글</Text>
      <Text className="typo-body2 text-gray-700">{count}</Text>
    </View>
  )
}

interface CommentListProps {
  postId: string
}

const CommentList = ({ postId }: CommentListProps) => {
  const { data: comments } = usePostCommentsQuery(postId)
  const totalCount = comments.length

  // 💡 댓글이 없을 때 보여줄 UI (Empty State)
  if (!comments || comments.length === 0) {
    return (
      <View className="items-center justify-center py-10">
        <Text className="text-body4-r-14 text-neutral-50">
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
        </Text>
      </View>
    )
  }

  return (
    <View className="flex-col gap-3 px-4 pb-10">
      <CommentCount count={totalCount} />

      {comments.map((comment: Comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </View>
  )
}

export default CommentList
