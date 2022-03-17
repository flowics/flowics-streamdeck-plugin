$SD.on("connected", (jsonObj) => connected(jsonObj));

function connected(jsn) {
  $SD.on("com.flowics.graphics.overlay.toggle.keyDown", (jsonObj) =>
    sendOverlayAction("toggle", jsonObj)
  );
  $SD.on("com.flowics.graphics.overlay.takein.keyDown", (jsonObj) =>
    sendOverlayAction("in", jsonObj)
  );
  $SD.on("com.flowics.graphics.overlay.takeout.keyDown", (jsonObj) =>
    sendOverlayAction("out", jsonObj)
  );
  $SD.on("com.flowics.graphics.overlay.takeallout.keyDown", (jsonObj) =>
    sendTakeAllOut(jsonObj)
  );
}

/**
 * @param {'toggle' | 'in' | 'out'} overlayAction
 * @param {{
 *   context: string,
 *   payload: {
 *     settings: {
 *       token?: string,
 *       overlayId?: string,
 *     }
 *   },
 * }} data
 */
function sendOverlayAction(overlayAction, data) {
  const url = `https://api.flowics.com/graphics/${data.payload.settings.token}/control/overlays/transition`;
  const body = JSON.stringify([
    {
      id: data.payload.settings.overlayId,
      transition: overlayAction,
    },
  ]);
  const newData = {
    ...data,
    payload: {
      settings: {
        url,
        method: "PUT",
        contentType: "application/json",
        body,
      },
    },
  };
  sendHttp(newData);
}

/**
 * @param {{
 *   context: string,
 *   payload: {
 *     settings: {
 *       token?: string,
 *     }
 *   },
 * }} data
 */
function sendTakeAllOut(data) {
  const url = `https://api.flowics.com/graphics/${data.payload.settings.token}/control/overlays/take-all-out`;
  const newData = {
    ...data,
    payload: {
      settings: {
        url,
        method: "PUT",
      },
    },
  };
  sendHttp(newData);
}
