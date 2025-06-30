"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("uv-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("uv-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("uv-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("uv-error-code");

const connection = new BareMux.BareMuxConnection("/cra/baremux/worker.js");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await registerSW();
  } catch (err) {
    error.textContent = "Failed to register service worker.";
    errorCode.textContent = err.toString();
    throw err;
  }

  const url = search(address.value, searchEngine.value);

  let frame = document.getElementById("uv-frame");
  frame.style.display = "block";

  // Check if transport is already set to 'bare-mux-remote', otherwise set it
  if (await connection.getTransport() !== "bare-mux-remote") {
    await connection.setTransport("bare-mux-remote", [
      // THIS IS THE WORKER URL you must replace with your actual deployed Cloudflare Worker URL
      "https://violet.grady.lol/",
      "bare-remote"
    ]);
  }

  frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
});
