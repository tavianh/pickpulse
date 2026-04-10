import { useState, useEffect } from 'react'

const SOURCE_COLORS = {
  reddit: '#FF4500',
  youtube: '#E24B4A',
  rotowire: '#378ADD',
}

const LEAN_STYLES = {
  more: { background: '#EAF3DE', color: '#3B6D11' },
  less: { background: '#FAECE7', color: '#993C1D' },
  split: { background: '#F1EFE8', color: '#5F5E5A' },
}

const SPORT_STYLES = {
  NBA: { background: '#E6F1FB', color: '#185FA5' },
  MLB: { background: '#EAF3DE', color: '#3B6D11' },
  NHL: { background: '#EEEDFE', color: '#534AB7' },
  NFL: { background: '#FAECE7', color: '#993C1D' },
  WNBA: { background: '#FAEEDA', color: '#854F0B' },
}

const MOCK_MENTIONS = [
  { name: 'Nikola Jokic', mentions: 34, lean: 'more', sources: ['reddit', 'reddit', 'reddit', 'youtube', 'rotowire'] },
  { name: 'Stephen Curry', mentions: 28, lean: 'more', sources: ['reddit', 'reddit', 'youtube', 'rotowire'] },
  { name: 'Shohei Ohtani', mentions: 21, lean: 'less', sources: ['reddit', 'reddit', 'rotowire'] },
  { name: 'Jayson Tatum', mentions: 17, lean: 'split', sources: ['reddit', 'youtube'] },
  { name: 'Connor McDavid', mentions: 14, lean: 'more', sources: ['reddit', 'reddit', 'rotowire'] },
]

const PREFERRED_STATS = {
  NBA: ['Points', 'Rebounds', 'Assists', '3-Pt Made'],
  MLB: ['Hits+Runs+RBIs', 'Strikeouts', 'Hits', 'Total Bases'],
  NHL: ['Points', 'Shots on Goal', 'Goals'],
  NFL: ['Receiving Yards', 'Rushing Yards', 'Passing Yards', 'Receptions'],
  WNBA: ['Points', 'Rebounds', 'Assists'],
}

function deduplicateProjections(projections) {
  const seen = {}
  projections.forEach(p => {
    const key = `${p.name}-${p.league}`
    const preferred = PREFERRED_STATS[p.league] || []
    if (!seen[key]) {
      seen[key] = p
    } else {
      const currentPref = preferred.indexOf(seen[key].stat)
      const newPref = preferred.indexOf(p.stat)
      if (newPref !== -1 && (currentPref === -1 || newPref < currentPref)) {
        seen[key] = p
      }
    }
  })
  return Object.values(seen)
}

function enrichWithMockMentions(projections) {
  return projections.map(p => {
    const mock = MOCK_MENTIONS.find(m => m.name === p.name)
    return {
      ...p,
      mentions: mock?.mentions || Math.floor(Math.random() * 10) + 1,
      lean: mock?.lean || ['more', 'less', 'split'][Math.floor(Math.random() * 3)],
      sources: mock?.sources || ['reddit'],
    }
  }).sort((a, b) => b.mentions - a.mentions)
}

export default function App() {
  const [activeTab, setActiveTab] = useState('All')
  const [lastUpdated, setLastUpdated] = useState('')
  const [projections, setProjections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/prizepicks')
      const data = await res.json()
      const deduped = deduplicateProjections(data)
      const enriched = enrichWithMockMentions(deduped)
      setProjections(enriched)
      const now = new Date()
      const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      setLastUpdated(`${time} · ${date}`)
    } catch (e) {
      setError('Failed to load data. Pull down to refresh.')
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const tabs = ['All', 'NBA', 'MLB', 'NHL', 'NFL', 'WNBA']
  const sports = ['NBA', 'MLB', 'NHL', 'NFL', 'WNBA']

  const filtered = activeTab === 'All' ? projections : projections.filter(p => p.league === activeTab)
  const topPicks = filtered.slice(0, 5)
  const activeSports = activeTab === 'All'
    ? sports.filter(s => projections.some(p => p.league === s))
    : [activeTab]

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', paddingBottom: 80, fontFamily: 'sans-serif' }}>

      <div style={{ padding: '20px 16px 12px', borderBottom: '0.5px solid #e0e0e0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.3px' }}>PickPulse</span>
          <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#666', border: '0.5px solid #ccc', borderRadius: 20, padding: '5px 10px', cursor: 'pointer', background: '#f5f5f5' }}>
            ↻ Refresh
          </button>
        </div>
        <div style={{ fontSize: 11, color: '#999' }}>
          {loading ? 'Loading...' : `Last updated: ${lastUpdated}`}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '12px 16px', overflowX: 'auto', borderBottom: '0.5px solid #e0e0e0', scrollbarWidth: 'none' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 20, border: '0.5px solid #ccc', cursor: 'pointer', whiteSpace: 'nowrap', background: activeTab === tab ? '#111' : 'transparent', color: activeTab === tab ? '#fff' : '#666' }}>
            {tab}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ padding: 40, textAlign: 'center', color: '#999', fontSize: 14 }}>
          Loading today's lines...
        </div>
      )}

      {error && (
        <div style={{ padding: 40, textAlign: 'center', color: '#cc0000', fontSize: 14 }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{ padding: '16px 16px 0' }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>
              {activeTab === 'All' ? 'Top consensus picks' : `Top ${activeTab} picks`}
            </div>

            {topPicks.map((player, i) => (
              <div key={player.id} style={{ background: '#fff', border: i === 0 ? '0.5px solid #B5D4F4' : '0.5px solid #e8e8e8', borderRadius: 12, padding: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 500, color: i === 0 ? '#378ADD' : '#bbb', minWidth: 22 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{player.stat} · {player.line} line · {player.team}</div>
                  <div style={{ display: 'flex', gap: 3, marginTop: 6 }}>
                    {player.sources.map((src, j) => (
                      <div key={j} style={{ width: 7, height: 7, borderRadius: '50%', background: SOURCE_COLORS[src] }} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, textAlign: 'right' }}>{player.mentions}</div>
                    <div style={{ fontSize: 10, color: '#999' }}>mentions</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 6, ...LEAN_STYLES[player.lean] }}>
                    {player.lean.charAt(0).toUpperCase() + player.lean.slice(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: '0.5px', background: '#e0e0e0', margin: '20px 16px 0' }} />

          <div style={{ padding: '16px 16px 0' }}>
            {activeSports.map(sport => {
              const sportPicks = projections.filter(p => p.league === sport).slice(0, 6)
              if (!sportPicks.length) return null
              return (
                <div key={sport} style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{sport}</div>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 6, ...SPORT_STYLES[sport] }}>
                      {sportPicks.length} picks
                    </span>
                  </div>
                  {sportPicks.map(player => (
                    <div key={player.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid #e8e8e8' }}>
                      <div>
                        <div style={{ fontSize: 14 }}>{player.name}</div>
                        <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{player.stat} · {player.line} line</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 6, ...LEAN_STYLES[player.lean] }}>
                          {player.lean.charAt(0).toUpperCase() + player.lean.slice(1)}
                        </div>
                        <div style={{ fontSize: 12, color: '#999' }}>{player.mentions} mentions</div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          <div style={{ height: '0.5px', background: '#e0e0e0', margin: '8px 16px 0' }} />
          <div style={{ display: 'flex', gap: 14, padding: '12px 16px', flexWrap: 'wrap' }}>
            {Object.entries(SOURCE_COLORS).map(([src, color]) => (
              <div key={src} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#999' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
                {src.charAt(0).toUpperCase() + src.slice(1)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}