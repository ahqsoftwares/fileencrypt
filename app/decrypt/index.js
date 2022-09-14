"use strict";
module.exports = function decrypt(data, { file, key, progress }) {
    const { writeFileSync } = require("fs");
    const { decrypt } = new (require("cryptr"))(key);
    const fragments = data.split(":");
    let result = [];
    for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];
        result.push(decrypt(fragment));
        progress(Math.round(((i + 1) / fragments.length) * 100));
    }
    writeFileSync(`${process.cwd()}/${file}`, result.join(""));
};
