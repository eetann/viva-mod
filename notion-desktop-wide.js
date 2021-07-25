// https://forum.vivaldi.net/topic/26623/zoom-find-in-page-other-actions-in-web-panels
(function panel_actions() {
  "use strict";

  /*
  Dictionary of panel actions.
  They will be added to the toolbar in the order specified below.
  key must be unique
  key: {
    title: string for tooltip
    script: (target, webview) => {}: void.
      target is button that was clicked to switch the look.
      webview is the webview attached to the button for content scripts,
        Call doContentScript with the webview and a () => {}: void
    display: string of html - The innerHTML of the toolbar button
    display_class: string - One or more classes to give the button
  }
  */

  const ACTIONS = {
    terminate: {
      title: "Kill the panel to free memory. WARNING! This will also kill any tabs using the same process.",
      script: function (target, webview) {
        webview.terminate();
        // close the panel
        document.querySelector("#switch .webviewbtn.active").click();
      },
      display: "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 18 18' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12' /></svg>",
      display_class: "panel-action-terminate"
    },

    mute: {
      title: "Mute this panel",
      script: function (target, webview) {
        webview.isAudioMuted(mute => {
          webview.setAudioMuted(!mute);
          target.innerHTML = mute ? "<svg viewBox='0 -1 18 18' xmlns='http://www.w3.org/2000/svg'><path d='m 10.425781,0 -5.5410155,4.96094 h -4.234375 v 4.74805 h 4.1074219 l 5.6679686,5.23047 z m 1.767579,1.50782 v 0.59961 c 0.628524,0 1.262682,0.52233 1.751953,1.49023 0.489269,0.96789 0.804686,2.34168 0.804686,3.86133 0,1.51964 -0.315417,2.89148 -0.804686,3.85937 -0.489271,0.9679 -1.123429,1.49219 -1.751953,1.49219 v 0.59961 c 0.949262,0 1.742407,-0.74276 2.287109,-1.82031 0.544702,-1.07756 0.869141,-2.52926 0.869141,-4.13086 0,-1.60161 -0.324439,-3.05525 -0.869141,-4.13281 -0.544702,-1.07755 -1.337847,-1.81836 -2.287109,-1.81836 z m -0.921875,1.97851 v 0.59961 c 0.378754,0 0.787693,0.3227 1.113281,0.9668 0.325586,0.64409 0.539061,1.57016 0.539061,2.5957 1e-6,1.02554 -0.213475,1.95161 -0.539061,2.5957 -0.325588,0.64409 -0.734527,0.9668 -1.113281,0.9668 v 0.59961 c 0.699491,0 1.267416,-0.54311 1.648436,-1.29687 0.381021,-0.75375 0.603517,-1.75774 0.603517,-2.86524 0,-1.1075 -0.222496,-2.11344 -0.603517,-2.86719 -0.38102,-0.75375 -0.948945,-1.29492 -1.648436,-1.29492 z'></path></svg>"
            : "<svg viewBox='0 -1 18 18' xmlns='http://www.w3.org/2000/svg'><path d='m 10.425781,-0.1412354 -5.5410155,4.96094 H 0.6503908 v 4.75 h 4.1074217 l 5.6679685,5.2285204 z m 0.853516,4.1211 -0.707031,0.70703 1.917969,1.91797 -1.917969,1.91992 0.707031,0.70703 1.917969,-1.91992 1.919922,1.91992 0.707031,-0.70703 -1.919922,-1.91992 1.919922,-1.91797 -0.707031,-0.70703 -1.919922,1.91796 z'></path></svg>";
          target.title = mute ? "Mute this panel" : "Panel Muted. Click to Un-Mute";
        });
      },
      display: `<svg viewBox="0 -1 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="m 10.425781,0 -5.5410155,4.96094 h -4.234375 v 4.74805 h 4.1074219 l 5.6679686,5.23047 z m 1.767579,1.50782 v 0.59961 c 0.628524,0 1.262682,0.52233 1.751953,1.49023 0.489269,0.96789 0.804686,2.34168 0.804686,3.86133 0,1.51964 -0.315417,2.89148 -0.804686,3.85937 -0.489271,0.9679 -1.123429,1.49219 -1.751953,1.49219 v 0.59961 c 0.949262,0 1.742407,-0.74276 2.287109,-1.82031 0.544702,-1.07756 0.869141,-2.52926 0.869141,-4.13086 0,-1.60161 -0.324439,-3.05525 -0.869141,-4.13281 -0.544702,-1.07755 -1.337847,-1.81836 -2.287109,-1.81836 z m -0.921875,1.97851 v 0.59961 c 0.378754,0 0.787693,0.3227 1.113281,0.9668 0.325586,0.64409 0.539061,1.57016 0.539061,2.5957 1e-6,1.02554 -0.213475,1.95161 -0.539061,2.5957 -0.325588,0.64409 -0.734527,0.9668 -1.113281,0.9668 v 0.59961 c 0.699491,0 1.267416,-0.54311 1.648436,-1.29687 0.381021,-0.75375 0.603517,-1.75774 0.603517,-2.86524 0,-1.1075 -0.222496,-2.11344 -0.603517,-2.86719 -0.38102,-0.75375 -0.948945,-1.29492 -1.648436,-1.29492 z"></path>
            </svg>`,
      display_class: "panel-action-mute"
    },
    keynotionwide: {
      title: "remove the padding at Notion",
      script: function (_, webview) {
        notionWide(webview);
      },
      display: `N`,
      display_class: `panel-action-notion-wide`
    },/*,

        template: {
            title: "",
            script: function(event, webview){

            },
            display: ``,
            display_class: ``
        },*/
  };

  function notionWide(webview) {
    (function notionWideMain() {
      function initNotionWide() {
        if (true) {
          doContentScript(webview, () => {
            const style_element = document.createElement('style');
            style_element.innerHTML = `
@media (max-width: 850px) {
  .notion-frame > .notion-scroller > div:not(.notion-page-content) > div,
  .notion-page-content {
      padding-left: 2.5em !important;
      padding-right: 1em !important;
  }

  .notion-frame > .notion-scroller > div:not(.notion-page-content)[style*="padding"] {
      padding-left: 0 !important;
      padding-right: 0 !important;
  }

  div[data-block-id] {
      max-width: unset !important;
  }
}`
            document.body.appendChild(style_element);
          })
        } else {
          setTimeout(initNotionWide, 1000);
        }
      }
      setTimeout(initNotionWide, 1000);
    })();
  }


  function createElement(action, webview) {
    const template = document.createElement("template");
    template.innerHTML = action.display.trim();
    const element = template.content.firstChild;
    action.script(element, webview);
    element.title = action.title;
    return element;
  }


  /**
   * Inject a script as a content script
   * @param webview to use
   * @param scriptMethod Method to inject
   */
  function doContentScript(webview, scriptMethod) {
    const scriptText = "(" + scriptMethod + ")()";
    webview.executeScript({code: scriptText});
  }

  /**
   * Create a panel action button
   * REMARK: For some reason the button click currentTarget is not always the button
   * @param action object
   * @param webview dom object button will attach to
   * @returns dom object
   */
  function createActionButton(action, webview) {
    const newBtnDiv = document.createElement("div");
    newBtnDiv.className = action.display_class + " button-toolbar mod-panel-action";
    const newBtn = document.createElement("button");
    newBtn.className = action.display_class + " button-toolbar mod-panel-action";
    newBtn.style.margin = "2px 5px";
    newBtn.innerHTML = action.display;
    if (action.script) {
      newBtn.addEventListener("click", event => {
        let eventSource = event.target;
        while (eventSource.tagName.toLowerCase() !== "button") {
          eventSource = eventSource.parentElement;
        }
        action.script(eventSource, webview);
      });
    }
    if (action.doubleclick) {
      newBtn.addEventListener("dblclick", event => {
        let eventSource = event.target;
        while (eventSource.tagName.toLowerCase() !== "button") {
          eventSource = eventSource.parentElement;
        }
        action.doubleclick(eventSource, webview);
      });
    }
    newBtn.title = action.title;
    newBtnDiv.appendChild(newBtn);
    return newBtnDiv;
  }

  /**
   * Add the panel action controls
   * @param panel dom node
   */
  function addPanelControls(panel) {
    const alreadyAdded = panel.querySelector("footer");
    if (alreadyAdded) {return;}
    const footer = document.createElement("footer");
    const footerToolbar = document.createElement("div");
    footerToolbar.className = "toolbar toolbar-medium toolbar-statusbar";
    footerToolbar.style.height = "24px";
    footerToolbar.style.paddingLeft = "1px";
    footerToolbar.style.display = "flex";
    footer.appendChild(footerToolbar);
    const webview = panel.querySelector("webview");
    notionWide(webview)
    for (const key in ACTIONS) {
      if (key == "keynotionwide" && !webview.src.startsWith('https://www.notion.so/')) {
        continue;
      }
      const action = ACTIONS[key];
      const newButton = createActionButton(action, webview);
      footerToolbar.appendChild(newButton);
    }
    panel.appendChild(footer);
  }

  /**
   * upgrade a web panel by adding controls, listeners, etc.
   * @param panel dom node
   */
  function upgradePanel(panel) {
    addPanelControls(panel);
  }

  /**
   * Observe changes to the panels
   * Remark: This will either be to upgrade a panel when it is first created
   *    or to re-add the panel controls if removed after a panel was toggled
   * This can also re-load a webpanel if it was previously terminated
   */
  const PANEL_CHANGE_OBSERVER = new MutationObserver(records => {
    records.forEach(record => {
      if (record.type === "attributes") {
        const targetClasses = record.target.classList;
        if (targetClasses.contains("visible") && targetClasses.contains("webpanel")) {
          addPanelControls(record.target);
        }
      } else if (record.type === "childList") {
        record.addedNodes.forEach(node => {
          if (node.classList && node.classList.contains("webpanel")) {
            upgradePanel(node);
          }
        });
      }
    });
  });

  /**
   * Begin observing the changes to panels
   * @param webPanelStack The web panel stack div
   */
  function beginObservation(webPanelStack) {
    PANEL_CHANGE_OBSERVER.observe(webPanelStack, {
      attributes: true,
      attributeFilter: ["class"],
      childList: true,
      subtree: true
    });
  }

  /**
   * Initialise the mod
   */
  function initMod() {
    const webPanels = document.querySelector("#panels");
    if (webPanels) {
      beginObservation(webPanels);
    } else {setTimeout(initMod, 500);}
  }

  /* Start 500ms after the browser is opened */
  setTimeout(initMod, 500);
})();
