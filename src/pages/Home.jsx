import { useEffect, useMemo, useState } from 'react'

const months = [
  { name: 'October', short: 'OCT', days: 31 },
  { name: 'November', short: 'NOV', days: 30 },
  { name: 'December', short: 'DEC', days: 31 },
]

const areas = [
  { id: 'gym', icon: '✦', label: 'Gym', color: 'orange', tasks: ['Morning workout', 'Protein goal', '10k steps'] },
  { id: 'work', icon: '⌘', label: 'Work', color: 'blue', tasks: ['Deep work block', 'Priority task', 'Daily review'] },
  { id: 'dsa', icon: '◈', label: 'DSA TUF+', color: 'purple', tasks: ['Learn a pattern', 'Solve 2 problems', 'Review notes'] },
]

const pad = (value) => String(value).padStart(2, '0')
const dayKey = (month, day) => `2026-${pad(month + 10)}-${pad(day)}`

function loadSaved() {
  try { return JSON.parse(localStorage.getItem('winter-arc-progress')) || { checks: {}, notes: {} } } catch { return { checks: {}, notes: {} } }
}

function Home() {
  const [activeMonth, setActiveMonth] = useState(0)
  const [selectedDay, setSelectedDay] = useState(5)
  const [activeArea, setActiveArea] = useState('gym')
  const [data, setData] = useState(loadSaved)
  const selectedKey = dayKey(activeMonth, selectedDay)
  const selectedMonth = months[activeMonth]
  const selectedArea = areas.find((area) => area.id === activeArea)

  useEffect(() => { localStorage.setItem('winter-arc-progress', JSON.stringify(data)) }, [data])

  const completion = useMemo(() => {
    const done = Object.values(data.checks).filter(Boolean).length
    return Math.round((done / (months.reduce((sum, month) => sum + month.days, 0) * 9)) * 100)
  }, [data.checks])
  const dayCompletion = (monthIndex, day) => {
    const key = dayKey(monthIndex, day)
    return areas.reduce((count, area) => count + area.tasks.filter((_, index) => data.checks[`${key}-${area.id}-${index}`]).length, 0)
  }
  const toggleTask = (taskIndex) => {
    const key = `${selectedKey}-${activeArea}-${taskIndex}`
    setData((current) => ({ ...current, checks: { ...current.checks, [key]: !current.checks[key] } }))
  }
  const updateNote = (value) => setData((current) => ({ ...current, notes: { ...current.notes, [selectedKey]: value } }))

  return <main className="arc-app">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">W</span><span>WINTER ARC</span></div>
      <div className="season-label">YOUR 90 DAY SEASON</div>
      <nav className="month-nav" aria-label="Timeline months">
        {months.map((month, index) => <button className={activeMonth === index ? 'month-link active' : 'month-link'} key={month.name} onClick={() => { setActiveMonth(index); setSelectedDay(1) }}><span className="month-num">0{index + 1}</span><span>{month.name}</span></button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="season-progress"><div className="progress-ring" style={{ '--progress': `${completion}%` }}><span>{completion}%</span></div><div><small>SEASON PROGRESS</small><strong>Build the version<br />you promised.</strong></div></div>
        <p>Oct 1 — Dec 31<br />91 intentional days.</p>
      </div>
    </aside>

    <section className="workspace">
      <header className="topbar"><div><p className="eyebrow">THE LONG GAME, DAY BY DAY</p><h1>Winter Arc <span>2026</span></h1></div><div className="today-badge"><span className="pulse" /> DAY {String(activeMonth * 30 + selectedDay).padStart(2, '0')} <small>OF 91</small></div></header>
      <section className="timeline-section">
        <div className="section-heading"><div><p className="eyebrow">90 DAY TIMELINE</p><h2>{selectedMonth.name} <span>2026</span></h2></div><p className="caption">Select a day to plan & reflect</p></div>
        <div className="calendar-wrap"><div className="weekdays">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={`${d}-${i}`}>{d}</span>)}</div><div className="calendar-grid">
          {Array.from({ length: activeMonth === 0 ? 3 : activeMonth === 1 ? 6 : 1 }).map((_, i) => <i key={`blank-${i}`} />)}
          {Array.from({ length: selectedMonth.days }, (_, index) => { const day = index + 1; const complete = dayCompletion(activeMonth, day); const isActive = selectedDay === day; return <button key={day} className={`day-cell ${isActive ? 'selected' : ''} ${complete === 9 ? 'perfect' : ''}`} onClick={() => setSelectedDay(day)}><b>{pad(day)}</b>{complete > 0 && <span className="day-dots">{Array.from({ length: Math.min(complete, 3) }).map((_, i) => <em key={i} />)}</span>}</button> })}
        </div></div>
        <div className="calendar-legend"><span><i className="legend-dot orange" /> Gym</span><span><i className="legend-dot blue" /> Work</span><span><i className="legend-dot purple" /> DSA</span><span><i className="legend-dot outlined" /> Completed day</span></div>
      </section>
      <section className="daily-section">
        <div className="daily-title"><div><p className="eyebrow">DAILY COMMAND CENTER</p><h2>{selectedMonth.name} {selectedDay}<sup>{selectedDay === 1 ? 'st' : selectedDay === 2 ? 'nd' : selectedDay === 3 ? 'rd' : 'th'}</sup></h2></div><span className="daily-score">{dayCompletion(activeMonth, selectedDay)} <small>/ 9 COMPLETE</small></span></div>
        <div className="daily-grid"><div className="focus-card"><div className="focus-tabs">{areas.map((area) => <button key={area.id} className={activeArea === area.id ? `area-tab ${area.color} active` : `area-tab ${area.color}`} onClick={() => setActiveArea(area.id)}><span>{area.icon}</span>{area.label}</button>)}</div><div className={`area-panel ${selectedArea.color}`}>
          <div className="panel-heading"><div><span className="panel-icon">{selectedArea.icon}</span><div><p className="eyebrow">TODAY'S {selectedArea.label.toUpperCase()}</p><h3>{selectedArea.id === 'gym' ? 'Show up. Get stronger.' : selectedArea.id === 'work' ? 'Make meaningful progress.' : 'One pattern at a time.'}</h3></div></div><span className="task-count">{selectedArea.tasks.filter((_, i) => data.checks[`${selectedKey}-${selectedArea.id}-${i}`]).length}/3</span></div>
          <div className="tasks">{selectedArea.tasks.map((task, index) => { const id = `${selectedKey}-${selectedArea.id}-${index}`; return <button key={task} className={data.checks[id] ? 'task done' : 'task'} onClick={() => toggleTask(index)}><span className="checkbox">{data.checks[id] && '✓'}</span><span>{task}</span></button> })}</div><button className="add-task">+ Add a task</button>
        </div></div>
          <aside className="notepad"><div className="notepad-head"><div><p className="eyebrow">DAILY NOTEPAD</p><h3>What moved today?</h3></div><span>✎</span></div><textarea value={data.notes[selectedKey] || ''} onChange={(event) => updateNote(event.target.value)} placeholder="What happened today? What did you focus on? Capture the win, the lesson, or the thing to improve tomorrow..." /><div className="notepad-foot"><span>{(data.notes[selectedKey] || '').length} characters</span><button onClick={() => updateNote(data.notes[selectedKey] || '')}>Saved locally</button></div></aside>
        </div>
      </section>
    </section>
  </main>
}

export default Home
