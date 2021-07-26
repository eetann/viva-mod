(function moveFindInPageBottom() {
  function initMod() {
    if (document.querySelector("#panels .webpanel-stack")) {
      let s = document.createElement("style")
      s.innerHTML = `
.find-in-page {
  order: 1;
}`
      document.head.appendChild(s)
    } else {
      setTimeout(initMod, 500);
    }
  }
  initMod();
})();
