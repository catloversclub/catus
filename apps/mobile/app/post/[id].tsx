import { useLocalSearchParams, Stack } from "expo-router"
import { View, ScrollView, ActivityIndicator, RefreshControl } from "react-native"
import { Suspense, useState, useCallback } from "react"

import { usePostByIdQuery } from "@/api/domains/post/queries"
import { FeedCard } from "@/components/feed/FeedCard"
import CommentList from "@/components/feed/CommentList"

function PostDetailContent({ postId }: { postId: string }) {
  const { data: post, refetch } = usePostByIdQuery(postId)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  const authorNickname = post.author.nickname

  return (
    <>
      <Stack.Screen options={{ title: `${authorNickname}의 게시물` }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{
          paddingBottom: 40,
          rowGap: 24, // 또는 gap: 24
        }}
      >
        <FeedCard post={post} isDetail />
        <CommentList postId={post.id} />
      </ScrollView>
    </>
  )
}

// 💡 3. 최상위 컴포넌트 (Suspense로 로딩 상태 처리)
export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Suspense
        fallback={
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        }
      >
        <PostDetailContent postId={id} />
      </Suspense>
    </View>
  )
}
