"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = function encrypt(data, { file, key, fast, outDir, progress }) {
    return __awaiter(this, void 0, void 0, function* () {
        const Loop = require("./looper.js");
        const { writeFileSync } = require("fs");
        const { encrypt } = new (require("cryptr"))(key);
        let compilationData = 0;
        let fragments = data.split(fast ? " " : "");
        let output = [];
        for (let i = 0; i < fragments.length; i++) {
            Loop(encrypt, fragments[i] + (fast ? " " : ""))
                .then((data) => {
                output[i] = `${data}${(i + 1 == fragments.length) ? "" : ":"}`;
            });
            compilationData += 1;
            progress(Math.round(((i + 1) / fragments.length) * 100), `(${i}/${fragments.length})`);
        }
        writeFileSync(`${process.cwd()}${outDir ? `/${outDir}` : ""}/${file}.encrypted`, output.join(""));
        progress(100, `${fragments.length} / ${fragments.length}`, compilationData);
    });
};
