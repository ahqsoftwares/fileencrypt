interface Props {
         file: string,
         key: string,
         progress: Function
}

module.exports = function decrypt(data: string, {file, key, progress}: Props) {
         const { writeFileSync } = require("fs");

         
         const {decrypt} = new (require("cryptr"))(key);

         const fragments = data.split(":");
         let result = [];

         for (let i = 0; i < fragments.length; i++) {
                  const fragment = fragments[i];
                  result.push(decrypt(fragment));

                  progress(Math.round(((i + 1) / fragments.length) * 100));
         }

         writeFileSync(`${process.cwd()}/${file}`, result.join(""));
}