const fetch = require('node-fetch')

module.exports = async (req, res) => {
  const url = req.url === "/" || req.url === "/index.html" ? "/articles.html" : req.url
  const html = (
    await (await fetch('http://paulgraham.com' + url)).text()
  ).replace(
    '</head>',
    '<link media="all" href="/styles.css" rel="stylesheet" /><script src="/script.js"></script></head>'
  )

  res.send(html)
  res.end()
}
