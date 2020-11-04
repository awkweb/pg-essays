const { format, parse } = require('path')
const fetch = require('node-fetch')
const pkg = require('../package.json')

const baseUrl = 'http://paulgraham.com'

const head =
    '<meta content="width=device-width, initial-scale=1.0" name="viewport" />' +
    '<link media="all" href="/styles.css" rel="stylesheet" />' +
    '<script src="/script.js"></script>' +
    '</head>'

const body =
    `<footer><p>Site by <a href="https://meagher.co">Tom Meagher</a>. Source on <a href="${pkg.repository}">GitHub</a>.</p></footer>` +
    '<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>' +
    '<noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="" /></noscript>'

const isHtml = path => /^.html?$/i.test(path.ext)

module.exports = async (req, res) => {
    // Normalize path
    const path = normalize(parse(req.url))

    // Switch homepage to articles
    const isHomepage = ['index', 'articles'].includes(path.name)
    const pathname = isHomepage ? '/articles.html' : format(path)

    const origRes = await fetch(new URL(pathname, baseUrl), { method: req.method })

    if (req.method !== 'GET' || !isHtml(path)) {
        res.send(await origRes.buffer())
        res.end()
        return
    }

    // Cache articles page for five minutes and posts for a day
    const maxAge = isHomepage ? '300' : '86400'
    res.setHeader('Cache-Control', `max-age=0, s-maxage=${maxAge}`)

    const html = (await origRes.text())
        .replace('</head>', head) // Add new stylesheet and script
        .replace('</body>', body) // Add footer and analytics
        .replace(/�/g, '—') // Replace broken emdash
        .replace(/http:\/\//g, 'https://') // Force https for favicon, etc.

    // Send html to client
    res.send(html)
    res.end()
}

function normalize(path) {
    path.name = path.name || 'index'
    if (path.ext) return path
    path.ext = '.html'
    path.base = path.name + path.ext
    return path
}
