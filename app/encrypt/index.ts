interface Options {
         file: string,
         key: String,
         fast: Boolean,
         outDir: String | null | undefined,
         progress: Function,
         cached: Function
}

module.exports = async function encrypt(data: string, {file, key, fast, outDir, progress}: Options) {
         const Loop = require("./looper.js");
         const {writeFileSync} = require("fs");
         const {encrypt} = new (require("cryptr"))(key);

         let compilationData = 0;

         let fragments = data.split(fast ? " " : "");
         let output: Array<String> = [];

         for (let i = 0; i < fragments.length; i++ ) {
                  Loop(encrypt, fragments[i] + (fast ? " " : ""))
                  .then((data: String) => {
                           output[i] = `${data}${(i + 1 == fragments.length) ? "" : ":"}`;
                  });
                  compilationData += 1;

                  progress(Math.round(((i + 1) / fragments.length) * 100), `(${i}/${fragments.length})`);
         }

         writeFileSync(`${process.cwd()}${outDir ? `/${outDir}` : ""}/${file}.encrypted`, output.join(""));

         progress(100, `${fragments.length} / ${fragments.length}`, compilationData);
}