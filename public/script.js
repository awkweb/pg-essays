setTimeout(() => {
    const imageEl = document.querySelector("tr td table tbody tr td img")
    const titleEl = document.createElement("h1")
    titleEl.innerHTML = `<a href="http://paulgraham.com${window.location.pathname}">${imageEl.alt}</a>`
    imageEl.parentNode.replaceChild(titleEl, imageEl)
}, 0)
