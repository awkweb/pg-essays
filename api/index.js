const fetch = require('node-fetch')

module.exports = async (req, res) => {
  const url = req.url === "/" || req.url === "/index.html" ? "/articles.html" : req.url
  const head =
    '<meta content="width=device-width, initial-scale=1.0" name="viewport" />' +
    '<link media="all" href="/styles.css" rel="stylesheet" />' +
    '<script src="/script.js"></script>' +
    '</head>'
  const body =
    '<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>' +
    '<noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt=""/></noscript>'
  const html = (await (await fetch('http://paulgraham.com' + url)).text())
    .replace('</head>', head)
    .replace('</body>', body)
    .replace(/�/g, '—')
    .replace(/http:/g, "https:")

  res.send(html)
  res.end()
}
