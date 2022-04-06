const { resolve, basename, extname } = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        level0: resolve(__dirname, "level0/index.html"),
        level1: resolve(__dirname, "level1/index.html"),
        level2: resolve(__dirname, "level2/index.html"),
        level3: resolve(__dirname, "level3/index.html"),
        level4: resolve(__dirname, "level4/index.html"),
      },
      output: {
        // assetFileNames:
        //   "[extname]" === ".js"
        //     ? "[name]/[name][extname]"
        //     : "assets/[name]-[hash][extname]",
        assetFileNames: (assetInfo) => {
          if (extname(assetInfo.name) === ".css")
            return "assets/[name]-[hash][extname]";
          const file = assetInfo.name.split(__dirname).pop();
          const absfolder = file.split(basename(file))[0];
          const folder = absfolder.slice(1, absfolder.length - 1);
          return `${folder.split("\\").join("/")}/[name][extname]`;
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "[name]/[name].js",
      },
    },
  },
});
