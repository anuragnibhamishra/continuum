import { useEffect, useState } from 'react'
import { IconMenu2 } from '@tabler/icons-react'

function DateNavigator({ selectedDate, onMenuClick }) {
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
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100 md:hidden"
          aria-label="Open navigation menu"
        >
          <IconMenu2 stroke={1.8} size={22} />
        </button>
        <h2 className="text-2xl font-bold text-neutral-100">{dateLabel}</h2>
      </div>
    </div>
  )
}

export default DateNavigator
