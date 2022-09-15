"use strict";
module.exports = function encrypt(data, { file, key, fast, outDir, progress }) {
    const { writeFileSync } = require("fs");
    const { encrypt } = new (require("cryptr"))(key);
    let fragments = data.split(fast ? " " : "");
    let output = [];
    for (let i = 0; i < fragments.length; i++) {
        output[i] = `${encrypt(fragments[i] + (fast ? " " : ""))}${(i + 1 == fragments.length) ? "" : ":"}`;
        progress(Math.round(((i + 1) / fragments.length) * 100), `(${i}/${fragments.length})`);
    }
    writeFileSync(`${process.cwd()}${outDir ? `/${outDir}` : ""}/${file}.encrypted`, output.join(""));
};
