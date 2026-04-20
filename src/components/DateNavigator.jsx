import { useEffect, useState } from 'react'

function DateNavigator({ selectedDate }) {
  const [dateLabel, setDateLabel] = useState('Today')

  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const selected = new Date(selectedDate)
    selected.setHours(0, 0, 0, 0)

    const diffTime = selected - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      setDateLabel('Today')
    } else if (diffDays === -1) {
      setDateLabel('Yesterday')
    } else if (diffDays === 1) {
      setDateLabel('Tomorrow')
    } else {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      setDateLabel(selected.toLocaleDateString('en-US', options))
    }
  }, [selectedDate])

  return (
    <div className="w-full bg-neutral-950 flex items-center">
      <h2 className="text-2xl font-bold text-neutral-100">{dateLabel}</h2>
    </div>
  )
}

export default DateNavigator
