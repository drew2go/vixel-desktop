import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url)));
test("release artifacts have stable names the admin panel links to", () => {
  assert.equal(pkg.build.artifactName, "Vixel-Admin-${os}-${arch}.${ext}");
  assert.equal(pkg.build.mac.target[0].target, "dmg");
  assert.equal(pkg.build.win.target[0].target, "nsis");
});
test("renderer is sandboxed with no node access", () => {
  const src = readFileSync(new URL("./main.js", import.meta.url), "utf8");
  assert.match(src, /nodeIntegration: false/); assert.match(src, /contextIsolation: true/); assert.match(src, /sandbox: true/);
});
