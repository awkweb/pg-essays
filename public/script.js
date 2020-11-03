setTimeout(() => {
    // Normalize path
    const path = normalize(location.pathname)
    const basename = path.split('/').pop()
    // Switch homepage to articles
    const isHomepage = ['index.html', 'articles.html'].includes(basename)
    const pathname = isHomepage ? 'articles.html' : path
    // Replace image with title with text
    const imageEl = document.querySelector('tr td table tbody tr td img')
    const titleEl = document.createElement('h1')
    const anchorEl = document.createElement('a')
    anchorEl.href = new URL(pathname, 'http://paulgraham.com')
    anchorEl.textContent = imageEl.alt
    titleEl.appendChild(anchorEl)
    imageEl.parentNode.replaceChild(titleEl, imageEl)

    function normalize(path) {
        path = path.replace(/^\/|\/$/g, '')
        path = path || 'index.html'
        return path.replace(/(?<!(?:\.html?))$/, '.html')
    }
}, 0)
