const { resolve } = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        lv0: resolve(__dirname, "level0/index.html"),
        lv1: resolve(__dirname, "level1/index.html"),
        lv2: resolve(__dirname, "level2/index.html"),
        lv3: resolve(__dirname, "level3/index.html"),
        lv4: resolve(__dirname, "level4/index.html"),
      },
    },
  },
});
