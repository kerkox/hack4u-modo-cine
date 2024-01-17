// configurando variables de inicialización

const CONSTANTS = {
  menuSelector:
    ".masterstudy-course-player-header.masterstudy-course-player-header_dark-mode",
  videoContainerSelector: ".masterstudy-course-player-lesson",
  optionClass: "masterstudy-course-player-header__dark-mode",
  optionStyle: "display: flex; align-items: center;justify-content: center;",
  btnModoCineId: "btnModoCine",
  elementorContainerSelector:
    ".elementor-container.elementor-column-gap-default",
  keyModoCineActivado: "modoCineActivado",
  keySizeModoCine: "sizeModoCine",
};

CONSTANTS.btnModoCineSelector = `#${CONSTANTS.btnModoCineId}`;

let sizeModoCine = localStorage.getItem(CONSTANTS.keySizeModoCine);
let modoCineActivado = JSON.parse(
  localStorage.getItem(CONSTANTS.keyModoCineActivado)
);
window.modoCineActivado = Boolean(modoCineActivado);

if (sizeModoCine && window.modoCineActivado) {
  changeSizeModoCine(sizeModoCine);
}

function changeSizeModoCine(size) {
  window.sizeModoCine = size;
  localStorage.setItem(CONSTANTS.keySizeModoCine, window.sizeModoCine);
}

function changeModoCineActivado(estado) {
  window.modoCineActivado = estado;
  localStorage.setItem(
    CONSTANTS.keyModoCineActivado,
    JSON.stringify(window.modoCineActivado)
  );
}

window.addEventListener("load", function (event) {
  this.setTimeout(() => {
    let menu = document.querySelector(CONSTANTS.menuSelector);

    let spanIcon = document.createElement("span");
    spanIcon.setAttribute("id", CONSTANTS.btnModoCineId);
    spanIcon.innerHTML = window.modoCineActivado ? "❌" : "🎥";

    let option = document.createElement("div");
    option.classList.add(CONSTANTS.optionClass);
    option.setAttribute("style", CONSTANTS.optionStyle);
    option.appendChild(spanIcon);

    menu.insertBefore(option, menu.children[4]);
    loadCurrentSize();
    option.addEventListener("click", () => {
      modoCine();
    });
  }, 1000);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const handleSetSize = ({ size }) => {
    changeSizeModoCine(size);
    changeModoCineActivado(size != "");
    console.log("%csize = " + size, "color:green;font-size:20px;");
    loadCurrentSize();
    sendResponse({ status: "ok" });
  };

  const handleGetCurrentStatus = () => {
    sendResponse({
      sizeModoCine: window.modoCineActivado ? window.sizeModoCine : "",
    });
  };

  const options = {
    setSize: () => handleSetSize(request),
    getCurrentStatus: handleGetCurrentStatus,
  };
  options[request.type]();
});

function loadCurrentSize() {
  console.log(
    "%cloadCurrentSize: window.sizeModoCine = " + window.sizeModoCine,
    "color:green;font-size:20px;"
  );
  setAttributeElementsToUpdateSize();
  let spanIcon = document.querySelector(CONSTANTS.btnModoCineSelector);
  spanIcon.innerHTML = window.modoCineActivado ? "❌" : "🎥";
}

function modoCine() {
  const enableDisableModoCine = {
    [true]: disableModoCine,
    [false]: enableModoCine,
  };
  enableDisableModoCine[window.modoCineActivado]();
  changeModoCineActivado(!window.modoCineActivado);
}

function enableModoCine() {
  if (!window.sizeModoCine || window.sizeModoCine == "") {
    changeSizeModoCine("2200px");
  }

  setAttributeElementsToUpdateSize();

  let spanIcon = document.querySelector(CONSTANTS.btnModoCineSelector);
  spanIcon.innerHTML = "❌";
}

function setAttributeElementsToUpdateSize() {
  let elementsToUpdateSize = [
    CONSTANTS.videoContainerSelector,
    CONSTANTS.elementorContainerSelector,
  ];
  elementsToUpdateSize.forEach((selector) => {
    let container = document.querySelector(selector);
    container.setAttribute("style", `max-width: ${window.sizeModoCine}`);
  });
}

function disableModoCine() {
  let elementsToUpdateSize = [
    CONSTANTS.videoContainerSelector,
    CONSTANTS.elementorContainerSelector,
  ];
  elementsToUpdateSize.forEach((selector) => {
    let container = document.querySelector(selector);
    container.removeAttribute("style");
  });

  let spanIcon = document.querySelector(CONSTANTS.btnModoCineSelector);
  spanIcon.innerHTML = "🎥";
}
