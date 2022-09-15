"use strict";
const { readFileSync } = require("fs");
let cache = {};
module.exports = function decrypt(data, { file, key, progress }) {
    const { decrypt } = new (require("cryptr"))(key);
    const { writeFileSync } = require("fs");
    const fragments = data.split(":");
    let result = [];
    for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];
        let decrypted = "";
        if (cache[fragment]) {
            decrypted = cache[fragment];
        }
        else {
            decrypted = decrypt(fragment);
            cache[fragment] = decrypted;
        }
        result.push(decrypted);
        progress(Math.round(((i + 1) / fragments.length) * 100), `(${i} / ${fragments.length})`);
    }
    progress(100, `(${fragments.length} / ${fragments.length})`, `${fragments.length}`);
    let fileFrag = file.split(".");
    fileFrag.splice(fileFrag.length - 1, 1);
    writeFileSync(`${process.cwd()}/${fileFrag.join(".")}`, result.join(""));
};
