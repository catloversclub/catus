"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface DatePickerSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value?: string // YYYY-MM-DD 형식
  onChange: (date: string | null) => void
}

const ITEM_HEIGHT = 26
const VISIBLE_ITEMS = 5
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS

export function DatePickerSheet({ open, onOpenChange, value, onChange }: DatePickerSheetProps) {
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [day, setDay] = useState<number>(new Date().getDate())
  
  const yearRef = useRef<HTMLDivElement>(null)
  const monthRef = useRef<HTMLDivElement>(null)
  const dayRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)

  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split("-").map(Number)
      if (y && m && d) {
        setYear(y)
        setMonth(m)
        setDay(d)
      }
    }
  }, [value])

  useEffect(() => {
    if (open) {
      // 시트가 열릴 때만 스크롤을 선택된 항목으로 이동
      isScrollingRef.current = true
      setTimeout(() => {
        const currentYear = new Date().getFullYear()
        // 더미 항목 2개를 고려하여 인덱스 계산
        // 선택된 항목을 중앙에 오려면 scrollTop이 (인덱스 - 2) * ITEM_HEIGHT가 되어야 함
        const yearIndex = currentYear - year + 2 // 배열 내 실제 인덱스
        if (yearRef.current) {
          yearRef.current.scrollTop = (yearIndex - 2) * ITEM_HEIGHT
        }
        // 월은 1부터 시작하므로 인덱스는 (month - 1) + 2 = month + 1
        // 스크롤 위치는 (month + 1 - 2) * ITEM_HEIGHT = (month - 1) * ITEM_HEIGHT
        if (monthRef.current) {
          monthRef.current.scrollTop = (month - 1) * ITEM_HEIGHT
        }
        // 일도 1부터 시작하므로 인덱스는 (day - 1) + 2 = day + 1
        // 스크롤 위치는 (day + 1 - 2) * ITEM_HEIGHT = (day - 1) * ITEM_HEIGHT
        if (dayRef.current) {
          dayRef.current.scrollTop = (day - 1) * ITEM_HEIGHT
        }
        setTimeout(() => {
          isScrollingRef.current = false
        }, 200)
      }, 100)
    }
  }, [open, year, month, day]) // open과 선택된 값이 변경될 때 실행

  const currentYear = new Date().getFullYear()
  // 앞뒤에 더미 항목을 추가하여 처음/끝 항목도 중앙에 올 수 있도록
  const years = [
    null, null, // 앞쪽 더미 2개
    ...Array.from({ length: 30 }, (_, i) => currentYear - i),
    null, null // 뒤쪽 더미 2개
  ]
  const months = [
    null, null, // 앞쪽 더미 2개
    ...Array.from({ length: 12 }, (_, i) => i + 1),
    null, null // 뒤쪽 더미 2개
  ]
  const daysInMonth = new Date(year, month, 0).getDate()
  const days = [
    null, null, // 앞쪽 더미 2개
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    null, null // 뒤쪽 더미 2개
  ]

  // 일이 변경될 때 유효한 날짜인지 확인
  useEffect(() => {
    const maxDay = new Date(year, month, 0).getDate()
    if (day > maxDay) {
      setDay(maxDay)
    }
  }, [year, month, day])

  // 현재 선택된 날짜를 문자열로 변환
  const getDateString = useCallback(() => {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }, [year, month, day])

  // 날짜 변경 시 form에 즉시 반영 (value와 다를 때만 호출)
  useEffect(() => {
    if (open) {
      const dateStr = getDateString()
      // 현재 value와 다를 때만 onChange 호출하여 무한 루프 방지
      if (dateStr !== value) {
        onChange(dateStr)
      }
    }
  }, [year, month, day, getDateString, onChange, open, value])

  const handleScroll = (type: "year" | "month" | "day", scrollTop: number) => {
    // 프로그래밍 방식으로 스크롤을 설정하는 중이면 무시
    if (isScrollingRef.current) return
    
    // scrollTop이 0이면 인덱스 2 (중앙), scrollTop이 ITEM_HEIGHT * 2면 인덱스 4
    // 따라서 인덱스 = (scrollTop / ITEM_HEIGHT) + 2
    const index = Math.round(scrollTop / ITEM_HEIGHT) + 2
    if (type === "year") {
      const newYear = years[index]
      // 현재 값과 다를 때만 업데이트
      if (newYear !== null && newYear !== undefined && newYear !== year) setYear(newYear)
    } else if (type === "month") {
      const newMonth = months[index]
      // 현재 값과 다를 때만 업데이트
      if (newMonth !== null && newMonth !== undefined && newMonth !== month) setMonth(newMonth)
    } else {
      const newDay = days[index]
      // 현재 값과 다를 때만 업데이트
      if (newDay !== null && newDay !== undefined && newDay !== day) setDay(newDay)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[220px] p-0">
        <SheetHeader className="px-4 pt-4 pb-2">
          <SheetTitle></SheetTitle>
        </SheetHeader>
        <div className="relative overflow-hidden" style={{ height: `${PICKER_HEIGHT}px` }}>
          {/* 선택 표시 오버레이 */}
          <div
            className="absolute left-0 right-0 pointer-events-none z-10"
            style={{ 
              top: `${ITEM_HEIGHT * 2}px`,
              height: `${ITEM_HEIGHT}px`
            }}
          />
          
          <div className="flex h-full">
            {/* Year Picker */}
            <div
              ref={yearRef}
              className="flex-1 overflow-y-auto scroll-smooth snap-y snap-mandatory scrollbar-hide"
              style={{ scrollSnapType: "y mandatory", height: `${PICKER_HEIGHT}px` }}
              onScroll={(e) => handleScroll("year", e.currentTarget.scrollTop)}
            >
              <div>
                {years.map((y, index) => (
                  <div
                    key={y !== null ? y : `year-dummy-${index}`}
                    className="h-[26px] flex items-center justify-center text-sm snap-start"
                    onClick={() => {
                      if (y === null || y === undefined || y === year) return
                      isScrollingRef.current = true
                      // 선택된 항목을 중앙에 오려면 scrollTop이 (인덱스 - 2) * ITEM_HEIGHT
                      yearRef.current?.scrollTo({ top: (index - 2) * ITEM_HEIGHT, behavior: "smooth" })
                      setYear(y)
                      setTimeout(() => {
                        isScrollingRef.current = false
                      }, 300)
                    }}
                  >
                    {y !== null && y !== undefined && (
                      <span className={cn(
                        "transition-all",
                        year === y ? "text-text-primary font-semibold text-base" : "text-text-primary"
                      )}>
                        {y}년
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Month Picker */}
            <div
              ref={monthRef}
              className="flex-1 overflow-y-auto scroll-smooth snap-y snap-mandatory scrollbar-hide"
              style={{ scrollSnapType: "y mandatory", height: `${PICKER_HEIGHT}px` }}
              onScroll={(e) => handleScroll("month", e.currentTarget.scrollTop)}
            >
              <div>
                {months.map((m, index) => (
                  <div
                    key={m !== null ? m : `month-dummy-${index}`}
                    className="h-[26px] flex items-center justify-center text-base snap-start"
                    onClick={() => {
                      if (m === null || m === undefined || m === month) return
                      isScrollingRef.current = true
                      // 선택된 항목을 중앙에 오려면 scrollTop이 (인덱스 - 2) * ITEM_HEIGHT
                      monthRef.current?.scrollTo({ top: (index - 2) * ITEM_HEIGHT, behavior: "smooth" })
                      setMonth(m)
                      setTimeout(() => {
                        isScrollingRef.current = false
                      }, 300)
                    }}
                  >
                    {m !== null && m !== undefined && (
                      <span className={cn(
                        "transition-all",
                        month === m ? "text-text-primary font-semibold text-base" : "text-text-primary"
                      )}>
                        {m}월
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Day Picker */}
            <div
              ref={dayRef}
              className="flex-1 overflow-y-auto scroll-smooth snap-y snap-mandatory scrollbar-hide"
              style={{ scrollSnapType: "y mandatory", height: `${PICKER_HEIGHT}px` }}
              onScroll={(e) => handleScroll("day", e.currentTarget.scrollTop)}
            >
              <div>
                {days.map((d, index) => (
                  <div
                    key={d !== null ? d : `day-dummy-${index}`}
                    className="h-[26px] flex items-center justify-center text-base snap-start"
                    onClick={() => {
                      if (d === null || d === undefined || d === day) return
                      isScrollingRef.current = true
                      // 선택된 항목을 중앙에 오려면 scrollTop이 (인덱스 - 2) * ITEM_HEIGHT
                      dayRef.current?.scrollTo({ top: (index - 2) * ITEM_HEIGHT, behavior: "smooth" })
                      setDay(d)
                      setTimeout(() => {
                        isScrollingRef.current = false
                      }, 300)
                    }}
                  >
                    {d !== null && d !== undefined && (
                      <span className={cn(
                        "transition-all",
                        day === d ? "text-text-primary font-semibold text-base" : "text-text-primary"
                      )}>
                        {d}일
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

