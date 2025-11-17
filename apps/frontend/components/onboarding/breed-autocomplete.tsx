"use client"

import React, { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// TODO: 실제 품종 데이터는 API에서 가져와야 함
const BREEDS = [
  "페르시안",
  "샴",
  "러시안 블루",
  "브리티시 쇼트헤어",
  "메인 쿤",
  "스코티시 폴드",
  "아메리칸 쇼트헤어",
  "노르웨이 숲",
  "터키시 앙고라",
  "벵골",
  "아비시니안",
  "스핑크스",
  "먼치킨",
  "레그돌",
  "아메리칸 컬",
  "맹크스",
  "시베리안",
  "라가머핀",
  "히말라얀",
  "터키시 반",
  "코리안 쇼트헤어",
  "터키시 앙고라",
  "아메리칸 밥테일",
  "이집션 마우",
  "오리엔탈 쇼트헤어",
  "토이거",
  "사바나",
  "차우시",
  "오시캣",
]

interface BreedAutocompleteProps {
  value?: string
  onChange: (breed: string | null) => void
  placeholder?: string
  className?: string
}

export function BreedAutocomplete({
  value,
  onChange,
  placeholder = "품종 검색",
  className,
}: BreedAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState(value || "")
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredBreeds = searchTerm
    ? BREEDS.filter((breed) => breed.toLowerCase().includes(searchTerm.toLowerCase()))
    : []

  useEffect(() => {
    if (value !== searchTerm) {
      setSearchTerm(value || "")
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    setIsOpen(true)
    if (!newValue) {
      onChange(null)
    }
  }

  const handleSelectBreed = (breed: string) => {
    setSearchTerm(breed)
    onChange(breed)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleFocus = () => {
    if (filteredBreeds.length > 0) {
      setIsOpen(true)
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Input
        ref={inputRef}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="h-12"
      />
      {isOpen && filteredBreeds.length > 0 && (
        <div className="bg-chips-background absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded p-1.5">
          {filteredBreeds.map((breed, index) => (
            <button
              key={`${breed}-${index}`}
              type="button"
              onClick={() => handleSelectBreed(breed)}
              className="hover:bg-primary w-full rounded px-4 py-3 text-left text-sm font-normal transition-colors"
            >
              {breed}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
