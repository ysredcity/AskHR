import { readFileSync, writeFileSync } from "node:fs";

const kernel = readFileSync(new URL("../public/hairline/kernel.js", import.meta.url), "utf8");
const figure = readFileSync(new URL("../docs/hairline/briefing.js", import.meta.url), "utf8");
const bridge = `
function hairline(figure) {
  window.HiHRBriefing = {
    mount(stage, read) {
      HL.inject(document);
      stage.setAttribute('data-hairline', figure.name);
      const svg = HL.mk('svg', {viewBox: '0 0 400 320', 'aria-hidden': 'true'}, stage);
      return figure.mount({stage, svg, read}, figure.range[1]);
    }
  };
}
`;
writeFileSync(new URL("../public/hairline/briefing-runtime.js", import.meta.url), `(function(){\n${kernel}\n${bridge}\n${figure}\n})();\n`);
