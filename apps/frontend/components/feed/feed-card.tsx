"use client"

import Image from "next/image"
import { Heart, MessageCircle, Bookmark, MoreVertical } from "lucide-react"
import { useState } from "react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"

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

  useState(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  })

  return (
    <article className="mb-4 bg-white px-4">
      {/* 이미지 캐러셀 */}
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src={image}
                  alt={`${catName} photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 이미지 카운터 (오른쪽 상단) */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
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
        <div className="absolute right-3 bottom-3 z-10 flex flex-col gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-white">
            <MessageCircle className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Bookmark
              className={`h-5 w-5 ${bookmarked ? "fill-yellow-400 text-yellow-400" : "text-gray-700"}`}
            />
          </button>
        </div>
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
