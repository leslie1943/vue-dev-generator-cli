const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const exists = require('fs').existsSync;
const inquirer = require('inquirer');
const template = require('./template.js');
const cwd = process.cwd();
const boilerplateDir = path.join(__dirname, '../boilerplate');

// -------------------------------------------------------
function getPath() {
  if (exists(path.join(cwd, './package.json'))) {
    return 'root';
  }
  if (exists(path.join(cwd, './components'))) {
    return 'src';
  }
  return '';
}

// -------------------------------------------------------
function setTargetPath(callback, type) {

  // question
  function quit() {
    console.log(chalk.green('Nothing executed'));
  }
  const currentPath = getPath();

  // CWD: root
  if (currentPath === 'root' && type) {
    try {
      switch (type) {
        case 'page':
          callback(path.join(cwd, './src/views/'));
          break;
        case 'component':
          callback(path.join(cwd, './src/components/'));
          break;
        case 'api':
          callback(path.join(cwd, './src/api/'));
          break;
        case 'store':
          callback(path.join(cwd, './src/store/modules/'));
          break;
        default:
          break;
      }
    } catch (e) {
      quit();
    }

  } else if (currentPath === 'src' && type) {
    try {
      switch (type) {
        case 'page':
          callback(path.join(cwd, './views/'));
          break;
        case 'component':
          callback(path.join(cwd, './components/'));
          break;;
        case 'api':
          callback(path.join(cwd, './api/'));
          break;
        case 'store':
          callback(path.join(cwd, './store/modules/'));
          break;
        default:
          break;
      }
    } catch (e) {
      quit();
    }

  } else {
    quit();
  }
}

// ------------------------------------------------------- main function.
function normal() {
  const questions = [{
    type: 'list',
    name: 'type',
    message: 'what do you want to generate ?',
    choices: [
      'api',
      'component',
      'page',
      'store',
    ],
  }];

  inquirer.prompt(questions).then(function (answers) {
    switch (answers.type) {
      case 'page':
        page();
        break;
      case 'component':
        component();
        break;
      case 'api':
        api();
        break;
      case 'store':
        store();
        break;
      default:
        break;
    }
  });
}

// ------------------------------------------------------- Page
function page() {
  const questions = [{
    type: 'input',
    name: 'name',
    message: 'page name: ',
  }];

  inquirer.prompt(questions).then(function (answer) {
    setTargetPath(function (target) {
      const name = answer.name;
      const cPath = path.join(target, `./${name}`);

      //check the diretory,create it if no exists.
      fs.ensureDirSync(cPath);

      try{
        fs.writeFileSync(`${cPath}/${name}.vue`, template.page({ name: name }), 'utf8');
        console.log(chalk.blue.bold(`Generated page ${name}.vue SUCCESS: ${cPath}`));
      }catch(e){
        console.log(chalk.red(`Generated page ${name}.vue fail`, e));
      }

      //Write scss file.
      try{
        fs.writeFileSync(`${cPath}/main.scss`, template.scss({ name: name }), 'utf8');
        console.log(chalk.blue.bold(`Generated main.scss with page SUCCESS: ${cPath}`));
      }catch (e) {
        console.log(chalk.red(`Generated main.scss fail`, e));
      }

    }, 'page');
  });
}

// ------------------------------------------------------- Component
function component() {
  const question = [{
    type: 'input',
    name: 'name',
    message: 'component name: ',
  }];

  inquirer.prompt(question).then(function (answer) {
    const name = answer.name;
    setTargetPath(function (target) {
      const cPath = path.join(target, `./${name}`);
      const sPath = path.join(cPath, '/src');
      //check the diretory,create it if no exists. cPath = (target +`./${name}`)
      fs.ensureDirSync(sPath);

      //Write vue file.
      try{
        fs.writeFileSync(`${sPath}/${name}.vue`, template.page({ name: name }), 'utf8');
        console.log(chalk.blue.bold(`Generated component ${name}.vue SUCCESS: ${sPath}`));
      }catch(e){
        console.log(chalk.red(`Generated component ${name}.vue fail`, e));
      }

      //Write scss file.
      try{
        fs.writeFileSync(`${sPath}/main.scss`, template.scss({ name: name }), 'utf8');
        console.log(chalk.blue.bold(`Generated main.scss with component SUCCESS: ${sPath}`));
      }catch (e) {
        console.log(chalk.red(`Generated main.scss fail`, e));
      }

      //Copy ReadMe file.
      try{
        fs.copySync(path.join(boilerplateDir, './component/ReadMe.md'), `${sPath}/ReadMe.md`, { overwrite: true });
        console.log(chalk.blue.bold(`Generated ReadMe.md with component SUCCESS: ${sPath}`));
      }catch(e){
        console.log(chalk.red(`Generated ReadMe.md fail`, e));
      }
      
      //Write index file.
      try {
        fs.writeFileSync(`${cPath}/index.js`, template.component({ name: name }), 'utf8');
        console.log(chalk.blue.bold(`Generated index.js with component SUCCESS: ${target}${name}`));
      } catch (e) {
        console.log(chalk.red(`Generated component index.js fail`, e));
      }

    }, 'component');
  });
}

// ------------------------------------------------------- Api
function api() {
  const question = [{
    type: 'input',
    name: 'name',
    message: 'api name:',
  }];

  inquirer.prompt(question).then(function (answer) {
    const name = answer.name;

    setTargetPath(function (target) {
      //check the diretory,create it if no exists.
      fs.ensureDirSync(target);
      try {
        //Write api file.
        fs.writeFileSync(`${target}/${name}.js`, template.api({ name: name }), 'utf8');
        console.log(chalk.blue.bold(`Generated api "${answer.name}.js" SUCCESS: ${target}`));
      } catch (e) {
        console.log(chalk.red(`Generated model ${name} fail`, e));
      }
    }, 'api');
  });
}

// ------------------------------------------------------- Vuex module
function store() {
  // level-1: module type
  const q1 = [{
    type: "list",
    name: "type",
    message: "which type of vuex module do you want to generate?",
    choices: [
      "module with api",
      "empty module",
    ],
  }];
  inquirer.prompt(q1).then(function (a1) {
    // ########################################## with api
    if (a1.type === "module with api") {
      // level-2.1: with api
      const q2 = [{
        type: "input",
        name: "name",
        message: "api name: ",
      }];
      inquirer.prompt(q2).then(function (api) {
        const q3 = [{
          type: "input",
          name: "name",
          message: "module name: ",
        }];
        inquirer.prompt(q3).then(function (a3) {
          setTargetPath(function (target) {
            const name = a3.name;
            // check the diretory,create it if no exists.
            fs.ensureDirSync(target);
            try {
              fs.writeFileSync(`${target}/${name}.js`, template.storeAPI({ apiName: api.name, moduleName: name }), 'utf8');
              console.log(chalk.blue.bold(`Generated vuex store module "${name}.js" SUCCESS: ${target}`));
            } catch (e) {
              console.log(chalk.red(`Generated vuex store module ${name} fail`, e));
            }
          }, "store");
        })
      });
    } else if (a1.type === "empty module") {
      // level-2.2: without api
      const q2 = [{
        type: "input",
        name: "name",
        message: "module name: ",
      }];
      inquirer.prompt(q2).then(function (a2) {
        setTargetPath(function (target) {
          const name = a2.name;
          // check the diretory,create it if no exists.
          fs.ensureDirSync(target);
          try {
            fs.writeFileSync(`${target}/${name}.js`, template.storeEmpty({ moduleName: name }), 'utf8');
            console.log(chalk.blue.bold(`Generated vuex store module "${name}.js" SUCCESS: ${target}`));
          } catch (e) {
            console.log(chalk.red(`Generated vuex store module ${name} fail`, e));
          }
        }, "store");
      })
    }
  });
}

module.exports = function (args) {
  const name = args[3];
  if (!name) {
    normal();
    return;
  }
  switch (name) {
    case 'page':
      page();
      break;
    case 'component':
      component();
      break;
    case 'api':
      api();
      break;
    case 'store':
      store();
      break;
    default:
      normal();
      break;
  }
};
