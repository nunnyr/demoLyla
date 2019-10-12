const MOBILE_SCREEN_CUTTOFF = 768

const TRANSLATOR_ID = "translator-dropdown-jquery"
const MAIN_MENU_ID = "menu-main-menu"
const HEADER_ROW_ID = "header-language-selector"
const MOBILE_LIST_ITEM_TRANSLATOR_ID = "mobile-menu__translator-item"

const CURRENT_LANGUAGE_LOCAL_STORAGE_ID = "currentLanguage"

var currentLanguage = "en";
var translatorMobile = false;

window.addEventListener("load", function(event) {
  setupResizeListener();
  appendLanguageToMapLinks();
});

function initCurrentLanguage() {
  document.domain = location.hostname;
  if (window.opener != null) {
    currentLanguage = window.opener.currentLanguage
  }
}

function setupResizeListener() {
  window.addEventListener("resize", function(event) {
    checkTranslatorMobile(event.target)
  });
}

function moveTranslatorToMenu() {
  var translator = document.getElementsByClassName(TRANSLATOR_ID)
  var mainMenu = document.getElementById(MAIN_MENU_ID)
  if (translator.length > 0 && mainMenu) {
    var listItem = document.createElement("LI");
    listItem.id = MOBILE_LIST_ITEM_TRANSLATOR_ID
    translator = translator[0]

    listItem.appendChild(translator)
    mainMenu.insertBefore(listItem, mainMenu.firstChild)
    translatorMobile = true;
  }
}

function moveTranslatorToHeader() {
  var translator = document.getElementsByClassName(TRANSLATOR_ID)
  var headerRow = document.getElementById(HEADER_ROW_ID)
  if (translator.length > 0 && headerRow) {
    translator = translator[0]
    headerRow.appendChild(translator)
    translatorMobile = false;
    var oldTranslatorItem = document.getElementById(MOBILE_LIST_ITEM_TRANSLATOR_ID)
    if (oldTranslatorItem) {
      oldTranslatorItem.outerHTML = ""
    }
  }
}

function checkTranslatorMobile(targetWindow) {
  if (targetWindow.innerWidth < MOBILE_SCREEN_CUTTOFF && !translatorMobile) {
    moveTranslatorToMenu();
  }
  else if (targetWindow.innerWidth >= MOBILE_SCREEN_CUTTOFF && translatorMobile){
    moveTranslatorToHeader();
  }
}

/*
 * Parent site functions.
 */

/*
 * Parent site hooks for Translator Revolution DropDown. Stubbing them all out here
 * so we can manage the code in this script instead of on the WP Admin.
 */

/*
 * Sets a callback function that runs before the translator is initialized. Receives two arguments: translator, options.
 */
function parentSiteBeforeInit(translator, options) {
  initCurrentLanguage();
}

/*
 * Sets a callback function that runs when the translator is being initialized. Receives two arguments: translator, options.
 */
function parentSiteOnInit(translator, options) {
  currentLanguage = translator._current_language;
  checkTranslatorMobile(window);
}

/*
 * Sets a callback function that runs when the translation starts. Receives five arguments:
 * filtered_elements, source, from, to, options.
 */
function parentSiteOnStartTranslate(filtered_elements, source, from, to, options) {
}

/*
 * Sets a callback function that runs when the translation is completed.
 * Receives seven arguments: filtered_elements, translation, source, from, to, options, restore.
 */
function parentSiteOnCompleteTranslate(filtered_elements, translation, source, from, to, options, restore) {
  currentLanguage = to;
}

/*
 * Defines a javascript routine that runs before the translator is loaded.
 */
function parentSiteBeforeLoad() { }

function appendLanguageToMapLinks() {
  var gmCanvas = document.getElementById('affiliate-map-canvas');
  if (gmCanvas) {
      gmCanvas.addEventListener("click", function(event) {
        var targetElement = event.target;

        if (targetElement.href) {
          event.preventDefault();
          localStorage.setItem(CURRENT_LANGUAGE_LOCAL_STORAGE_ID, currentLanguage)
          window.open(targetElement.href)
        }
    })
  }
}


/*
* Child site functions
*/

/*
 * Child site hooks for Translator Revolution DropDown. Stubbing them all out here
 * so we can manage the code in this script instead of on the WP Admin.
 */

/*
 * Sets a callback function that runs before the translator is initialized. Receives two arguments: translator, options.
 */
function childSiteBeforeInit(translator, options) {
  initCurrentLanguage();
}

/*
 * Sets a callback function that runs when the translator is being initialized. Receives two arguments: translator, options.
 */
function childSiteOnInit(translator, options) {
  if (jQuery.cookie("translator-dropdown-" + options.id + "-to") != undefined) {
    return;
  }
  setTimeout(function() {
    translator._links.filter("." + options.languageSelectorClass + currentLanguage).click();
  }, 200);

  checkTranslatorMobile(window);
}

/*
 * Sets a callback function that runs when the translation starts. Receives five arguments:
 * filtered_elements, source, from, to, options.
 */
function childSiteOnStartTranslate(filtered_elements, source, from, to, options) {
}

/*
 * Sets a callback function that runs when the translation is completed.
 * Receives seven arguments: filtered_elements, translation, source, from, to, options, restore.
 */
function childSiteOnCompleteTranslate(filtered_elements, translation, source, from, to, options, restore) {
}

/*
 * Defines a javascript routine that runs before the translator is loaded.
 */
function childSiteBeforeLoad() {
}
