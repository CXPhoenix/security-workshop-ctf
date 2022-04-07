import "../src/index.css";

const signInURI = new URL(
  "https://script.google.com/macros/s/AKfycbwO237ZLivxZ1ULM_j-S4gvHPVmAYywiugXIQBVYMD8jS424DDoGbuS-3B0NRcRu3mTuA/exec"
);

const signInBody = {
  level: "w02",
};

const form = document.querySelector("#sign-in-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  document.querySelector("#loading-mask").classList.remove("hidden");
  document.querySelector("#loading-mask").classList.add("flex");
  signInPost(form["addr"].value, form["pwd"].value, signInURI).then((data) => {
    if (!data) {
      alert("wrong account or password");
    } else {
      alert(data.flag);
      form["addr"].value = "";
      form["pwd"].value = "";
    }
    document.querySelector("#loading-mask").classList.add("hidden");
    document.querySelector("#loading-mask").classList.remove("flex");
  });
});

async function signInPost(addr, pwd, signInApiUri) {
  if (addr !== "administrator" || pwd !== "EldenRingIsGood") return;
  const headers = new Headers();
  headers.append("Content-Type", "text/plain");
  signInBody["pass"] = true;
  const fetchOptions = {
    headers,
    method: "POST",
    body: JSON.stringify(signInBody),
  };
  try {
    const res = await fetch(signInApiUri, fetchOptions);
    const data = await res.json();
    return data;
  } catch {
    console.log(e);
  }
}
