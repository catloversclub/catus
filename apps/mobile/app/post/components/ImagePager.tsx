import { useRef, useState } from "react";
import { Pressable, View, Text, TouchableOpacity } from "react-native";
import PagerView from "react-native-pager-view";
import { Image } from "expo-image";

interface ImagePagerProps {
  images: string[];
  height?: number;
  onImagePress?: (uri: string, index: number) => void;
  showEditHint?: boolean;
}

export default function ImagePager({
  images,
  height = 252,
  onImagePress,
  showEditHint = false,
}: ImagePagerProps) {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  if (images.length === 0) return null;

  return (
    <View className="gap-3">
      <PagerView
        ref={pagerRef}
        style={{ height }}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {images.map((uri, index) => (
          <Pressable
            key={index}
            onPress={() => onImagePress?.(uri, index)}
            disabled={!onImagePress}
          >
            <View className="items-center justify-center relative">
              <Image
                source={{ uri }}
                contentFit="contain"
                style={{
                  width: "100%",
                  height,
                  borderRadius: 8,
                }}
              />
              {showEditHint && (
                <View className="absolute bottom-0 right-8 bg-black/50 p-2 rounded">
                  <Text className="text-white text-xs">터치하여 편집</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </PagerView>

      {images.length > 1 && (
        <View className="flex-row justify-center items-center gap-1.5">
          {images.map((_, pageIndex) => (
            <TouchableOpacity
              key={pageIndex}
              className={`w-2.5 h-2.5 rounded-full ${
                currentPage === pageIndex
                  ? "bg-light-iconAccent dark:bg-dark-iconAccent w-3 h-3"
                  : "bg-light-iconMinor dark:bg-dark-iconMinor"
              }`}
              onPress={() => pagerRef.current?.setPage(pageIndex)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
