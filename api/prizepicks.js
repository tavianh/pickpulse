export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://partner-api.prizepicks.com/projections?per_page=1000',
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    )
    const json = await response.json()

    const players = {}
    json.included
      .filter(i => i.type === 'new_player')
      .forEach(p => {
        players[p.id] = {
          name: p.attributes.display_name,
          team: p.attributes.team,
          league: p.attributes.league,
        }
      })

    const TARGET_LEAGUES = ['NBA', 'NFL', 'MLB', 'NHL', 'WNBA']

    const projections = json.data
      .filter(d => d.attributes.status === 'pre_game' && d.attributes.today === true)
      .map(d => {
        const playerId = d.relationships?.new_player?.data?.id
        const player = players[playerId] || {}
        return {
          id: d.id,
          name: player.name || 'Unknown',
          team: player.team || '',
          league: player.league || '',
          stat: d.attributes.stat_display_name,
          line: d.attributes.line_score,
          start_time: d.attributes.start_time,
        }
      })
      .filter(p => TARGET_LEAGUES.includes(p.league) && p.name !== 'Unknown')

    res.status(200).json(projections)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}