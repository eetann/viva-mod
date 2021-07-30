(function advancedPanels() {
  "use strict";

  const LANGUAGE = 'ja'; // change this

  const l10n = {
    en_gb: {
      title: 'Sessions',
      new_session: 'New Session',
      session_name_placeholder: 'Session Name',
      all_windows: 'All Windows',
      only_selected: 'Only Selected Tabs',
      add_session_btn: 'Add Session',
      sort_title: 'Sort by...',
      sort_date: 'Sort by Date',
      sort_name: 'Sort by Name',
      sort_asc: 'Sort Ascending',
      sort_desc: 'Sort Descending',
      delete_button: 'Delete this session',
      delete_prompt: 'Are you sure you want to delete $T?',
      delete_number_sessions: 'Are you sure you want to delete $N selected sessions?',
      delete_confirm: '⚠ Yes, Delete',
      delete_abscond: 'No, don\'t.',
      time_created_label: 'Created <time></time>',
      open_new_window: 'Open in new window',
      open_current: 'Open in current window'
    },
    ja: {
      title: 'セッション',
      new_session: '新しいセッション',
      session_name_placeholder: 'セッション名',
      all_windows: '全てのウィンドウ',
      only_selected: '選択したタブのみ',
      add_session_btn: 'セッションを保存',
      sort_title: '並べ替え...',
      sort_date: '日付で並べ替え',
      sort_name: 'セッション名で並べ替え',
      sort_asc: '昇順に並べ替え',
      sort_desc: '降順に並べ替え',
      delete_button: 'セッションを削除',
      delete_prompt: '$T を削除しますか？',
      delete_number_sessions: '選択した$N個のセッションを削除しますか？',
      delete_confirm: '⚠ 削除',
      delete_abscond: 'キャンセル',
      time_created_label: '作成日 <time></time>',
      open_new_window: '新しいウィンドウで開く',
      open_current: '現在のウィンドウで開く'
    }
  }[LANGUAGE];

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
    sessions_lonm: {
      title: l10n.title,
      url: "vivaldi://sessions",
      switch: `<span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="5 0 10 10">
                        <path d="M7 2h6v1h-6v-1zm0 2h6v1h-6v-1zm0 2h6v1h-6v-1z"></path>
                    </svg>
                </span>`,
      initialHTML: `
                <div class="newSession">
                    <h2>${l10n.new_session}</h2>
                    <input type="text" placeholder="${l10n.session_name_placeholder}" class="session-name">
                    <label><input type="checkbox" class="all-windows"><span>${l10n.all_windows}</span></label>
                    <label><input type="checkbox" class="selected-tabs"><span>${l10n.only_selected}</span></label>
                    <input type="button" class="add-session" value="${l10n.add_session_btn}"></input>
                </div>
                <div class="sortselector sortselector-compact">
                    <select class="sortselector-dropdown" title="${l10n.sort_title}" tabindex="-1">
                        <option value="visitTime">${l10n.sort_date}</option>
                        <option value="title">${l10n.sort_name}</option>
                    </select>
                    <button class="sortselector-button direction-descending" title="${l10n.sort_asc}" tabindex="-1">
                        <svg width="11" height="6" viewBox="0 0 11 6" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5.133l.11-.11 4.456 4.456-1.498 1.497L5.5 2.91 2.432 5.976.934 4.48 5.39.022l.11.11z"></path>
                        </svg>
                    </button>
                    <button class="sortselector-button direction-ascending selected" title="${l10n.sort_desc}" tabindex="-1">
                        <svg width="11" height="6" viewBox="0 0 11 6" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5.133l.11-.11 4.456 4.456-1.498 1.497L5.5 2.91 2.432 5.976.934 4.48 5.39.022l.11.11z"></path>
                        </svg>
                    </button>
                </div>
                <section class="sessionslist">
                    <ul>
                    </ul>
                </section>
                <div class="modal-container">
                    <div class="confirm">
                        <p>${l10n.delete_prompt}</p>
                        <button class="yes">${l10n.delete_confirm}</button>
                        <button class="no">${l10n.delete_abscond}</button>
                    </div>
                </div>
                <template class="session_item">
                    <li>
                        <div>
                            <h3></h3>
                            <span>${l10n.time_created_label}</span>
                        </div>
                        <button class="open_new" title="${l10n.open_new_window}">
                            <svg viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 6h-16v14h16v-14zm-11 2h2v2h-2v-2zm-3 0h2v2h-2v-2zm12 10h-12v-7h12v7zm0-8h-6v-2h6v2z"></path>
                            </svg>
                        </button>
                        <button class="open_current" title="${l10n.open_current}">
                            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 9h16v2h-16v-2zm0-4h8v4h-8v-4z"></path>
                            <path opacity=".5" d="M9 5h7v3h-7z"></path>
                            </svg>
                        </button>
                        <button class="delete" title="${l10n.delete_button}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
                            <path d="M10.2.5l-.7-.7L5 4.3.5-.2l-.7.7L4.3 5-.2 9.5l.7.7L5 5.7l4.5 4.5.7-.7L5.7 5"></path>
                            </svg>
                        </button>
                    </li>
                </template>`,
      module: function () {

        /**
         * Get selected session names
         * @returns string array of names
         */
        function getSelectedSessionNames() {
          const selections = Array.from(document.querySelectorAll("#sessions_lonm li.selected"));
          return selections.map(x => x.getAttribute("data-session-name"));
        }

        /**
         * Open a session after its corresponding list item is clicked
         * @param e click event
         * REMARK: Hide the confirm box if it is open
         * REMARK: If click was on a button, just ignore it
         */
        function listItemClick(e) {
          if (isButton(e.target)) {
            return;
          }
          if (e.ctrlKey) {
            e.currentTarget.classList.toggle("selected");
          } else {
            const oldselect = document.querySelectorAll("#sessions_lonm li.selected");
            oldselect.forEach(item => item.classList.remove("selected"));
            e.currentTarget.classList.add("selected");
          }
          document.querySelector("#sessions_lonm .confirm").classList.remove("show");
        }

        /**
         * Check if the target of a click is a button
         * @param target an event target
         */
        function isButton(target) {
          const tag = target.tagName.toLowerCase();
          return (tag === "button" && target.className === "delete") || (tag === "svg" && target.parentElement.className === "delete");
        }

        /**
         * Turns a date into a string that can be used in a file name
         * Locale string seems to be the best at getting the correct time for any given timezone
         * @param {Date} date object
         */
        function dateToFileSafeString(date) {
          const badChars = /[\\/:\*\?"<>\|]/gi;
          return date.toLocaleString().replace(badChars, '.');
        }

        /**
         * Add a new session
         * @param e button click event
         */
        function newSessionClick(e) {
          let name = document.querySelector('#sessions_lonm .newSession input.session-name').value;
          const windows = document.querySelector('#sessions_lonm .newSession input.all-windows').checked;
          const selectedTabs = document.querySelector('#sessions_lonm .newSession input.selected-tabs').checked;
          const markedTabs = document.querySelectorAll(".tab.marked");
          if (name === "") {
            name = dateToFileSafeString(new Date());
          }
          vivaldi.windowPrivate.getCurrentId(window => {
            const options = {
              saveOnlyWindowId: windows ? 0 : window
            };
            if (selectedTabs && markedTabs && markedTabs.length > 0) {
              options.ids = Array.from(markedTabs).map(tab => Number(tab.id.replace("tab-", "")));
            }
            vivaldi.sessionsPrivate.saveOpenTabs(name, options, () => {
              document.querySelector('#sessions_lonm .newSession input.session-name').value = "";
              document.querySelector('#sessions_lonm .newSession input.all-windows').checked = false;
              document.querySelector('#sessions_lonm .newSession input.selected-tabs').checked = false;
              updateList();
            });
          });
        }

        /**
         * Change sort Order
         * @param e click event
         */
        function sortOrderChange(e) {
          document.querySelectorAll("#sessions_lonm .sortselector-button").forEach(el => {
            el.classList.toggle("selected");
          });
          updateList();
        }

        /**
         * Change sort Method
         * @param e click event
         */
        function sortMethodChange(e) {
          updateList();
        }

        /**
         * User clicked remove button
         * @param e click event
         */
        function deleteClick(e) {
          const selectedSessions = getSelectedSessionNames();
          if (selectedSessions.length === 1) {
            const delete_t = l10n.delete_prompt.replace('$T', selectedSessions[0]);
            confirmMsg(delete_t);
          } else {
            const delete_n = l10n.delete_number_sessions.replace('$N', selectedSessions.length);
            confirmMsg(delete_n);
          }
        }

        /**
         * Show the delete confirmation box with specified text
         * @param msg string to use
         */
        function confirmMsg(msg) {
          document.querySelector("#sessions_lonm .confirm p").innerText = msg;
          document.querySelector("#sessions_lonm .modal-container").classList.add("show");
        }

        /**
         * User confirmed remove
         * @param e event
         * REMARK: Want to remove all and only update UI after final removal
         */
        function deleteConfirmClick(e) {
          const selections = getSelectedSessionNames();
          for (let i = 0; i < selections.length - 1; i++) {
            vivaldi.sessionsPrivate.delete(selections[i], () => {});
          }
          vivaldi.sessionsPrivate.delete(selections[selections.length - 1], () => {
            updateList();
          });
        }

        /**
         * User cancelled remove
         * @param e event
         */
        function deleteCancelClick(e) {
          document.querySelector("#sessions_lonm .modal-container").classList.remove("show");
        }

        /**
         * User clicked open (current) button
         * @param e click event
         */
        function openInCurrentWindowClick(e) {
          const selections = getSelectedSessionNames();
          selections.forEach(item => {
            vivaldi.sessionsPrivate.open(
              item,
              {openInNewWindow: false}
            );
          });
        }

        /**
         * User clicked open (new) button
         * @param e click event
         */
        function oneInNewWindowClick(e) {
          const selections = getSelectedSessionNames();
          selections.forEach(item => {
            vivaldi.sessionsPrivate.open(
              item,
              {openInNewWindow: true}
            );
          });
        }

        /**
         * Turn a date into a string to show underneath each session
         * @param {Date} date
         */
        function dateToString(date) {
          return date.toLocaleString();
        }

        /**
         * Generate a list item for a session object
         * @returns DOM list item
         */
        function createListItem(session) {
          const template = document.querySelector("#sessions_lonm template.session_item");
          const el = document.importNode(template.content, true);
          el.querySelector("h3").innerText = session.name;
          el.querySelector("h3").setAttribute("title", session.name);
          const date = new Date(session.createDateJS);
          el.querySelector("time").innerText = dateToString(date);
          el.querySelector("time").setAttribute("datetime", date.toISOString());
          el.querySelector("li").addEventListener("click", listItemClick);
          el.querySelector(".open_new").addEventListener("click", oneInNewWindowClick);
          el.querySelector(".open_current").addEventListener("click", openInCurrentWindowClick);
          el.querySelector(".delete").addEventListener("click", deleteClick);
          el.querySelector("li").setAttribute("data-session-name", session.name);
          return el;
        }

        /**
         * Sort the array of sessions
         * @param sessions array of session objects - unsorted
         * @returns sessions array of session objects - sorted
         */
        function sortSessions(sessions) {
          const sortRule = document.querySelector("#sessions_lonm .sortselector-dropdown").value;
          const sortDescending = document.querySelector("#sessions_lonm .direction-descending.selected");
          if (sortRule === "visitTime" && sortDescending) {
            sessions.sort((a, b) => {return a.createDateJS - b.createDateJS;});
          } else if (sortRule === "visitTime" && !sortDescending) {
            sessions.sort((a, b) => {return b.createDateJS - a.createDateJS;});
          } else if (sortRule === "title" && sortDescending) {
            sessions.sort((a, b) => {return a.name.localeCompare(b.name);});
          } else if (sortRule === "title" && !sortDescending) {
            sessions.sort((a, b) => {return b.name.localeCompare(a.name);});
          }
          return sessions;
        }

        /**
         * Create the dom list for the sessions
         * @param sessions The array of session objects (already sorted)
         * @returns DOM list of session items
         */
        function createList(sessions) {
          const newList = document.createElement("ul");
          sessions.forEach((session, index) => {
            const li = createListItem(session, index);
            newList.appendChild(li);
          });
          return newList;
        }

        /**
         * Get the array of sessions and recreate the list in the panel
         */
        function updateList() {
          document.querySelector("#sessions_lonm .modal-container").classList.remove("show");
          const existingList = document.querySelector("#sessions_lonm .sessionslist ul");
          if (existingList) {
            existingList.parentElement.removeChild(existingList);
          }
          vivaldi.sessionsPrivate.getAll(items => {
            const sorted = sortSessions(items);
            const newList = createList(sorted);
            document.querySelector("#sessions_lonm .sessionslist").appendChild(newList);
          });
        }

        /**
         * Update the session listing on activation of panel
         */
        function onActivate() {
          updateList();
        }

        /**
         * Add the sort listeners on creation of panel
         */
        function onInit() {
          document.querySelectorAll("#sessions_lonm .sortselector-button").forEach(el => {
            el.addEventListener("click", sortOrderChange);
          });
          document.querySelector("#sessions_lonm .sortselector-dropdown").addEventListener("change", sortMethodChange);
          document.querySelector("#sessions_lonm .confirm .yes").addEventListener("click", deleteConfirmClick);
          document.querySelector("#sessions_lonm .confirm .no").addEventListener("click", deleteCancelClick);
          document.querySelector("#sessions_lonm .newSession .add-session").addEventListener("click", newSessionClick);
        }

        return {
          onInit: onInit,
          onActivate: onActivate
        };
      }
    },
    temporary_panel: {
      title: "Temporary Panel",
      url: "vivaldi://temporary_panel",
      switch: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0a17.926 17.926 0 001.87-8c0-2.874-.673-5.59-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.519.698L9.6 15.302A2 2 0 018.08 16H8" />
</svg>`,
      initialHTML: `<style type="text/css">
    .my-panel {
      height: 100%;
      display: flex;
      flex-flow: column;
    }
    .my-panel-adressbar {
      display; flex;
    }
    .my-panel-adress {
      width: 90%;
      padding: 2px 4px;
      font-size: 14px;
      border-radius: 3px;
      box-sizing: border-box;
    }
  </style>
  <div id="tmpPanel" class="my-panel">
    <div class="my-panel-adressbar">
      <input list="urls" id="tmpPanelInput" class="my-panel-adress" placeholder="Select for Web Panel" />
      <datalist id="urls">
        <option value="https://github.com">GitHub</option>
        <option value="https://github.com/eetann">GitHub/eetann</option>
        <option value="https://www.deepl.com/translator">DeepL</option>
        <option value="https://zenn.dev/articles">Zenn articles</option>
        <option value="https://zenn.dev/eetann">Zenn eetann</option>
      </datalist>
      <button id="newTemporalPanel">Go</button>
    </div>
  </div>
  `,
      module: function () {
        function onClickNewTemporalPanel() {
          let val = document.getElementById("tmpPanelInput").value;
          let prevWebview = document.getElementById("nowWebview");
          if (prevWebview) {
            prevWebview.remove();
          }
          let webview = document.createElement("webview");
          webview.id = "nowWebview";
          webview.src = val;
          webview.style.position = "relative";
          webview.style.width = "100%";
          webview.style.height = "inherit";
          let myPanel = document.getElementById("tmpPanel");
          myPanel.appendChild(webview)
        }
        function onActivate() {
          ;
        }
        function onInit() {
          document.getElementById("newTemporalPanel").addEventListener("click", onClickNewTemporalPanel);
        }

        return {
          onInit: onInit,
          onActivate: onActivate
        };
      }
    }/*,
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

  function addTemporaryBar(node) {
    if (node.getAttribute("temporaryBar")) {
      return;
    }
    node.setAttribute("temporaryBar", "true");
    const newHTML = document.createElement("div");
    newHTML.innerHTML = `
    <div class="temporary-bar">
      <input list="temporary_url" id="tmpPanelInput" class="temporary-bar-input" placeholder="Select for Web Panel" />
      <datalist id="temporary_url">
        <option value="https://github.com">GitHub</option>
        <option value="https://github.com/eetann">GitHub/eetann</option>
        <option value="https://www.deepl.com/translator">DeepL</option>
        <option value="https://zenn.dev/articles">Zenn articles</option>
        <option value="https://zenn.dev/eetann">Zenn eetann</option>
      </datalist>
      <button id="newTemporayURL">Go</button>
    </div>`;
    let after = node.querySelector(".webpanel-content");
    node.insertBefore(newHTML, after);
    // panel.module().onInit();
    // ADVANCED_PANEL_ACTIVATION.observe(node, {attributes: true, attributeFilter: ["class"]});
    // if (node.querySelector("header.webpanel-header")) {
    //   advancedPanelOpened(node);
    //   setTimeout(() => {updateAdvancedPanelTitle(node);}, 500);
    // }
  }

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
    let is_custom_panel = false;
    for (const key in CUSTOM_PANELS) {
      const panel = CUSTOM_PANELS[key];
      const expectedURL = panel.url;
      if (addedWebview.src.startsWith(expectedURL)) {
        advancedPanelCreated(node, panel, key);
        is_custom_panel = true;
        break;
      }
    }
    if (!is_custom_panel) {
      addTemporaryBar(node);
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
