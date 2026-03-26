import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Text } from "@/components/ui/text"
import { cn, formatRelativeTime } from "@/lib/utils"
import { View, Pressable } from "react-native"
import { Comment } from "@/api/domains/comment/types"
import { Image } from "expo-image"
import { useState } from "react"
import Profile from "@/components/user/Profile"

const ReplyItem = ({ reply }: { reply: Comment }) => {
  const authorImage = reply.author.profileImageUrl || require("@/assets/images/default-avatar.png")

  return (
    <View className="flex-row items-start gap-3 p-3 pl-12">
      <Image
        source={authorImage}
        style={{ width: 36, height: 36, borderRadius: 36 }}
        contentFit="cover"
      />
      <View className="flex-col">
        <Text className="typo-label1 text-semantic-text-secondary">{reply.author.nickname}</Text>
        <Text className="typo-body4 mt-1 text-semantic-text-primary">{reply.content}</Text>
        <Text className="typo-label1 mt-1.5 text-semantic-text-secondary">
          {formatRelativeTime(reply.createdAt)}
        </Text>
      </View>
    </View>
  )
}

type CommentProps = {
  comment: Comment
}

const CommentItem = ({ comment }: CommentProps) => {
  // 💡 1. undefined 대신 빈 문자열("")을 사용하여 상태 제어 충돌 방지
  const [expandedValue, setExpandedValue] = useState<string>("")
  const isExpanded = expandedValue === "replies"

  const { id, author, parentId, content, isLikedByMe, createdAt, replies } = comment
  const authorImage = author.profileImageUrl || require("@/assets/images/default-avatar.png")

  return (
    <View className="flex-col">
      <View className="flex-row items-start gap-3 p-3">
        <Profile user={author} />
        <View className="flex-col">
          <Text className="typo-label1 text-semantic-text-secondary">{author.nickname}</Text>
          <Text className="typo-body4 mt-1 text-semantic-text-primary">{content}</Text>
          <Text className="typo-label1 mt-1.5 text-semantic-text-secondary">
            {formatRelativeTime(createdAt)}
          </Text>
        </View>
      </View>

      {replies && replies.length > 0 ? (
        <Accordion
          type="single"
          collapsible
          value={expandedValue}
          onValueChange={(value: string | undefined) => setExpandedValue(value ?? "")}
        >
          <AccordionItem value="replies">
            {/* 유일한 Trigger: 열려있을 땐 공간을 유지한 채 숨김(hidden) */}
            <AccordionTrigger
              className={cn(
                "flex-row items-center justify-start gap-1.5 py-2 pl-12",
                isExpanded && "hidden",
              )}
            >
              <View className="h-[1px] w-4 bg-semantic-border-primary" />
              <Text className="typo-label1 text-semantic-text-tertiary">
                답글 {replies.length}개 더 보기...
              </Text>
            </AccordionTrigger>

            <AccordionContent>
              {/* 💡 2. '답글 숨기기' 버튼을 Content 내부의 맨 마지막에 배치! */}
              <View className="bg-semantic-bg-secondary pb-2">
                {replies.map((reply) => (
                  <ReplyItem key={reply.id} reply={reply} />
                ))}

                {/* 답글 리스트 맨 아래에 닫기 버튼이 렌더링 됩니다. */}
                <Pressable
                  className="flex-row items-center gap-1.5 pb-4 pl-12 pt-2 active:opacity-60"
                  onPress={() => setExpandedValue("")} // 빈 문자열로 리셋하여 아코디언을 닫음
                >
                  <View className="h-[1px] w-4 bg-semantic-border-primary" />
                  <Text className="typo-label1 text-semantic-text-tertiary">답글 닫기</Text>
                </Pressable>
              </View>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <View className="h-5" />
      )}
    </View>
  )
}

export { CommentItem }
