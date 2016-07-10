var myApp = {
  writeFileFromBase64: function () { },
  writeConfigFile: function () { },
  readConfigFile: function() { },
  writeImage: function () { },
  config: { },
  out: "",
  top: "",
  bottom: "",
};

function setInputValue(id, value, def) {
  document.getElementById(id).value = value ? value : def ? def : "";
}

function getInputValue(id) {
  return document.getElementById(id).value;
}

if (typeof(require) === typeof(Function)) {

  var fs = require('fs');
  var gui = require('nw.gui');
  var minimist = require('minimist');
  var mkdirp = require('mkdirp');
  var process = require('process');
  var basedir = require('xdg-basedir');

  // Extend application menu for Mac OS
  if (process.platform == "darwin") {
    var menu = new gui.Menu({type: "menubar"});
    menu.createMacBuiltin && menu.createMacBuiltin(window.document.title);
    gui.Window.get().menu = menu;
  }

  myApp.writeFileFromBase64 = function (file, str) {
    var buffer = new Buffer(str, 'base64');
    var stream = fs.createWriteStream(file);
    stream.write(buffer);
    stream.close();
  };

  myApp.getConfigDir = function () {
    return basedir.config + "/me101me";
  };

  myApp.getConfigFile = function () {
    return myApp.getConfigDir() + "/config";
  };

  myApp.readConfigFile = function () {
    myApp.config = { };
    try {
      var data = fs.readFileSync(myApp.getConfigFile(), { encoding: 'utf8' });
      var j = JSON.parse(data);
      myApp.config = j ? j : { };
    } catch (e) {
      console.error(e);
    }
  };

  myApp.writeConfigFile = function () {
    try {
      mkdirp.sync(myApp.getConfigDir());
      fs.writeFileSync(myApp.getConfigFile(), JSON.stringify(myApp.config));
    } catch (e) {
      console.error(e);
    }
  };

  myApp.writeImage = function (data) {
    var i = myApp.out.lastIndexOf('/');
    var j = myApp.out.lastIndexOf('\\');
    i = Math.max(i, j);
    if (i > 0)
      mkdirp.sync(myApp.out.substr(0, i));
    myApp.writeFileFromBase64(myApp.out, data);
  };

  var args = minimist(gui.App.argv);
  gui.Window.get().show();
  myApp.out = args.out ? args.out : "";
  myApp.top = args.top ? args.top : "";
  myApp.bottom = args.bottom ? args.bottom : "";
}