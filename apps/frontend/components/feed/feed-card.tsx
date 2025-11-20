"use client"

import Image from "next/image"
import { MoreVertical } from "lucide-react"
import { useState, useEffect } from "react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { FeedActionButtons } from "./feed-action-buttons"

interface FeedCardProps {
  id: string
  ownerName: string
  ownerImage: string
  catName: string
  images: string[]
  daysAgo: string
  isLiked?: boolean
  isBookmarked?: boolean
}

export function FeedCard({
  ownerName,
  ownerImage,
  catName,
  images,
  daysAgo,
  isLiked = false,
  isBookmarked = false,
}: FeedCardProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [liked, setLiked] = useState(isLiked)
  const [bookmarked, setBookmarked] = useState(isBookmarked)

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <article className="mb-4 bg-white px-4">
      {/* 이미지 캐러셀 */}
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src={image}
                  alt={`${catName} photo ${index + 1}`}
                  width={800}
                  height={800}
                  className="h-auto w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 이미지 카운터 (오른쪽 상단) */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 z-10 rounded-full bg-black/20 px-2 py-1 text-xs font-medium text-white">
            {current + 1} / {images.length}
          </div>
        )}

        {/* 이미지 네비게이션 도트 (하단 중앙) */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  index === current ? "bg-yellow-400" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* 액션 버튼들 (이미지 오른쪽 하단) */}
        <FeedActionButtons
          liked={liked}
          bookmarked={bookmarked}
          onLikeToggle={() => setLiked(!liked)}
          onBookmarkToggle={() => setBookmarked(!bookmarked)}
        />
      </Carousel>

      {/* 프로필 정보 (이미지 하단) */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Image
            src={ownerImage}
            alt={ownerName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{catName}</span>
            <span className="text-xs text-gray-500">{daysAgo}</span>
          </div>
        </div>
        <button className="p-2">
          <MoreVertical className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </article>
  )
}
