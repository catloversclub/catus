// components/OnboardingWrapper.tsx
import React from "react"
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { cn } from "@/lib/utils" // 기존에 쓰시던 tailwind merge 함수

interface Props {
  step: number
  totalSteps?: number
  title: string
  children: React.ReactNode
  onNext: () => void
  isNextEnabled: boolean
  nextButtonText?: string
}

export default function OnboardingWrapper({
  step,
  totalSteps = 6,
  title,
  children,
  onNext,
  isNextEnabled,
  nextButtonText = "다음으로",
}: Props) {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-semantic-bg-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* 헤더 & 뒤로가기 */}
        <View className="px-4 py-2">
          <TouchableOpacity onPress={() => router.back()} className="py-2">
            <Text className="text-xl">←</Text> {/* SVG 아이콘으로 교체하세요 */}
          </TouchableOpacity>
        </View>

        {/* 프로그레스 바 */}
        <View className="mb-8 flex-row gap-1 px-4">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <View
              key={idx}
              className={cn(
                "h-1 flex-1 rounded-full",
                idx < step ? "bg-semantic-button-primary-background" : "bg-semantic-border-primary",
              )}
            />
          ))}
        </View>

        {/* 타이틀 & 컨텐츠 */}
        <View className="flex-1 px-4">
          <Text className="text-title1 mb-8">{title}</Text>
          {children}
        </View>

        {/* 하단 버튼 */}
        <View className="bg-semantic-bg-primary px-4 pb-6 pt-2">
          <TouchableOpacity
            onPress={onNext}
            disabled={!isNextEnabled}
            className={cn(
              "w-full items-center rounded-xl py-4",
              isNextEnabled
                ? "bg-semantic-button-primary-background"
                : "bg-semantic-button-primary-background-disabled",
            )}
          >
            <Text
              className={cn(
                "text-body1 font-bold",
                isNextEnabled ? "text-black" : "text-semantic-text-tertiary",
              )}
            >
              {nextButtonText}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
