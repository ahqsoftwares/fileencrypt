interface Options {
         file: string,
         key: String,
         fast: Boolean,
         outDir: String | null | undefined,
         progress: Function
}

module.exports = function encrypt(data: string, {file, key, fast, outDir, progress}: Options) {
         const {writeFileSync} = require("fs");
         const {encrypt} = new (require("cryptr"))(key);
         let fragments = data.split(fast ? " " : "");
         let output: Array<String> = [];

         for (let i = 0; i < fragments.length; i++ ) {
                  output[i] = `${encrypt(fragments[i] + (fast ? " " : ""))}${(i + 1 == fragments.length) ? "" : ":"}`;
                  progress(Math.round(((i + 1) / fragments.length) * 100));
         }

         writeFileSync(`${process.cwd()}${outDir ? `/${outDir}` : ""}/${file}.encrypted`, output.join(""));
}