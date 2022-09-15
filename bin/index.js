#! /usr/bin/env node

const { readFileSync, writeFileSync } = require("fs");
const encrypt = require("../app/encrypt/index");
const decrypt = require("../app/decrypt/index");
const inquirer = require("inquirer");

(async() => {
         function HelpMenu() {
                           process.stdout.write(chalk`{yellow <> Required; [] Optional}`);

                  setTimeout(() => {
                           process.stdout.clearLine(0);
                           process.stdout.cursorTo(0);
                           process.stdout.write(chalk`{yellow Welcome to encryptor}

Commands:-
         Name              Description                Usage
         {green compile}           {yellow Encrypt your code}          {red encryptor compile <file> [Compiler Options]}
         {green decrypt}           {yellow Decrypt your code}          {red encryptor decrypt <file> [Decompiler Options]}
         {green init}              {yellow Inits a config file}        {red encryptor init}
         {green help}              {yellow Shows this menu}            {red encryptor help}


Compiler Options:-
         Option            Description                Usage
         {green outDir}            {yellow Sets the result dir}        {red encryptor compile <file> -outDir <dirname>}
         {green fast}              {yellow Compile faster}             {red encryptor compile <file> --fast}

Decompiler Options:-
         Option            Description                Usage
         {green outDir}            {yellow Sets the decrypt dir}       {red encryptor decrypt <file> -outDir <dirname>}
         \r`);
                  }, 1000);
         }

         const chalk = require("chalk");
         const args = require("./parse")(process.argv);

         if ((!args["bin"][0]) || args["bin"][0] === "help") {
                  if (!args["bin"][1]) {
                           HelpMenu();
                  } else {
                           switch (args["bin"][1].toLowerCase()) {
                                    case "compile":
                                             console.log(chalk`{red compile}:\n{green Compiles your code to an encrypted format!}\n{yellow Usage: {red encryptor compile <file> <options>}}\n\nOptions: -outDir, --fast`);
                                             break;
                                    case "decrypt":
                                             console.log(chalk`{red decrypt}:\n{green Decrypts your code to the native file}\n{yellow Usage: {red encryptor decrypt <file> <options>}}\n\nOptions: -outDir`);
                                             break;
                                    case "init":
                                             console.log(chalk`{red init}:\n{green Makes a config file for easy access}\n{yellow Usage: {red encryptor init}}\n`);
                                             break;
                                    default:
                                             console.log(chalk`{red Subcommand not found!}`);
                           }
                  }
         }
         else 
         if (args["bin"][0] === "compile") 
         {
                  function log(data) {
                           try {
                                    global.process.stdout.clearLine(0);
                                    global.process.stdout.cursorTo(0);
                                    global.process.stdout.write(data);
                           } catch (e) {
                                    console.log(data);
                           }
                  }

                  process.stdout.write(chalk`{yellow Please Wait...}`);
                  if (!args["bin"][1]) {
                           log(chalk`{red Error: Invalid Usage!}\n\nUsage: encryptor compile <file> [options]`);
                           return
                  }
                  log(chalk`{yellow Reading code...}`);
                  
                  try {
                           const data = String(readFileSync(`${process.cwd()}/${args["bin"][1]}`));
                           let config = {
                                    key: "1234",
                                    fast: false
                           };
                           try {
                                    config = JSON.parse(readFileSync(`${process.cwd()}/encryptor.config.json`));
                           } catch(e) {

                           }

                           config.file = args["bin"][1];
                           if (typeof(args.fast) === "boolean") {
                                    config.fast = args["fast"];
                           }
                           if (args["outDir"]) {
                                    config.outDir = String(args["outDir"]);
                           }
                           config.progress = function(progress, status) {
                                    log(chalk`{yellow Compiling: ${Math.round(progress)}% complete} {green ${status}}`);

                                    if (progress === 100) {
                                             log(chalk`{green Done! Your code has been encrypted}\n\n{red Key: ${config.key}}\n{yellow NOTE}\nYou can customise key in encryptor.config.json`)
                                    }
                           };

                           encrypt(data, config);
                  } catch (e) {
                           log(chalk`{red ${e}}`);
                           process.exit(1);
                  }
                  
         }
         else
         if (args["bin"][0] === "decrypt")
         {
                  function log(data) {
                           try {
                                    global.process.stdout.clearLine(0);
                                    global.process.stdout.cursorTo(0);
                                    global.process.stdout.write(data);
                           } catch (e) {
                                    console.log(data);
                           }
                  }

                  const answers = await inquirer
                  .prompt([
                           {
                                    type: "input",
                                    name: "key",
                                    message: chalk.yellow("Decrypt key"),
                                    validate: (msg) => msg.length > 3
                           }
                  ]);

                  process.stdout.write(chalk`{yellow Please Wait...}`);
                  if (!args["bin"][1]) {
                           log(chalk`{red Error: Invalid Usage!}\n\nUsage: encryptor decrypt <file> [options]`);
                           return
                  }
                  if (!args["bin"][1].endsWith(".encrypted")) {
                           args["bin"][1] += ".encrypted";
                  }

                  log(chalk`{yellow Reading code...}`);
                  
                  try {
                           const data = String(readFileSync(`${process.cwd()}/${args["bin"][1]}`));
                           let config = {
                                    key: answers.key,
                                    fast: false
                           };

                           config.file = args["bin"][1];
                           if (args["outDir"]) {
                                    config.outDir = String(args["outDir"]);
                           }
                           config.progress = function(progress, status) {
                                    log(chalk`{yellow Decrypting: ${Math.round(progress)}% complete} {green ${status}}`);

                                    if (progress === 100) {
                                             log(chalk`{green Done! Your code has been decrypted}\n\n{red Key: ${config.key}}`);
                                    }
                           };

                           try {
                                    decrypt(data, config);
                           } catch (e) {
                                    throw new Error("Invalid Key or corroupt file!");
                           }
                  } catch (e) {
                           log(chalk`{red ${e}}`);
                           process.exit(1);
                  }
         }
         else
         if
         (args["bin"][0] == "init") 
         {
                  function log(data) {
                           global.process.stdout.clearLine(0);
                           global.process.stdout.cursorTo(0);
                           global.process.stdout.write(data);
                  }
                  const answers = await inquirer
                  .prompt([
                           {
                                    type: "input",
                                    name: "key",
                                    message: chalk.yellow("Decrypt key"),
                                    validate: (msg) => msg.length > 3
                           },
                           {
                                    type: "confirm",
                                    name: "fast",
                                    message: chalk.yellow("Fast compile? (Leads to higher security risks)"),
                                    default: false
                           }
                  ]);

                  const options = {
                           key: answers.key,
                           fast: answers.fast
                  };

                  try {
                           writeFileSync(`${process.cwd()}/encryptor.config.json`, JSON.stringify(options));
                           log(chalk`{green Saved config file!}`);
                  } catch (e) {
                           log(chalk`{red Error: Could not save config file!}`);
                  }
         }
         else 
         {
                  console.log(chalk`{red Command Not Found!}\n{green Please check the help menu (encryptor help)}`);
         }
})()