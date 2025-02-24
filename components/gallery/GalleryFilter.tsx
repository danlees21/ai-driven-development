"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, RotateCcw } from "lucide-react"
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { DateRange } from "@/types/gallery"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// dayjs 설정
dayjs.locale('ko')

interface IGalleryFilter {
  selectedCategory: string;
  dateRange: DateRange | undefined;
  sortBy: 'latest' | 'oldest' | 'name';
  onCategoryChange: (category: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '과거순' },
  { value: 'name', label: '이름순' },
]

export function GalleryFilter({
  selectedCategory,
  dateRange,
  sortBy,
  onCategoryChange,
  onDateRangeChange,
  onSortChange,
  onReset,
}: IGalleryFilter) {
  const handleStartDateSelect = (date: Date | undefined) => {
    onDateRangeChange({
      from: date || null,
      to: dateRange?.to || null
    })
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    onDateRangeChange({
      from: dateRange?.from || null,
      to: date || null
    })
  }

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1 flex items-center gap-4">
        <div className="flex items-center gap-2">
          {/* 시작일 선택 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="start-date">시작일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="start-date"
                  variant="outline"
                  className={`w-[140px] justify-start text-left font-normal ${
                    dateRange?.from ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dayjs(dateRange.from).format('YYYY.MM.DD')
                  ) : (
                    "시작일 선택"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange?.from || undefined}
                  onSelect={handleStartDateSelect}
                  initialFocus
                  disabled={(date) => 
                    dateRange?.to ? date > dateRange.to : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* 종료일 선택 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="end-date">종료일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="end-date"
                  variant="outline"
                  className={`w-[140px] justify-start text-left font-normal ${
                    dateRange?.to ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.to ? (
                    dayjs(dateRange.to).format('YYYY.MM.DD')
                  ) : (
                    "종료일 선택"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange?.to || undefined}
                  onSelect={handleEndDateSelect}
                  initialFocus
                  disabled={(date) => 
                    dateRange?.from ? date < dateRange.from : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="shrink-0 gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>초기화</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>모든 필터 초기화</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
} 