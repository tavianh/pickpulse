import { useState } from 'react'

const MOCK_DATA = [
  { rank: 1, name: 'Nikola Jokic', sport: 'NBA', stat: 'PTS', line: 27.5, matchup: 'DEN vs LAL', mentions: 34, lean: 'more', sources: ['reddit', 'reddit', 'reddit', 'youtube', 'rotowire'] },
  { rank: 2, name: 'Stephen Curry', sport: 'NBA', stat: '3PM', line: 4.5, matchup: 'GSW vs LAL', mentions: 28, lean: 'more', sources: ['reddit', 'reddit', 'youtube', 'rotowire'] },
  { rank: 3, name: 'Shohei Ohtani', sport: 'MLB', stat: 'TB', line: 1.5, matchup: 'LAD vs SD', mentions: 21, lean: 'less', sources: ['reddit', 'reddit', 'rotowire'] },
  { rank: 4, name: 'Jayson Tatum', sport: 'NBA', stat: 'PTS', line: 29.5, matchup: 'BOS vs NYK', mentions: 17, lean: 'split', sources: ['reddit', 'youtube'] },
  { rank: 5, name: 'Connor McDavid', sport: 'NHL', stat: 'PTS', line: 1.5, matchup: 'EDM vs CGY', mentions: 14, lean: 'more', sources: ['reddit', 'reddit', 'rotowire'] },
  { rank: 6, name: 'Luka Doncic', sport: 'NBA', stat: 'AST', line: 8.5, matchup: 'DAL vs PHX', mentions: 12, lean: 'more', sources: ['reddit', 'youtube'] },
  { rank: 7, name: 'Gerrit Cole', sport: 'MLB', stat: 'SO', line: 7.5, matchup: 'NYY vs BOS', mentions: 11, lean: 'more', sources: ['reddit', 'rotowire'] },
  { rank: 8, name: 'Anthony Davis', sport: 'NBA', stat: 'REB', line: 11.5, matchup: 'LAL vs DEN', mentions: 9, lean: 'more', sources: ['reddit', 'reddit'] },
  { rank: 9, name: 'David Pastrnak', sport: 'NHL', stat: 'SOG', line: 3.5, matchup: 'BOS vs TOR', mentions: 9, lean: 'more', sources: ['reddit', 'rotowire'] },
  { rank: 10, name: 'Tyrese Haliburton', sport: 'NBA', stat: 'PTS', line: 18.5, matchup: 'IND vs MIL', mentions: 8, lean: 'less', sources: ['reddit'] },
  { rank: 11, name: 'Juan Soto', sport: 'MLB', stat: 'TB', line: 1.5, matchup: 'NYY vs BOS', mentions: 7, lean: 'split', sources: ['reddit', 'youtube'] },
  { rank: 12, name: 'Nathan MacKinnon', sport: 'NHL', stat: 'PTS', line: 1.5, matchup: 'COL vs VGK', mentions: 6, lean: 'more', sources: ['reddit', 'rotowire'] },
]

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
}

export default function App() {
  const [activeTab, setActiveTab] = useState('All')
  const [lastUpdated, setLastUpdated] = useState('7:42 AM · Apr 10')

  const tabs = ['All', 'NBA', 'MLB', 'NHL']
  const sports = ['NBA', 'MLB', 'NHL']

  const filtered = activeTab === 'All' ? MOCK_DATA : MOCK_DATA.filter(p => p.sport === activeTab)
  const topPicks = filtered.slice(0, 5)

  function handleRefresh() {
    const now = new Date()
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    setLastUpdated(`${time} · ${date}`)
  }

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', paddingBottom: 80, fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ padding: '20px 16px 12px', borderBottom: '0.5px solid #e0e0e0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.3px' }}>PickPulse</span>
          <button onClick={handleRefresh} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#666', border: '0.5px solid #ccc', borderRadius: 20, padding: '5px 10px', cursor: 'pointer', background: '#f5f5f5' }}>
            ↻ Refresh
          </button>
        </div>
        <div style={{ fontSize: 11, color: '#999' }}>Last updated: {lastUpdated}</div>
      </div>

      {/* Sport Tabs */}
      <div style={{ display: 'flex', gap: 6, padding: '12px 16px', overflowX: 'auto', borderBottom: '0.5px solid #e0e0e0' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 20, border: '0.5px solid #ccc', cursor: 'pointer', whiteSpace: 'nowrap', background: activeTab === tab ? '#111' : 'transparent', color: activeTab === tab ? '#fff' : '#666' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Top Picks */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>
          {activeTab === 'All' ? 'Top consensus picks' : `Top ${activeTab} picks`}
        </div>

        {topPicks.map((player, i) => (
          <div key={player.name} style={{ background: '#fff', border: i === 0 ? '0.5px solid #B5D4F4' : '0.5px solid #e8e8e8', borderRadius: 12, padding: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 500, color: i === 0 ? '#378ADD' : '#bbb', minWidth: 22 }}>{i + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{player.stat} · {player.line} line · {player.matchup}</div>
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

      {/* By Sport Breakdown */}
      <div style={{ height: '0.5px', background: '#e0e0e0', margin: '20px 16px 0' }} />
      <div style={{ padding: '16px 16px 0' }}>
        {(activeTab === 'All' ? sports : [activeTab]).map(sport => {
          const sportPicks = MOCK_DATA.filter(p => p.sport === sport).slice(0, 5)
          if (!sportPicks.length) return null
          return (
            <div key={sport} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{sport}</div>
                <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 6, ...SPORT_STYLES[sport] }}>
                  {sportPicks.length} picks today
                </span>
              </div>
              {sportPicks.map(player => (
                <div key={player.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid #e8e8e8' }}>
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

      {/* Legend */}
      <div style={{ height: '0.5px', background: '#e0e0e0', margin: '8px 16px 0' }} />
      <div style={{ display: 'flex', gap: 14, padding: '12px 16px', flexWrap: 'wrap' }}>
        {Object.entries(SOURCE_COLORS).map(([src, color]) => (
          <div key={src} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#999' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
            {src.charAt(0).toUpperCase() + src.slice(1)}
          </div>
        ))}
      </div>

    </div>
  )
}