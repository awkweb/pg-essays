const fetch = require('node-fetch')
const { parse } = require('path')
const { pipeline } = require('stream')
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
    const path = parse(req.url)

    // Switch homepage to articles
    const isHomepage = !path.name || ['index', 'articles'].includes(path.name)
    const pathname = isHomepage ? '/articles.html' : req.url

    const origRes = await fetch(new URL(pathname, baseUrl), { method: req.method })

    if (req.method !== 'GET' || !isHtml(path)) {
        return pipeline(origRes.body, res)
    }

    const html = (await origRes.text())
        .replace('</head>', head) // Add new stylesheet and script
        .replace('</body>', body) // Add footer and analytics
        .replace(/�/g, '—') // Replace broken emdash
        .replace(/http:/g, "https:") // Force https for favicon, etc.

    // Cache articles page for five minutes and posts for a day
    const maxAge = isHomepage ? '300' : '86400'
    res.setHeader('Cache-Control', `max-age=0, s-maxage=${maxAge}`)

    // Send html to client
    res.send(html)
    res.end()
}
