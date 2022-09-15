let cache = {};

module.exports = function Loop(decrypt, data) {
         return {
                  then: (fn) => {
                           let decrypted = "";

                           if (cache[data]) {
                                    decrypted = cache[data];
                           } else {
                                    decrypted = decrypt(data);
                                    cache[data] = decrypted;
                           }

                           fn(decrypted)
                  }
         };
}