const fetch = require('node-fetch')
const pkg = require('../package.json')

const baseUrl = 'http://paulgraham.com'

module.exports = async (req, res) => {
    // Switch homepage to articles
    const isHomepage =
        req.url === '/' ||
        req.url === '/index.html' ||
        req.url === '/articles.html'
    const url = isHomepage ? '/articles.html' : req.url

    // Add new stylesheet and script
    const head =
        '<meta content="width=device-width, initial-scale=1.0" name="viewport" />' +
        '<link media="all" href="/styles.css" rel="stylesheet" />' +
        '<script src="/script.js"></script>' +
        '</head>'

    // Add footer and analytics
    const body =
        `<footer><p>Site by <a href="https://meagher.co">Tom Meagher</a>. Source on <a href="${pkg.repository}">GitHub</a>.</p></footer>` +
        '<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>' +
        '<noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt=""/></noscript>'

    const html = (await (await fetch(new URL(url, baseUrl))).text())
        .replace('</head>', head)
        .replace('</body>', body)
        .replace(/�/g, '—') // Replace broken emdash
        .replace(/http:/g, "https:") // Force https for favicon, etc.

    // Cache articles page for five minutes and posts for a day
    const maxAge = isHomepage ? '300' : '86400'
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=' + maxAge)

    // Send html to client
    res.send(html)
    res.end()
}
