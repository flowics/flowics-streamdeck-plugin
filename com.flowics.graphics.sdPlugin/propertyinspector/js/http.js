/*
  MIT License

  Copyright (c) 2021 Adrian Mullings

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

/**
 * @param {{
 *   context: string,
 *   payload: {
 *     settings: {
 *       url?: string,
 *       method?: string,
 *       contentType?: string|null,
 *       headers?: string|null,
 *       body?: string|null,
 *     }
 *   },
 * }} data
 */
function sendHttp(data) {
  const { url, method, contentType, headers, body } = data.payload.settings;
  log("sendHttp", { url, method, contentType, headers, body });

  let defaultHeaders = contentType
    ? {
        "Content-Type": contentType,
      }
    : {};
  let inputHeaders = {};

  if (headers) {
    const headersArray = headers.split(/\n/);

    for (let i = 0; i < headersArray.length; i += 1) {
      if (headersArray[i].includes(":")) {
        const [headerItem, headerItemValue] = headersArray[i].split(/:(.*)/);
        const trimmedHeaderItem = headerItem.trim();
        const trimmedHeaderItemValue = headerItemValue.trim();

        if (trimmedHeaderItem) {
          inputHeaders[trimmedHeaderItem] = trimmedHeaderItemValue;
        }
      }
    }
  }

  const fullHeaders = {
    ...defaultHeaders,
    ...inputHeaders,
  };

  log(fullHeaders);

  if (!url || !method) {
    showAlert(data.context);
    return;
  }
  fetch(url, {
    cache: "no-cache",
    headers: fullHeaders,
    method,
    body: ["GET", "HEAD"].includes(method) ? undefined : body,
  })
    .then(checkResponseStatus)
    .then(() => showOk(data.context))
    .catch((err) => {
      showAlert(data.context);
      logErr(err);
    });
}

/**
 * @param {{
 *   context: string,
 *   payload: {
 *     settings: {
 *       url?: string,
 *       body?: string|null,
 *     }
 *   },
 * }} data
 */
function sendWebSocket(data) {
  const { url, body } = data.payload.settings;
  log("sendWebSocket", { url, body });
  if (!url || !body) {
    showAlert(data.context);
    return;
  }
  const ws = new WebSocket(url);
  ws.onerror = (err) => {
    showAlert(data.context);
    logErr(new Error("WebSocket error occurred"));
  };
  ws.onclose = function (evt) {
    onClose(this, evt);
  };
  ws.onopen = function () {
    onOpen(this);
    ws.send(body);
    ws.close();
    showOk(data.context);
  };
}

/**
 * @param {void | Response} resp
 * @returns {Promise<Response>}
 */
async function checkResponseStatus(resp) {
  if (!resp) {
    throw new Error();
  }
  if (!resp.ok) {
    throw new Error(`${resp.status}: ${resp.statusText}\n${await resp.text()}`);
  }
  return resp;
}

/**
 * @param {WebSocket} ws
 */
function onOpen(ws) {
  log(`Connection to ${ws.url} opened`);
}

/**
 * @param {WebSocket} ws
 * @param {CloseEvent} evt
 */
function onClose(ws, evt) {
  log(`Connection to ${ws.url} closed:`, evt.code, evt.reason);
}

/**
 * @param {string} context
 */
function showOk(context) {
  $SD.api.showOk(context);
}

/**
 * @param {string} context
 */
function showAlert(context) {
  $SD.api.showAlert(context);
}

/**
 * @param {...unknown} msg
 */
function log(...msg) {
  console.log(...msg);
  $SD.api.logMessage(msg.map(stringify).join(" "));
}

/**
 * @param {...unknown} msg
 */
function logErr(...msg) {
  console.error(...msg);
  $SD.api.logMessage(msg.map(stringify).join(" "));
}

/**
 * @param {unknown} input
 * @returns {string}
 */
function stringify(input) {
  if (typeof input !== "object" || input instanceof Error) {
    return input.toString();
  }
  return JSON.stringify(input, null, 2);
}
