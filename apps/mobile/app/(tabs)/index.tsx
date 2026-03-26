import { Text, RefreshControl, View, FlatList, ActivityIndicator } from "react-native"
import { Suspense, useCallback, useRef, useState } from "react"
import PagerView from "react-native-pager-view"
import { SafeAreaView } from "react-native-safe-area-context"
import { TabType } from "@/constants/type"
import { Header } from "@/components/layout/header"
import { commonStyles } from "@/styles/common-styles"
import { useFollowingFeedQuery, useRecommendedFeedQuery } from "@/api/domains/post/queries"
import { FeedCard } from "@/components/feed/FeedCard"

function FollowingFeedList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useFollowingFeedQuery()
  const posts = data.pages.flatMap((page) => page)

  // 각 리스트가 자신의 새로고침 상태를 관리합니다.
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedCard post={item} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage()
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={{ marginVertical: 20 }} />
        ) : null
      }
    />
  )
}

// 2. 추천 피드 리스트 (새로고침 로직 포함)
function RecommendedFeedList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useRecommendedFeedQuery()
  const posts = data.pages.flatMap((page) => page)

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedCard post={item} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage()
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={{ marginVertical: 20 }} />
        ) : null
      }
    />
  )
}

export default function HomeScreen() {
  const pagerRef = useRef<PagerView>(null)
  const [activeTab, setActiveTab] = useState(0) // 0: following, 1: recommended

  const handleTabChange = (tab: TabType) => {
    const index = tab === "following" ? 0 : 1
    setActiveTab(index)
    pagerRef.current?.setPage(index)
  }

  return (
    <SafeAreaView
      style={commonStyles.container}
      className="bg-semantic-bg-primary"
      edges={["top", "left", "right"]}
    >
      <Header
        activeTab={activeTab === 0 ? "following" : "recommended"}
        onTabChange={handleTabChange}
      />

      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setActiveTab(e.nativeEvent.position)}
      >
        <View key="following" style={{ flex: 1 }}>
          <Suspense fallback={<ActivityIndicator size="large" style={{ marginTop: 50 }} />}>
            <FollowingFeedList />
          </Suspense>
        </View>

        <View key="recommended" style={{ flex: 1 }}>
          <Suspense fallback={<ActivityIndicator size="large" style={{ marginTop: 50 }} />}>
            <RecommendedFeedList />
          </Suspense>
        </View>
      </PagerView>

      {/* <CommentSheet commentSheetRef={commentSheetRef} comments={comments} />

      <BottomSheet ref={additionSheetRef} index={1}>
        <Text>이제 탭 바 위로 올라옵니다! 🎉</Text>
      </BottomSheet> */}
    </SafeAreaView>
  )
}
