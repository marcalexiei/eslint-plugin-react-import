import { readFileSync } from "node:fs";

const packageJSON = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { name: string; version: string; homepage: string };

const {
  name: PLUGIN_NAME,
  version: PLUGIN_VERSION,
  homepage: PLUGIN_HOMEPAGE,
} = packageJSON;

export { PLUGIN_NAME, PLUGIN_VERSION, PLUGIN_HOMEPAGE };
