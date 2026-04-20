import { useEffect, useRef, useState } from 'react'

function DateScroller({ selectedDate, onDateChange }) {
  const scrollRef = useRef(null)
  const [dates, setDates] = useState([])

  useEffect(() => {
    const generatedDates = []
    const today = new Date()

    for (let i = -30; i <= 90; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      generatedDates.push(date)
    }

    setDates(generatedDates)
  }, [])

  useEffect(() => {
    // Scroll to today when component mounts
    const todayButton = scrollRef.current?.querySelector('[data-today="true"]')
    if (todayButton) {
      todayButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [dates])

  const isDateSelected = (date) => {
    const selected = new Date(selectedDate)
    selected.setHours(0, 0, 0, 0)
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    return selected.getTime() === compareDate.getTime()
  }

  const isToday = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    return today.getTime() === compareDate.getTime()
  }

  return (
    <div className="w-full h-21 bg-neutral-950 flex items-center overflow-x-auto" ref={scrollRef}>
      <div className="flex gap-3 px-1">
        {dates.map((date, index) => {
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
          const dateNum = date.getDate()
          const isSelected = isDateSelected(date)
          const isTodayDate = isToday(date)

          return (
            <button
              key={index}
              data-today={isTodayDate}
              onClick={() => onDateChange(date)}
              className={`flex flex-col items-center justify-between min-w-14 h-20 rounded-[18px] cursor-pointer ${
                isSelected
                  ? 'bg-[#8338EC] text-white shadow-lg'
                  : 'bg-neutral-900 text-neutral-300 hover:outline-[#7C3AED] hover:outline-2'
              }`}
            >
              <span className="text-xs leading-none font-medium w-full h-6 flex justify-center items-center">{dayName}</span>
              <span className={`text-lg leading-none font-medium w-full h-14 rounded-[18px] flex justify-center items-center ${
                isSelected
                  ? 'bg-neutral-900/40'
                  : 'bg-neutral-800'
              } ${
                isTodayDate && !isSelected ? 'text-[#8338EC]' : ''
              }`}>{dateNum}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default DateScroller
