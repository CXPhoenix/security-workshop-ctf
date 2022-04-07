import "../src/index.css";
import disableDevtool from "disable-devtool";

// disableDevtool({
//   url: "https://letmegooglethat.com/",
//   disableMenu: false,
// });

// const demoData = [
//   {
//     message: "哈...終於做好了",
//     timestamp: new Date("2022/04/05 12:00:00"),
//   },
//   {
//     message: "差點就被 crack 了...",
//     timestamp: new Date("2022/04/06 17:28:32"),
//   },
//   {
//     message: "希望不會太糟糕😣😣😣",
//     timestamp: new Date("2022/04/07 03:24:43"),
//   },
// ];

const url = new URL(
  "https://script.google.com/macros/s/AKfycbwO237ZLivxZ1ULM_j-S4gvHPVmAYywiugXIQBVYMD8jS424DDoGbuS-3B0NRcRu3mTuA/exec"
);

const form = document.querySelector("#leave-message-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  document.querySelector("#loading-mask").classList.remove("hidden");
  document.querySelector("#loading-mask").classList.add("flex");
  if (form["leave-message-area"].value === "") return;
  if (form["leave-message-area"].value.match(new RegExp("</?script>"))) {
    console.log("match");
  }
  postMessageToBackend(
    form["leave-message-area"].value,
    new Date().getTime()
  ).then((data) => {
    clearMessages();
    data.data.forEach((item) => {
      addMessageInClient(item.message, item.timestamp, true);
    });
    document.querySelector("#loading-mask").classList.remove("flex");
    document.querySelector("#loading-mask").classList.add("hidden");
  });
  form["leave-message-area"].value = "";
  // addMessageInClient(form["leave-message-area"].value, new Date());
  // demoData.push({
  //   message: form["leave-message-area"].value,
  //   timestamp: new Date(),
  // });
  // window.sessionStorage.setItem("messages", JSON.stringify(demoData));
});
window.addEventListener("DOMContentLoaded", () => {
  form["leave-message-area"].focus();

  getDataFromBackend(window.localStorage.getItem("token") || "").then(
    (data) => {
      data.data.forEach((item) => {
        addMessageInClient(item.message, item.timestamp);
      });
      if (!window.localStorage.getItem("token")) {
        window.localStorage.setItem("token", data.token);
      }
      document.querySelector("#loading-mask").classList.add("hidden");
      document.querySelector("#loading-mask").classList.remove("flex");
    }
  );
});

/**
 * @async
 * @returns {Object} {data: Object[]}
 */
async function getDataFromBackend(token = "") {
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
 * @param {String} times getTime()
 * @returns
 */
async function postMessageToBackend(message, times) {
  const postUrl = url;
  const headers = new Headers();
  headers.append("Content-Type", "text/plain");
  const fetchOptions = {
    headers,
    method: "POST",
    body: JSON.stringify({
      message: message,
      timestamp: times,
      token: window.localStorage.getItem("token"),
      type: "message-board",
    }),
  };
  try {
    const res = await fetch(postUrl, fetchOptions);
    const data = await res.json();
    return data;
  } catch {
    console.log(e);
  }
}

/**
 *
 * @param {String} message
 * @param {Date} timestamp
 * @param {Boolean} isClearHistory
 */
function addMessageInClient(message, timestamp) {
  const messageBox = document.querySelector("#message-box").content;
  const cloneMessageBox = messageBox.cloneNode(true);
  cloneMessageBox.querySelector("#message").innerHTML = message;
  // cloneMessageBox.querySelector("#message").innerHTML = sanitizeHTML(message);
  cloneMessageBox.querySelector("#timestamp").innerText = formatDate(timestamp);
  const messages = document.querySelector("#messages");
  messages.insertBefore(cloneMessageBox, messages.firstElementChild);
}

function clearMessages() {
  const messages = document.querySelector("#messages");
  messages.innerHTML = "";
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

function sanitizeHTML(str) {
  const temp = document.createElement("div");
  temp.innerText = str;
  return temp.innerHTML;
}

async function getFlag() {
  //get flag
  const flagURI = new URL(
    "https://script.google.com/macros/s/AKfycbwO237ZLivxZ1ULM_j-S4gvHPVmAYywiugXIQBVYMD8jS424DDoGbuS-3B0NRcRu3mTuA/exec"
  );
  flagURI.searchParams.append("level", "w04");
  const res = await fetch(flagURI);
  const data = await res.json();
  return data;
}
