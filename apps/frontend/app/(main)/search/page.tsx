"use client"

import { useState } from "react"
import { ArrowLeft, Search as SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Search() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [submittedQuery, setSubmittedQuery] = useState("")
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)

  // 임시 인기 검색어 데이터
  const popularSearches = [
    "이나루니",
    "이나나시간",
    "이에러건 반무양",
    "이에러건 소트웨어",
    "이에러건 차이어에씨",
  ]

  // 임시 최근 검색어 데이터
  const recentKeywords = ["단모", "단모", "단모", "단모", "단모"]

  // 임시 검색 결과 이미지
  const searchResults = [
    "/images/cat/placeholder-cat-1.png",
    "/images/cat/placeholder-cat-2.png",
    "/images/cat/placeholder-cat-1.png",
    "/images/cat/placeholder-cat-2.png",
    "/images/cat/placeholder-cat-1.png",
    "/images/cat/placeholder-cat-2.png",
    "/images/cat/placeholder-cat-1.png",
    "/images/cat/placeholder-cat-2.png",
  ]

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]
    )
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 검색창 */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2">
          <SearchIcon className="text-text-tertiary h-5 w-5" />
          <input
            type="text"
            placeholder="어떤 고양이를 찾아볼까요?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
            className="bg-secondary placeholder:text-text-tertiary flex-1 text-sm outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {submittedQuery ? (
          /* 검색 결과 - 그리드 레이아웃 */
          <div className="grid grid-cols-2 gap-1">
            {searchResults.map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden">
                <Image
                  src={image}
                  alt={`Search result ${index + 1}`}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : isFocused || searchQuery ? (
          /* 검색창 포커스 시 또는 타이핑 중 - 인기 검색어만 표시 */
          <div>
            <h2 className="mb-3 flex items-center gap-1 text-sm font-semibold">
              인기검색이 고양이들 🔥
            </h2>
            <div className="space-y-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onMouseDown={() => {
                    setSearchQuery(search)
                    setSubmittedQuery(search)
                  }}
                  className="text-text-primary block w-full py-2 text-left text-sm hover:bg-gray-50"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* 검색 전 화면 */
          <div className="space-y-6">
            {/* 인기 검색어 */}
            <div>
              <h2 className="mb-3 flex items-center gap-1 text-sm font-semibold">
                인기검색이 고양이들 🔥
              </h2>
              <div className="space-y-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(search)}
                    className="text-text-primary block w-full py-2 text-left text-sm hover:bg-gray-50"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* 최근 검색어 */}
            <div>
              <h2 className="mb-3 text-sm font-semibold">최근 검색어</h2>
              <div className="flex flex-wrap gap-2">
                {recentKeywords.map((keyword, index) => (
                  <button
                    key={index}
                    onClick={() => handleKeywordToggle(keyword)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      selectedKeywords.includes(keyword)
                        ? "border-primary bg-primary text-white"
                        : "border-border text-text-primary bg-white hover:bg-gray-50"
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
