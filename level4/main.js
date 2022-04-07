import "../src/index.css";

const demoData = [
  {
    message: "哈...終於做好了",
    timestamp: new Date("2022/04/05 12:00:00"),
  },
  {
    message: "差點就被 crack 了...",
    timestamp: new Date("2022/04/06 17:28:32"),
  },
  {
    message: "希望不會太糟糕😣😣😣",
    timestamp: new Date("2022/04/07 03:24:43"),
  },
];

const url = new URL(
  "https://script.google.com/macros/s/AKfycbwO237ZLivxZ1ULM_j-S4gvHPVmAYywiugXIQBVYMD8jS424DDoGbuS-3B0NRcRu3mTuA/exec"
);

let token;

if (!window.localStorage.getItem("token")) {
  token = btoa(
    `${new Date().getTime()}${navigator.userAgent}${
      navigator.hardwareConcurrency
    }`
  );
  window.localStorage.setItem("token", token);
} else {
  token = window.localStorage.getItem("token");
}

const form = document.querySelector("#leave-message-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (form["leave-message-area"].value === "") return;
  if (form["leave-message-area"].value.match(new RegExp("</?script>"))) {
    console.log("match");
  }
  addMessageInClient(form["leave-message-area"].value, new Date());
  demoData.push({
    message: form["leave-message-area"].value,
    timestamp: new Date(),
  });
  form["leave-message-area"].value = "";
  window.sessionStorage.setItem("messages", JSON.stringify(demoData));
});
window.addEventListener("DOMContentLoaded", () => {
  form["leave-message-area"].focus();
  if (!window.sessionStorage.getItem("messages")) {
    // demoData.forEach((data) => {
    //   addMessageInClient(data.message, data.timestamp);
    // });

    getDataFromBackend().then((data) => {
      // console.log(data);
      data.data.forEach((item) => {
        addMessageInClient(item.message, item.timestamp);
      });
    });
    return;
  }
  // const messages = JSON.parse(window.sessionStorage.getItem("messages"));
  // messages.forEach((data) => {
  //   addMessageInClient(data.message, data.timestamp);
  // });
});

async function getDataFromBackend() {
  const dataURL = url;
  dataURL.searchParams.append("type", "message-board");
  dataURL.searchParams.append("token", token);
  const headers = new Headers();
  headers.append("Content-Type", "text/plain");
  const res = await fetch(url, { headers, method: "GET" });
  const data = await res.json();
  return data;
}

/**
 *
 * @param {String} message
 * @param {Date} timestamp
 */
function addMessageInClient(message, timestamp) {
  const messageBox = document.querySelector("#message-box").content;
  const cloneMessageBox = messageBox.cloneNode(true);
  cloneMessageBox.querySelector("#message").innerHTML = message;
  cloneMessageBox.querySelector("#timestamp").innerText = formatDate(timestamp);
  const messages = document.querySelector("#messages");
  messages.insertBefore(cloneMessageBox, messages.firstElementChild);
}

/**
 *
 * @param {Date | String} date
 * @returns {String}
 */
function formatDate(date) {
  date = new Date(date);
  const Y = date.getFullYear();
  const M = formatDigitalToStringStyle(date.getMonth() + 1);
  const D = formatDigitalToStringStyle(date.getDate());
  const h = formatDigitalToStringStyle(date.getHours());
  const m = formatDigitalToStringStyle(date.getMinutes());
  const s = formatDigitalToStringStyle(date.getSeconds());
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

/**
 *
 * @param {Integer} num
 * @returns {String}
 */
function formatDigitalToStringStyle(num) {
  return num < 10 ? `0${num}` : `${num}`;
}
