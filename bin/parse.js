"use strict";
module.exports = function Parse(data) {
    let options = {
        "bin": []
    };
    for (let i = 2; i < data.length; i++) {
        const props = data[i];
        if (props.startsWith("--")) {
            options[props.replace("--", "")] = true;
        }
        else if (props.startsWith("-")) {
            options[props.replace("--", "")] = data[i + 1] || false;
            i++;
        }
        else {
            options["bin"].push(props);
        }
    }
    return options;
};
