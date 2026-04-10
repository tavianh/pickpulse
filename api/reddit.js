const SUBREDDITS = ['PrizePicks', 'dfsports', 'sportsbook']

async function fetchSubreddit(subreddit) {
  const res = await fetch(
    `https://www.reddit.com/r/${subreddit}/hot.json?limit=100`,
    { headers: { 'User-Agent': 'pickpulse/1.0' } }
  )
  const json = await res.json()
  return json.data.children.map(p => p.data)
}

function countMentions(posts, playerNames) {
  const counts = {}

  posts.forEach(post => {
    const text = `${post.title} ${post.selftext || ''}`.toLowerCase()
    playerNames.forEach(name => {
      const lastName = name.split(' ').slice(-1)[0].toLowerCase()
      const fullName = name.toLowerCase()
      if (text.includes(fullName) || text.includes(lastName)) {
        counts[name] = (counts[name] || 0) + 1
      }
    })
  })

  return counts
}

export default async function handler(req, res) {
  try {
    const { players } = req.method === 'POST'
      ? await new Promise((resolve) => {
          let body = ''
          req.on('data', chunk => body += chunk)
          req.on('end', () => resolve(JSON.parse(body)))
        })
      : { players: [] }

    if (!players.length) {
      return res.status(400).json({ error: 'No players provided' })
    }

    const allPosts = (await Promise.all(SUBREDDITS.map(fetchSubreddit))).flat()
    const mentions = countMentions(allPosts, players)

    res.status(200).json(mentions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}