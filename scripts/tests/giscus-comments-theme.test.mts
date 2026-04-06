import test from "node:test";
import assert from "node:assert/strict";

import {
  GISCUS_DARK_THEME_PATH,
  GISCUS_LIGHT_THEME_PATH,
  getDocumentModeFromClassName,
  getGiscusLang,
  getGiscusThemeMessage,
  getGiscusThemeOrigin,
  getGiscusThemeUrl,
} from "../../src/components/giscus-comments-theme.ts";

test("detects dark mode from class name", () => {
  assert.equal(getDocumentModeFromClassName("foo dark bar"), "dark");
  assert.equal(getDocumentModeFromClassName("dark"), "dark");
});

test("falls back to light mode when dark is absent", () => {
  assert.equal(getDocumentModeFromClassName("foo bar"), "light");
  assert.equal(getDocumentModeFromClassName(""), "light");
});

test("maps locales to giscus language codes", () => {
  assert.equal(getGiscusLang("zh-CN"), "zh-CN");
  assert.equal(getGiscusLang("en-US"), "en");
});

test("builds absolute theme URLs from the origin", () => {
  assert.equal(
    getGiscusThemeUrl("https://vw2x.vercel.app", "light"),
    "https://vw2x.vercel.app/styles/giscus-light.css",
  );
  assert.equal(
    getGiscusThemeUrl("https://vw2x.vercel.app", "dark"),
    "https://vw2x.vercel.app/styles/giscus-dark.css",
  );
  assert.equal(GISCUS_LIGHT_THEME_PATH, "/styles/giscus-light.css");
  assert.equal(GISCUS_DARK_THEME_PATH, "/styles/giscus-dark.css");
});

test("falls back to the configured site origin when the current origin is not https", () => {
  assert.equal(
    getGiscusThemeOrigin("http://localhost:3000", "https://vw2x.vercel.app"),
    "https://vw2x.vercel.app",
  );
  assert.equal(
    getGiscusThemeOrigin(undefined, "https://vw2x.vercel.app"),
    "https://vw2x.vercel.app",
  );
  assert.equal(
    getGiscusThemeOrigin("https://preview.vw2x.com", "https://vw2x.vercel.app"),
    "https://preview.vw2x.com",
  );
});

test("creates a postMessage payload with the theme value", () => {
  const darkThemeUrl = getGiscusThemeUrl("https://vw2x.vercel.app", "dark");

  assert.deepEqual(getGiscusThemeMessage(darkThemeUrl), {
    giscus: {
      setConfig: {
        theme: darkThemeUrl,
      },
    },
  });
});
