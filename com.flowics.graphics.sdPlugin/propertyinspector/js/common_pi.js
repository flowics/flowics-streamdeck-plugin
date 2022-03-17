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

/** Stream Deck software passes system-highlight color information
 * to Property Inspector. Here we 'inject' the CSS styles into the DOM
 * when we receive this information. */

function addDynamicStyles(clrs, fromWhere) {
  // console.log("addDynamicStyles", clrs.highlightColor, clrs.highlightColor.slice(0, 7));
  const node =
    document.getElementById("#sdpi-dynamic-styles") ||
    document.createElement("style");
  if (!clrs.mouseDownColor)
    clrs.mouseDownColor = Utils.fadeColor(clrs.highlightColor, -100);
  const clr = clrs.highlightColor.slice(0, 7);
  const clr1 = Utils.fadeColor(clr, 100);
  const clr2 = Utils.fadeColor(clr, 60);
  const metersActiveColor = Utils.fadeColor(clr, -60);

  // console.log("%c    ", `background-color: #${clr}`, 'addDS', clr);
  // console.log("%c    ", `background-color: #${clr1}`, 'addDS1', clr1);
  // console.log("%c    ", `background-color: #${clr2}`, 'addDS2', clr2);
  // console.log("%c    ", `background-color: #${metersActiveColor}`, 'metersActiveColor', metersActiveColor);

  node.setAttribute("id", "sdpi-dynamic-styles");
  node.innerHTML = `

    input[type="radio"]:checked + label span,
    input[type="checkbox"]:checked + label span {
        background-color: ${clrs.highlightColor};
    }

    input[type="radio"]:active:checked + label span,
    input[type="checkbox"]:active:checked + label span {
      background-color: ${clrs.mouseDownColor};
    }

    input[type="radio"]:active + label span,
    input[type="checkbox"]:active + label span {
      background-color: ${clrs.buttonPressedBorderColor};
    }

    td.selected,
    td.selected:hover,
    li.selected:hover,
    li.selected {
      color: white;
      background-color: ${clrs.highlightColor};
    }

    .sdpi-file-label > label:active,
    .sdpi-file-label.file:active,
    label.sdpi-file-label:active,
    label.sdpi-file-info:active,
    input[type="file"]::-webkit-file-upload-button:active,
    button:active {
      border: 1pt solid ${clrs.buttonPressedBorderColor};
      background-color: ${clrs.buttonPressedBackgroundColor};
      color: ${clrs.buttonPressedTextColor};
      border-color: ${clrs.buttonPressedBorderColor};
    }

    ::-webkit-progress-value,
    meter::-webkit-meter-optimum-value {
        background: linear-gradient(${clr2}, ${clr1} 20%, ${clr} 45%, ${clr} 55%, ${clr2})
    }

    ::-webkit-progress-value:active,
    meter::-webkit-meter-optimum-value:active {
        background: linear-gradient(${clr}, ${clr2} 20%, ${metersActiveColor} 45%, ${metersActiveColor} 55%, ${clr})
    }
    `;
  document.body.appendChild(node);
}
