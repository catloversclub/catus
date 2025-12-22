import React, { useState, useRef } from "react";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { commonStyles } from "@/constants/common-styles";
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface Comment {
  id: string;
  author: string;
  authorImage: string;
  content: string;
  timeAgo: string;
  liked: boolean;
  isAuthor?: boolean;
  replies?: Comment[];
}

interface CommentModalData {
  postId: string;
  comments: Comment[];
  totalComments: number;
}

export default function App() {
  // 개발 중에는 localhost, 배포 시에는 실제 도메인 사용
  // 주의: Android 에뮬레이터에서는 localhost 대신 'http://10.0.2.2:3000' 사용
  const WEBVIEW_URL = "http://192.168.0.172:3000";

  const webViewRef = useRef<WebView>(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentModalData, setCommentModalData] =
    useState<CommentModalData | null>(null);
  const [commentText, setCommentText] = useState("");

  return (
    <SafeAreaView
      style={commonStyles.container}
      edges={["top", "left", "right"]}
    >
      {/* 상단 상태바 스타일 (Toss는 보통 dark나 auto 사용) */}
      <StatusBar style="auto" />

      <WebView
        ref={webViewRef}
        source={{ uri: WEBVIEW_URL }}
        style={commonStyles.webview}
        // Toss 느낌의 UX를 위한 필수 설정
        showsVerticalScrollIndicator={false} // 스크롤바 숨기기
        allowsBackForwardNavigationGestures={true} // iOS 제스처 뒤로가기 허용
        bounces={false} // 스크롤 바운스 효과 제거 (웹에서 처리하는 게 깔끔함)
        // 성능 최적화
        javaScriptEnabled={true}
        domStorageEnabled={true}
        // 웹뷰가 로딩되기 전 보여줄 컴포넌트 (스켈레톤 등) 설정 가능
        startInLoadingState={true}
        // WebView 메시지 핸들러
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.type === "OPEN_COMMENT_MODAL") {
              setCommentModalData(data.payload);
              setCommentModalVisible(true);
            }
          } catch (error) {
            console.error("Failed to parse message from WebView:", error);
          }
        }}
      />

      {/* 네이티브 댓글 모달 */}
      <Modal
        visible={commentModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            {/* 헤더 */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-base font-semibold text-gray-600">
                댓글 {commentModalData?.totalComments || 0}
              </Text>
              <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                <Text className="text-3xl text-gray-400 leading-7">×</Text>
              </TouchableOpacity>
            </View>

            {/* 댓글 리스트 */}
            <ScrollView className="flex-1 p-4">
              {commentModalData?.comments.map((comment) => (
                <View key={comment.id} className="mb-4">
                  <View className="flex-row gap-3">
                    <Image
                      source={{ uri: comment.authorImage }}
                      className="w-9 h-9 rounded-full"
                    />
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="font-semibold text-sm">
                          {comment.author}
                        </Text>
                        <Text className="text-gray-400 text-xs">
                          {comment.timeAgo}
                        </Text>
                      </View>
                      <Text className="mt-1 text-sm leading-5">
                        {comment.content}
                      </Text>
                    </View>
                  </View>

                  {/* 대댓글 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <View className="ml-12 mt-3">
                      {comment.replies.map((reply) => (
                        <View key={reply.id} className="flex-row gap-3 mb-3">
                          <Image
                            source={{ uri: reply.authorImage }}
                            className="w-8 h-8 rounded-full"
                          />
                          <View className="flex-1">
                            <View className="flex-row items-center gap-2">
                              <Text className="font-semibold text-xs">
                                {reply.author}
                              </Text>
                              <Text className="text-gray-400 text-[11px]">
                                {reply.timeAgo}
                              </Text>
                            </View>
                            <Text className="mt-1 text-xs leading-[18px]">
                              {reply.content}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            {/* 댓글 입력창 */}
            <View className="flex-row p-4 border-t border-gray-200 bg-white gap-2 items-end">
              <TextInput
                className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm max-h-[100px]"
                placeholder="댓글을 작성하세요..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity
                onPress={() => {
                  if (commentText.trim()) {
                    // TODO: 댓글 등록 API 호출
                    console.log("Submit comment:", commentText);
                    setCommentText("");

                    // WebView에 댓글 등록 완료 알림
                    webViewRef.current?.postMessage(
                      JSON.stringify({
                        type: "COMMENT_ADDED",
                        payload: {
                          postId: commentModalData?.postId,
                          comment: commentText,
                        },
                      })
                    );
                  }
                }}
                disabled={!commentText.trim()}
                className={`w-8 h-8 rounded-full justify-center items-center ${
                  commentText.trim() ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <Text className="text-white text-lg font-semibold">↑</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
