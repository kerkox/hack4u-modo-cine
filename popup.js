
let sizeModoCine = localStorage.getItem("sizeModoCine");

 window.sizeModoCine = sizeModoCine;

function changeSizeModoCine(size) {
  window.sizeModoCine = size;
  localStorage.setItem("sizeModoCine", window.sizeModoCine);
}

if (sizeModoCine) {
  loadModoCine(sizeModoCine);  
}

function loadModoCine(sizeModoCine) {
  let size = sizeModoCine == "1550px" ? 1 : sizeModoCine == "2200px" ? 2 : 0;
  let option = document.querySelector("#size-mode option[value='" + size + "']");
  option.setAttribute("selected", "selected");
}

let sizeMode = document.querySelector("#size-mode");
sizeMode.addEventListener("change", function (event) {
  console.log("evenbt",{event});
  console.log("sizeMode",{sizeMode});
  let sizes = {
    0: "",
    1: "1550px",
    2: "2200px",
  }
  let size = sizes[sizeMode.value];
  console.log("Size: ", size);
  changeSizeModoCine(size);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "setSize", size: size },
      function (_) {}
    );
  });
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { type: "getCurrentStatus" },
    function (response) {
      loadModoCine(response.sizeModoCine);
    }
  );
});
