(function advancedPanels() {
  "use strict";

  /**
   * Key is the ID of your advanced panel.
   *   This must be UNIQUE (across the whole vivaldi UI).
   *   If in doubt, append your name to ensure it is unique
   *   You can use this ID as a #selector in the advancedPanels.css file
   * title: String, self explanatory
   * url: String, a UNIQUE (amongst web panels) vivaldi:// url that points to a non-existent page.
   *   You must add this as a web panel
   * switch: String of HTML, this will be set as the html in the panel switch button.
   *   E.g. an SVG
   * initialHTML: String of HTML,
   *   this will be used to fill in the panel with a skeleton of HTML to use
   * module: () => {onInit, onActivate} All necessary javascript should be included here.
   *     onInit: () => void. This will be called AFTER the advanced panel DOM is added,
   *       but BEFORE onActivate is called.
   *     onActivate: () => void. This will be called each time the advanced panel is opened
   *       AND IMMEDIATELY AFTER onInit.
   */
  const CUSTOM_PANELS = {
    /*,
    template: {
      title: "Title",
      url: "You must add this as a web panel",
      switch: `<div></div>`,
      initialHTML: `<div></div>`,
      module: function () {
        function onActivate() {
          ;
        }
        function onInit() {
          ;
        }

        return {
          onInit: onInit,
          onActivate: onActivate
        };
      }
    } */
  };

  /**
   * Observe for changes to the UI, e.g. if panels are hidden by going in to fullscreen mode
   * This may require the panel buttons and panels to be re-converted
   * Also, observe panels container, if class changes to switcher, the webstack is removed
   */
  const UI_STATE_OBSERVER = new MutationObserver(records => {
    convertWebPanelButtonstoAdvancedPanelButtons();
    listenForNewPanelsAndConvertIfNecessary();
  });

  /**
   * Observe UI state changes
   */
  function observeUIState() {
    const classInit = {
      attributes: true,
      attributeFilter: ["class"]
    };
    UI_STATE_OBSERVER.observe(document.querySelector("#browser"), classInit);
    UI_STATE_OBSERVER.observe(document.querySelector("#panels-container"), classInit);
  }

  const PANEL_STACK_CREATION_OBSERVER = new MutationObserver((records, observer) => {
    observer.disconnect();
    listenForNewPanelsAndConvertIfNecessary();
  });


  /**
   * Start listening for new web panel stack children and convert any already open ones
   */
  function listenForNewPanelsAndConvertIfNecessary() {
    const panelStack = document.querySelector("#panels .webpanel-stack");
    if (panelStack) {
      WEBPANEL_CREATE_OBSERVER.observe(panelStack, {childList: true});
      const currentlyOpen = document.querySelectorAll(".webpanel-stack .panel");
      currentlyOpen.forEach(convertWebPanelToAdvancedPanel);
    } else {
      const panels = document.querySelector("#panels");
      PANEL_STACK_CREATION_OBSERVER.observe(panels, {childList: true});
    }
  }

  /**
   * Observer that should check for child additions to web panel stack
   * When a new child is added (a web panel initialised), convert it appropriately
   */
  const WEBPANEL_CREATE_OBSERVER = new MutationObserver(records => {
    records.forEach(record => {
      record.addedNodes.forEach(convertWebPanelToAdvancedPanel);
    });
  });

  /**
   * Webview loaded a page. This means the src has been initially set.
   * @param e load event
   */
  function webviewLoaded(e) {
    e.currentTarget.removeEventListener("contentload", webviewLoaded);
    convertWebPanelToAdvancedPanel(e.currentTarget.parentElement.parentElement);
  }

  function notionWide(webview) {
    function webviewLoaded() {
      webview.insertCSS({
        code: `
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
`
      })
      webview.removeEventListener("contentload", webviewLoaded);
    }
    webview.addEventListener("contentload", webviewLoaded);
  }

  /**
   * Attempt to convert a web panel to an advanced panel.
   * First check if the SRC matches a registered value.
   * If so, call the advanced Panel Created method
   * @param node DOM node representing the newly added web panel (child of .webpanel-stack)
   * REMARK: Webview.src can add a trailing "/" to URLs
   * REMARK: When initially created the webview may have no src,
   *     so we need to listen for the first src change
   */
  function convertWebPanelToAdvancedPanel(node) {
    const addedWebview = node.querySelector("webview");
    if (!addedWebview) {
      return;
    }
    if (!addedWebview.src) {
      addedWebview.addEventListener("contentload", webviewLoaded);
      return;
    }
    if (addedWebview.src.startsWith('https://www.notion.so/')) {
      notionWide(addedWebview);
    }
    for (const key in CUSTOM_PANELS) {
      const panel = CUSTOM_PANELS[key];
      const expectedURL = panel.url;
      if (addedWebview.src.startsWith(expectedURL)) {
        advancedPanelCreated(node, panel, key);
        break;
      }
    }
  }

  /**
   * Convert a web panel into an Advanced Panel™
   * @param node the dom node added under web panel stack
   * @param panel the panel object descriptor
   * @param panelId the identifier (key) for the panel
   * REMARK: Vivaldi can instantiate some new windows with an
   *    "empty" web panel containing nothing but the webview
   * REMARK: Can't simply call node.innerHTML as otherwise the
   *    vivaldi UI will crash when attempting to hide the panel
   * REMARK: Check that the panel isn't already an advanced panel
   *    before convert as this could be called after state change
   * REMARK: it may take a while for vivaldi to update the title of
   *    a panel, therefore after it is terminated, the title may
   *    change to aborted. Title changing should be briefly delayed
   */
  function advancedPanelCreated(node, panel, panelID) {
    if (node.getAttribute("advancedPanel")) {
      return;
    }
    node.setAttribute("advancedPanel", "true");
    node.querySelector("webview").terminate();
    const newHTML = document.createElement("div");
    newHTML.innerHTML = panel.initialHTML;
    node.appendChild(newHTML);
    node.id = panelID;
    panel.module().onInit();
    ADVANCED_PANEL_ACTIVATION.observe(node, {attributes: true, attributeFilter: ["class"]});
    if (node.querySelector("header.webpanel-header")) {
      advancedPanelOpened(node);
      setTimeout(() => {updateAdvancedPanelTitle(node);}, 500);
    }
  }


  /**
   * Observe attributes of an advanced panel to see when it becomes active
   */
  const ADVANCED_PANEL_ACTIVATION = new MutationObserver(records => {
    records.forEach(record => {
      if (record.target.classList.contains("visible")) {
        advancedPanelOpened(record.target);
      }
    });
  });

  /**
   * An advanced panel has been selected by the user and is now active
   * @param node DOM node of the advancedpanel activated
   */
  function advancedPanelOpened(node) {
    updateAdvancedPanelTitle(node);
    const panel = CUSTOM_PANELS[node.id];
    panel.module().onActivate();
  }

  /**
   * Update the header title of a panel
   * @param node DOM node of the advancedpanel activated
   */
  function updateAdvancedPanelTitle(node) {
    const panel = CUSTOM_PANELS[node.id];
    node.querySelector("header.webpanel-header h1").innerHTML = panel.title;
    node.querySelector("header.webpanel-header h1").title = panel.title;
  }



  /**
   * Go through each advanced panel descriptor and convert the associated button
   */
  function convertWebPanelButtonstoAdvancedPanelButtons() {
    for (const key in CUSTOM_PANELS) {
      const panel = CUSTOM_PANELS[key];
      let switchBtn = document.querySelector(`#switch button[title~="${panel.url}"`);
      if (!switchBtn) {
        switchBtn = document.querySelector(`#switch button[advancedPanelSwitch="${key}"`);
        if (!switchBtn) {
          console.warn(`Failed to find button for ${panel.title}`);
          continue;
        }
      }
      convertSingleButton(switchBtn, panel, key);
    }
  }

  /**
   * Set the appropriate values to convert a regular web panel switch into an advanced one
   * @param switchBtn DOM node for the #switch button being converted
   * @param panel The Advanced panel object description
   * @param id string id of the panel
   * REMARK: Check that the button isn't already an advanced panel button
   *    before convert as this could be called after state change
   */
  function convertSingleButton(switchBtn, panel, id) {
    if (switchBtn.getAttribute("advancedPanelSwitch")) {
      return;
    }
    switchBtn.title = panel.title;
    switchBtn.innerHTML = panel.switch;
    switchBtn.setAttribute("advancedPanelSwitch", id);
  }


  /**
   * Observe web panel switches.
   * REMARK: When one is added or removed, all of the web panels are recreated
   */
  const WEB_SWITCH_OBSERVER = new MutationObserver(records => {
    convertWebPanelButtonstoAdvancedPanelButtons();
    listenForNewPanelsAndConvertIfNecessary();
  });

  /**
   * Start observing for additions or removals of web panel switches
   */
  function observePanelSwitchChildren() {
    const panelSwitch = document.querySelector("#switch");
    WEB_SWITCH_OBSERVER.observe(panelSwitch, {childList: true});
  }


  /**
   * Initialise the mod. Checking to make sure that the relevant panel element exists first.
   */
  function initMod() {
    if (document.querySelector("#panels .webpanel-stack")) {
      observeUIState();
      observePanelSwitchChildren();
      convertWebPanelButtonstoAdvancedPanelButtons();
      listenForNewPanelsAndConvertIfNecessary();
    } else {
      setTimeout(initMod, 500);
    }
  }

  initMod();
})();
