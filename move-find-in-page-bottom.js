(function () {
  function initMod() {
    let s = document.createElement("style")
    s.innerHTML = `
.find-in-page {
  order: 1;
}
  `
    document.head.appendChild(s)
  }
  setTimeout(initMod, 500);
})();
