(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "Ideas.md": {
      "path": "Ideas.md",
      "content": "Ideas\n=====\n\nBootstrapping\n-------------\n\nFor the editor to be self hosting we need some tiny kernel that can start up\nand process json objects.\n\nOne possibility is to have a kernel that is essentially `eval` which then\nbootstraps the system by evaluating the script field of objects of type `exec`.\n\nThe kernel can also have one method to add additional type handlers. That may be\nenough to get everything running.\n\nTypes\n-----\n\nWe'll want to be able to register templates for various card types. Templates\nshould be jade or similar.\n\nWhen a card with a type that matches a template is created it will render that\ntemplate into the DOM.\n\nData-Binding\n------------\n\nHaving bi-directional live data binding will be really nice. Like binding a form\nwith R,G,B fields to the background color of an object, or binding user input\nto an event stream.\n\nPublishing\n----------\n\nDecks should bundle the editor and runtime when publishing so that anyone can\nmodify, remix, and republish.\n\nAdditional concerns\n-------------------\n\nHow do dependencies and requirements work?\n\nHow do we manage versioning the bundled editor and runtime?\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "hyperweb\n========\n\nPrototyping some hypercard-ish ideas.\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "Hyperweb\n========\n\nExploring the magic of HyperCard.\n\nWe'll need to be able to create a new card, add buttons, scripts, interactions.\n\n    deck =\n      cards: [\n        objects: []\n      ]\n\n    Card = ->\n      objects: []\n\n    newCardButton =\n      type: \"button\"\n      text: \"New Card\"\n      script: \"\"\"\n        @click ->\n          editor.newCard()\n      \"\"\"\n\n    newImageButton =\n      type: \"button\"\n      text: \"New Image\"\n      script: \"\"\"\n        @click ->\n          \n      \"\"\"\n\n    testButton =\n      type: \"button\"\n      text: \"Test\"\n      script: \"\"\"\n        @click ->\n          say \"Hello\"\n      \"\"\"\n\n    nextCardButton =\n      type: \"button\"\n      text: \"Next\"\n      script: \"\"\"\n        @click ->\n          editor.nextCard()\n      \"\"\"\n\n    controlButtons = [newCardButton, testButton, nextCardButton]\n\n    {exec} = require \"./util\"\n\nA card is simply a JSON object. A card can therefore contain any number of\nproperties or sub-components.\n\nThe editor/viewer interprets the data of the card object and presents in the HTML DOM.\n\n    Editor = (deck) ->\n      currentCardIndex = 0\n      currentCard = deck.cards[currentCardIndex]\n\n      container = document.createElement(\"div\")\n      container.addEventListener \"click\", (e) ->\n        # TODO: May need to handle bubbling\n        if object = e.target.$object\n          object.trigger(\"click\", e)\n\nWe're currently doing a jQuery-esque thing for tracking events bound to objects.\nIt's probably not the worst but it could be better.\n\nKeep a list of all event handlers registered from the scripts of objects so\nthat when events occur we can call the methods that were registered.\n\n      handlers = []\n\nThis `proto` holds all the methods that are available on objects in the deck.\n\nAdvantages are that it is lightweight, disadvantages are that it can easily be\nshadowed accidentally.\n\nLook into using {SUPER: SYSTEM}\n\n      proto =\n        click: (fn) ->\n          handlers.push [this, \"click\", fn]\n\n        trigger: (method, args...) ->\n          self = this\n          handlers.forEach ([host, type, fn]) ->\n            if host is self and type is method\n              fn.apply(host, args)\n\n      hydrate = (object) ->\n        return object.$element if object.$element\n\nHere we initialize the object\n\n        # Init Code from Script\n        object.__proto__ = proto\n        code = CoffeeScript.compile(object.script, bare: true)\n        exec code, object,\n          editor: self\n\n        # TODO: Observable bindings for content and attributes\n        # TODO: Refresh element if type changes?\n        element = document.createElement object.type ? \"div\"\n        element.textContent = object.text\n\n        element.$object = object\n\n        object.$element = element\n\n      addObject = (object) ->\n        container.appendChild hydrate object\n\n      self =\n        addObject: addObject\n\n        objectRemoved: (object) ->\n          container.removeChild object.$element\n\n        nextCard: ->\n          currentCardIndex += 1\n          currentCard = deck.cards[currentCardIndex]\n\n        newCard: (data={}) ->\n          deck.cards.push Card data\n\n        render: ->\n          # Render each object's DOM node into the DOM\n          root.objects.forEach (object) ->\n            container.appendChild hydrate object\n\n        container: container\n\n      controlButtons.forEach addObject\n      \n      return self\n\n    editor = Editor(deck)\n\n    global.say = (text) ->\n      alert text\n\n    document.body.appendChild editor.container\n\nAn editor is built into the default viewer for modifying the data of a card on\nthe fly.\n\nFeatures\n--------\n\nAdding objects, moving them around.\n\nExecuting click handlers (play sound, go to card, etc.)\n\nDeleting objects.\n\nCopying objects.\n\nInput fields.\n\nBinding inputs to properties.\n\nNavigation (Next card, previous card, go to #, go to name)\n\nSelf hosting of editor\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "remoteDependencies: [\n  \"https://cdnjs.cloudflare.com/ajax/libs/coffee-script/1.7.1/coffee-script.min.js\"\n]\ndependencies:\n  require: \"distri/require:v0.5.0\"\n",
      "mode": "100644",
      "type": "blob"
    },
    "util.coffee.md": {
      "path": "util.coffee.md",
      "content": "Util\n====\n\n    module.exports =\n      exec: (code, context, params={}) ->\n        names = Object.keys(params)\n        values = names.map (name) ->\n          params[name]\n\n        Function(names..., code).apply(context, values)\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var Card, Editor, controlButtons, deck, editor, exec, newCardButton, newImageButton, nextCardButton, testButton,\n    __slice = [].slice;\n\n  deck = {\n    cards: [\n      {\n        objects: []\n      }\n    ]\n  };\n\n  Card = function() {\n    return {\n      objects: []\n    };\n  };\n\n  newCardButton = {\n    type: \"button\",\n    text: \"New Card\",\n    script: \"@click ->\\n  editor.newCard()\"\n  };\n\n  newImageButton = {\n    type: \"button\",\n    text: \"New Image\",\n    script: \"@click ->\\n  \"\n  };\n\n  testButton = {\n    type: \"button\",\n    text: \"Test\",\n    script: \"@click ->\\n  say \\\"Hello\\\"\"\n  };\n\n  nextCardButton = {\n    type: \"button\",\n    text: \"Next\",\n    script: \"@click ->\\n  editor.nextCard()\"\n  };\n\n  controlButtons = [newCardButton, testButton, nextCardButton];\n\n  exec = require(\"./util\").exec;\n\n  Editor = function(deck) {\n    var addObject, container, currentCard, currentCardIndex, handlers, hydrate, proto, self;\n    currentCardIndex = 0;\n    currentCard = deck.cards[currentCardIndex];\n    container = document.createElement(\"div\");\n    container.addEventListener(\"click\", function(e) {\n      var object;\n      if (object = e.target.$object) {\n        return object.trigger(\"click\", e);\n      }\n    });\n    handlers = [];\n    proto = {\n      click: function(fn) {\n        return handlers.push([this, \"click\", fn]);\n      },\n      trigger: function() {\n        var args, method, self;\n        method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n        self = this;\n        return handlers.forEach(function(_arg) {\n          var fn, host, type;\n          host = _arg[0], type = _arg[1], fn = _arg[2];\n          if (host === self && type === method) {\n            return fn.apply(host, args);\n          }\n        });\n      }\n    };\n    hydrate = function(object) {\n      var code, element, _ref;\n      if (object.$element) {\n        return object.$element;\n      }\n      object.__proto__ = proto;\n      code = CoffeeScript.compile(object.script, {\n        bare: true\n      });\n      exec(code, object, {\n        editor: self\n      });\n      element = document.createElement((_ref = object.type) != null ? _ref : \"div\");\n      element.textContent = object.text;\n      element.$object = object;\n      return object.$element = element;\n    };\n    addObject = function(object) {\n      return container.appendChild(hydrate(object));\n    };\n    self = {\n      addObject: addObject,\n      objectRemoved: function(object) {\n        return container.removeChild(object.$element);\n      },\n      nextCard: function() {\n        currentCardIndex += 1;\n        return currentCard = deck.cards[currentCardIndex];\n      },\n      newCard: function(data) {\n        if (data == null) {\n          data = {};\n        }\n        return deck.cards.push(Card(data));\n      },\n      render: function() {\n        return root.objects.forEach(function(object) {\n          return container.appendChild(hydrate(object));\n        });\n      },\n      container: container\n    };\n    controlButtons.forEach(addObject);\n    return self;\n  };\n\n  editor = Editor(deck);\n\n  global.say = function(text) {\n    return alert(text);\n  };\n\n  document.body.appendChild(editor.container);\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"remoteDependencies\":[\"https://cdnjs.cloudflare.com/ajax/libs/coffee-script/1.7.1/coffee-script.min.js\"],\"dependencies\":{\"require\":\"distri/require:v0.5.0\"}};",
      "type": "blob"
    },
    "util": {
      "path": "util",
      "content": "(function() {\n  var __slice = [].slice;\n\n  module.exports = {\n    exec: function(code, context, params) {\n      var names, values;\n      if (params == null) {\n        params = {};\n      }\n      names = Object.keys(params);\n      values = names.map(function(name) {\n        return params[name];\n      });\n      return Function.apply(null, __slice.call(names).concat([code])).apply(context, values);\n    }\n  };\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "entryPoint": "main",
  "remoteDependencies": [
    "https://cdnjs.cloudflare.com/ajax/libs/coffee-script/1.7.1/coffee-script.min.js"
  ],
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "STRd6/hyperweb",
    "homepage": null,
    "description": "Prototyping some hypercard-ish ideas.",
    "html_url": "https://github.com/STRd6/hyperweb",
    "url": "https://api.github.com/repos/STRd6/hyperweb",
    "publishBranch": "gh-pages"
  },
  "dependencies": {
    "require": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "mode": "100644",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "content": "require\n=======\n\nRequire system for self replicating client side apps\n\n[Docs](http://distri.github.io/require/docs)\n",
          "mode": "100644",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "content": "Require\n=======\n\nA Node.js compatible require implementation for pure client side apps.\n\nEach file is a module. Modules are responsible for exporting an object. Unlike\ntraditional client side JavaScript, Ruby, or other common languages the module\nis not responsible for naming its product in the context of the requirer. This\nmaintains encapsulation because it is impossible from within a module to know\nwhat external name would be correct to prevent errors of composition in all\npossible uses.\n\nUses\n----\n\nFrom a module require another module in the same package.\n\n>     require \"./soup\"\n\nRequire a module in the parent directory\n\n>     require \"../nuts\"\n\nRequire a module from the root directory in the same package.\n\nNOTE: This could behave slightly differently under Node.js if your package does\nnot have it's own isolated filesystem.\n\n>     require \"/silence\"\n\nFrom a module within a package, require a dependent package.\n\n>     require \"console\"\n\nThe dependency could be delcared in pixie.cson as follows:\n\n>     dependencies:\n>       console: \"http://strd6.github.io/console/v1.2.2.json\"\n\nYou can require a package directly from its JSON representation as well.\n\n>     $.getJSON(packageURL)\n>     .then (pkg) ->\n>       require pkg\n\nImplementation\n--------------\n\nFile separator is '/'\n\n    fileSeparator = '/'\n\nIn the browser `global` is `self`.\n\n    global = self\n\nDefault entry point\n\n    defaultEntryPoint = \"main\"\n\nA sentinal against circular requires.\n\n    circularGuard = {}\n\nA top-level module so that all other modules won't have to be orphans.\n\n    rootModule =\n      path: \"\"\n\nRequire a module given a path within a package. Each file is its own separate\nmodule. An application is composed of packages.\n\n    loadPath = (parentModule, pkg, path) ->\n      if startsWith(path, '/')\n        localPath = []\n      else\n        localPath = parentModule.path.split(fileSeparator)\n\n      normalizedPath = normalizePath(path, localPath)\n\n      cache = cacheFor(pkg)\n\n      if module = cache[normalizedPath]\n        if module is circularGuard\n          throw \"Circular dependency detected when requiring #{normalizedPath}\"\n      else\n        cache[normalizedPath] = circularGuard\n\n        try\n          cache[normalizedPath] = module = loadModule(pkg, normalizedPath)\n        finally\n          delete cache[normalizedPath] if cache[normalizedPath] is circularGuard\n\n      return module.exports\n\nTo normalize the path we convert local paths to a standard form that does not\ncontain an references to current or parent directories.\n\n    normalizePath = (path, base=[]) ->\n      base = base.concat path.split(fileSeparator)\n      result = []\n\nChew up all the pieces into a standardized path.\n\n      while base.length\n        switch piece = base.shift()\n          when \"..\"\n            result.pop()\n          when \"\", \".\"\n            # Skip\n          else\n            result.push(piece)\n\n      return result.join(fileSeparator)\n\n`loadPackage` Loads a dependent package at that packages entry point.\n\n    loadPackage = (pkg) ->\n      path = pkg.entryPoint or defaultEntryPoint\n\n      loadPath(rootModule, pkg, path)\n\nLoad a file from within a package.\n\n    loadModule = (pkg, path) ->\n      unless (file = pkg.distribution[path])\n        throw \"Could not find file at #{path} in #{pkg.name}\"\n\n      unless (content = file.content)?\n        throw \"Malformed package. No content for file at #{path} in #{pkg.name}\"\n\n      program = annotateSourceURL content, pkg, path\n      dirname = path.split(fileSeparator)[0...-1].join(fileSeparator)\n\n      module =\n        path: dirname\n        exports: {}\n\nThis external context provides some variable that modules have access to.\n\nA `require` function is exposed to modules so they may require other modules.\n\nAdditional properties such as a reference to the global object and some metadata\nare also exposed.\n\n      context =\n        require: generateRequireFn(pkg, module)\n        global: global\n        module: module\n        exports: module.exports\n        PACKAGE: pkg\n        __filename: path\n        __dirname: dirname\n\n      args = Object.keys(context)\n      values = args.map (name) -> context[name]\n\nExecute the program within the module and given context.\n\n      Function(args..., program).apply(module, values)\n\n      return module\n\nHelper to detect if a given path is a package.\n\n    isPackage = (path) ->\n      if !(startsWith(path, fileSeparator) or\n        startsWith(path, \".#{fileSeparator}\") or\n        startsWith(path, \"..#{fileSeparator}\")\n      )\n        path.split(fileSeparator)[0]\n      else\n        false\n\nGenerate a require function for a given module in a package.\n\nIf we are loading a package in another module then we strip out the module part\nof the name and use the `rootModule` rather than the local module we came from.\nThat way our local path won't affect the lookup path in another package.\n\nLoading a module within our package, uses the requiring module as a parent for\nlocal path resolution.\n\n    generateRequireFn = (pkg, module=rootModule) ->\n      pkg.name ?= \"ROOT\"\n      pkg.scopedName ?= \"ROOT\"\n\n      (path) ->\n        if typeof path is \"object\"\n          loadPackage(path)\n        else if isPackage(path)\n          unless otherPackage = pkg.dependencies[path]\n            throw \"Package: #{path} not found.\"\n\n          otherPackage.name ?= path\n          otherPackage.scopedName ?= \"#{pkg.scopedName}:#{path}\"\n\n          loadPackage(otherPackage)\n        else\n          loadPath(module, pkg, path)\n\nBecause we can't actually `require('require')` we need to export it a little\ndifferently.\n\n    publicAPI =\n      generateFor: generateRequireFn\n\nWrap a package as a string that will bootstrap `require` and execute the package.\nThis can be used for generating standalone HTML pages, scripts, and tests.\n\n      packageWrapper: (pkg, code) ->\n        \"\"\"\n          ;(function(PACKAGE) {\n            var oldRequire = self.Require;\n            #{PACKAGE.distribution.main.content}\n            var require = Require.generateFor(PACKAGE);\n            #{code};\n            self.Require = oldRequire;\n          })(#{JSON.stringify(pkg, null, 2)});\n        \"\"\"\n\nWrap a package as a string that will execute its entry point.\n\n      executePackageWrapper: (pkg) ->\n        publicAPI.packageWrapper pkg, \"require('./#{pkg.entryPoint}')\"\n\n    if exports?\n      module.exports = publicAPI\n    else\n      global.Require = publicAPI\n\nNotes\n-----\n\nWe have to use `pkg` as a variable name because `package` is a reserved word.\n\nNode needs to check file extensions, but because we only load compiled products\nwe never have extensions in our path.\n\nSo while Node may need to check for either `path/somefile.js` or `path/somefile.coffee`\nthat will already have been resolved for us and we will only check `path/somefile`\n\nCircular dependencies are not allowed and raise an exception when detected.\n\nHelpers\n-------\n\nDetect if a string starts with a given prefix.\n\n    startsWith = (string, prefix) ->\n      string.lastIndexOf(prefix, 0) is 0\n\nCreates a cache for modules within a package. It uses `defineProperty` so that\nthe cache doesn't end up being enumerated or serialized to json.\n\n    cacheFor = (pkg) ->\n      return pkg.cache if pkg.cache\n\n      Object.defineProperty pkg, \"cache\",\n        value: {}\n\n      return pkg.cache\n\nAnnotate a program with a source url so we can debug in Chrome's dev tools.\n\n    annotateSourceURL = (program, pkg, path) ->\n      \"\"\"\n        #{program}\n        //# sourceURL=#{pkg.scopedName}/#{path}\n      \"\"\"\n\nDefinitions\n-----------\n\n### Module\n\nA module is a file.\n\n### Package\n\nA package is an aggregation of modules. A package is a json object with the\nfollowing properties:\n\n- `distribution` An object whose keys are paths and properties are `fileData`\n- `entryPoint` Path to the primary module that requiring this package will require.\n- `dependencies` An object whose keys are names and whose values are packages.\n\nIt may have additional properties such as `source`, `repository`, and `docs`.\n\n### Application\n\nAn application is a package which has an `entryPoint` and may have dependencies.\nAdditionally an application's dependencies may have dependencies. Dependencies\nmust be bundled with the package.\n",
          "mode": "100644",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "content": "version: \"0.5.0\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "samples/circular.coffee": {
          "path": "samples/circular.coffee",
          "content": "# This test file illustrates a circular requirement and should throw an error.\n\nrequire \"./circular\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "samples/random.coffee": {
          "path": "samples/random.coffee",
          "content": "# Returns a random value, used for testing caching\n\nmodule.exports = Math.random()\n",
          "mode": "100644",
          "type": "blob"
        },
        "samples/terminal.coffee": {
          "path": "samples/terminal.coffee",
          "content": "# A test file for requiring a file that has no dependencies. It should succeed.\n\nexports.something = true\n",
          "mode": "100644",
          "type": "blob"
        },
        "samples/throws.coffee": {
          "path": "samples/throws.coffee",
          "content": "# A test file that throws an error.\n\nthrow \"yolo\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "test/require.coffee.md": {
          "path": "test/require.coffee.md",
          "content": "Testing out this crazy require thing\n\n    # Load our latest require code for testing\n    # NOTE: This causes the root for relative requires to be at the root dir, not the test dir\n    latestRequire = require('/main').generateFor(PACKAGE)\n\n    describe \"PACKAGE\", ->\n      it \"should be named 'ROOT'\", ->\n        assert.equal PACKAGE.name, \"ROOT\"\n\n    describe \"require\", ->\n      it \"should not exist globally\", ->\n        assert !global.require\n\n      it \"should be able to require a file that exists with a relative path\", ->\n        assert latestRequire('/samples/terminal')\n\n      it \"should get whatever the file exports\", ->\n        assert latestRequire('/samples/terminal').something\n\n      it \"should not get something the file doesn't export\", ->\n        assert !latestRequire('/samples/terminal').something2\n\n      it \"should throw a descriptive error when requring circular dependencies\", ->\n        assert.throws ->\n          latestRequire('/samples/circular')\n        , /circular/i\n\n      it \"should throw a descriptive error when requiring a package that doesn't exist\", ->\n        assert.throws ->\n          latestRequire \"does_not_exist\"\n        , /not found/i\n\n      it \"should throw a descriptive error when requiring a relative path that doesn't exist\", ->\n        assert.throws ->\n          latestRequire \"/does_not_exist\"\n        , /Could not find file/i\n\n      it \"should recover gracefully enough from requiring files that throw errors\", ->\n        assert.throws ->\n          latestRequire \"/samples/throws\"\n\n        assert.throws ->\n          latestRequire \"/samples/throws\"\n        , (err) ->\n          !/circular/i.test err\n\n      it \"should cache modules\", ->\n        result = latestRequire(\"/samples/random\")\n\n        assert.equal latestRequire(\"/samples/random\"), result\n\n      it \"should be able to require a JSON package object\", ->\n        SAMPLE_PACKAGE =\n          entryPoint: \"main\"\n          distribution:\n            main:\n              content: \"module.exports = require('./other')\"\n            other:\n              content: \"module.exports = 'TEST'\"\n\n        result = latestRequire SAMPLE_PACKAGE\n\n        assert.equal \"TEST\", result\n\n    describe \"package wrapper\", ->\n      it \"should be able to generate a package wrapper\", ->\n        assert require('/main').executePackageWrapper(PACKAGE)\n\n      it \"should be able to execute code in the package context\", ->\n        assert require('/main').packageWrapper(PACKAGE, \"my_codezz\")\n\n    describe \"module context\", ->\n      it \"should know __dirname\", ->\n        assert.equal \"test\", __dirname\n\n      it \"should know __filename\", ->\n        assert __filename\n\n      it \"should know its package\", ->\n        assert PACKAGE\n\n    describe \"malformed package\", ->\n      malformedPackage =\n        distribution:\n          yolo: \"No content!\"\n\n      it \"should throw an error when attempting to require a malformed file in a package distribution\", ->\n        r = require('/main').generateFor(malformedPackage)\n\n        assert.throws ->\n          r.require \"yolo\"\n        , (err) ->\n          !/malformed/i.test err\n\n    describe \"dependent packages\", ->\n      PACKAGE.dependencies[\"test-package\"] =\n        distribution:\n          main:\n            content: \"module.exports = PACKAGE.name\"\n\n      PACKAGE.dependencies[\"strange/name\"] =\n        distribution:\n          main:\n            content: \"\"\n\n      it \"should raise an error when requiring a package that doesn't exist\", ->\n        assert.throws ->\n          latestRequire \"nonexistent\"\n        , (err) ->\n          /nonexistent/i.test err\n\n      it \"should be able to require a package that exists\", ->\n        assert latestRequire(\"test-package\")\n\n      it \"Dependent packages should know their names when required\", ->\n        assert.equal latestRequire(\"test-package\"), \"test-package\"\n\n      it \"should be able to require by pretty much any name\", ->\n        assert latestRequire(\"strange/name\")\n",
          "mode": "100644",
          "type": "blob"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, publicAPI, rootModule, startsWith,\n    __slice = [].slice;\n\n  fileSeparator = '/';\n\n  global = self;\n\n  defaultEntryPoint = \"main\";\n\n  circularGuard = {};\n\n  rootModule = {\n    path: \"\"\n  };\n\n  loadPath = function(parentModule, pkg, path) {\n    var cache, localPath, module, normalizedPath;\n    if (startsWith(path, '/')) {\n      localPath = [];\n    } else {\n      localPath = parentModule.path.split(fileSeparator);\n    }\n    normalizedPath = normalizePath(path, localPath);\n    cache = cacheFor(pkg);\n    if (module = cache[normalizedPath]) {\n      if (module === circularGuard) {\n        throw \"Circular dependency detected when requiring \" + normalizedPath;\n      }\n    } else {\n      cache[normalizedPath] = circularGuard;\n      try {\n        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);\n      } finally {\n        if (cache[normalizedPath] === circularGuard) {\n          delete cache[normalizedPath];\n        }\n      }\n    }\n    return module.exports;\n  };\n\n  normalizePath = function(path, base) {\n    var piece, result;\n    if (base == null) {\n      base = [];\n    }\n    base = base.concat(path.split(fileSeparator));\n    result = [];\n    while (base.length) {\n      switch (piece = base.shift()) {\n        case \"..\":\n          result.pop();\n          break;\n        case \"\":\n        case \".\":\n          break;\n        default:\n          result.push(piece);\n      }\n    }\n    return result.join(fileSeparator);\n  };\n\n  loadPackage = function(pkg) {\n    var path;\n    path = pkg.entryPoint || defaultEntryPoint;\n    return loadPath(rootModule, pkg, path);\n  };\n\n  loadModule = function(pkg, path) {\n    var args, content, context, dirname, file, module, program, values;\n    if (!(file = pkg.distribution[path])) {\n      throw \"Could not find file at \" + path + \" in \" + pkg.name;\n    }\n    if ((content = file.content) == null) {\n      throw \"Malformed package. No content for file at \" + path + \" in \" + pkg.name;\n    }\n    program = annotateSourceURL(content, pkg, path);\n    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);\n    module = {\n      path: dirname,\n      exports: {}\n    };\n    context = {\n      require: generateRequireFn(pkg, module),\n      global: global,\n      module: module,\n      exports: module.exports,\n      PACKAGE: pkg,\n      __filename: path,\n      __dirname: dirname\n    };\n    args = Object.keys(context);\n    values = args.map(function(name) {\n      return context[name];\n    });\n    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);\n    return module;\n  };\n\n  isPackage = function(path) {\n    if (!(startsWith(path, fileSeparator) || startsWith(path, \".\" + fileSeparator) || startsWith(path, \"..\" + fileSeparator))) {\n      return path.split(fileSeparator)[0];\n    } else {\n      return false;\n    }\n  };\n\n  generateRequireFn = function(pkg, module) {\n    if (module == null) {\n      module = rootModule;\n    }\n    if (pkg.name == null) {\n      pkg.name = \"ROOT\";\n    }\n    if (pkg.scopedName == null) {\n      pkg.scopedName = \"ROOT\";\n    }\n    return function(path) {\n      var otherPackage;\n      if (typeof path === \"object\") {\n        return loadPackage(path);\n      } else if (isPackage(path)) {\n        if (!(otherPackage = pkg.dependencies[path])) {\n          throw \"Package: \" + path + \" not found.\";\n        }\n        if (otherPackage.name == null) {\n          otherPackage.name = path;\n        }\n        if (otherPackage.scopedName == null) {\n          otherPackage.scopedName = \"\" + pkg.scopedName + \":\" + path;\n        }\n        return loadPackage(otherPackage);\n      } else {\n        return loadPath(module, pkg, path);\n      }\n    };\n  };\n\n  publicAPI = {\n    generateFor: generateRequireFn,\n    packageWrapper: function(pkg, code) {\n      return \";(function(PACKAGE) {\\n  var oldRequire = self.Require;\\n  \" + PACKAGE.distribution.main.content + \"\\n  var require = Require.generateFor(PACKAGE);\\n  \" + code + \";\\n  self.Require = oldRequire;\\n})(\" + (JSON.stringify(pkg, null, 2)) + \");\";\n    },\n    executePackageWrapper: function(pkg) {\n      return publicAPI.packageWrapper(pkg, \"require('./\" + pkg.entryPoint + \"')\");\n    }\n  };\n\n  if (typeof exports !== \"undefined\" && exports !== null) {\n    module.exports = publicAPI;\n  } else {\n    global.Require = publicAPI;\n  }\n\n  startsWith = function(string, prefix) {\n    return string.lastIndexOf(prefix, 0) === 0;\n  };\n\n  cacheFor = function(pkg) {\n    if (pkg.cache) {\n      return pkg.cache;\n    }\n    Object.defineProperty(pkg, \"cache\", {\n      value: {}\n    });\n    return pkg.cache;\n  };\n\n  annotateSourceURL = function(program, pkg, path) {\n    return \"\" + program + \"\\n//# sourceURL=\" + pkg.scopedName + \"/\" + path;\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.5.0\"};",
          "type": "blob"
        },
        "samples/circular": {
          "path": "samples/circular",
          "content": "(function() {\n  require(\"./circular\");\n\n}).call(this);\n",
          "type": "blob"
        },
        "samples/random": {
          "path": "samples/random",
          "content": "(function() {\n  module.exports = Math.random();\n\n}).call(this);\n",
          "type": "blob"
        },
        "samples/terminal": {
          "path": "samples/terminal",
          "content": "(function() {\n  exports.something = true;\n\n}).call(this);\n",
          "type": "blob"
        },
        "samples/throws": {
          "path": "samples/throws",
          "content": "(function() {\n  throw \"yolo\";\n\n}).call(this);\n",
          "type": "blob"
        },
        "test/require": {
          "path": "test/require",
          "content": "(function() {\n  var latestRequire;\n\n  latestRequire = require('/main').generateFor(PACKAGE);\n\n  describe(\"PACKAGE\", function() {\n    return it(\"should be named 'ROOT'\", function() {\n      return assert.equal(PACKAGE.name, \"ROOT\");\n    });\n  });\n\n  describe(\"require\", function() {\n    it(\"should not exist globally\", function() {\n      return assert(!global.require);\n    });\n    it(\"should be able to require a file that exists with a relative path\", function() {\n      return assert(latestRequire('/samples/terminal'));\n    });\n    it(\"should get whatever the file exports\", function() {\n      return assert(latestRequire('/samples/terminal').something);\n    });\n    it(\"should not get something the file doesn't export\", function() {\n      return assert(!latestRequire('/samples/terminal').something2);\n    });\n    it(\"should throw a descriptive error when requring circular dependencies\", function() {\n      return assert.throws(function() {\n        return latestRequire('/samples/circular');\n      }, /circular/i);\n    });\n    it(\"should throw a descriptive error when requiring a package that doesn't exist\", function() {\n      return assert.throws(function() {\n        return latestRequire(\"does_not_exist\");\n      }, /not found/i);\n    });\n    it(\"should throw a descriptive error when requiring a relative path that doesn't exist\", function() {\n      return assert.throws(function() {\n        return latestRequire(\"/does_not_exist\");\n      }, /Could not find file/i);\n    });\n    it(\"should recover gracefully enough from requiring files that throw errors\", function() {\n      assert.throws(function() {\n        return latestRequire(\"/samples/throws\");\n      });\n      return assert.throws(function() {\n        return latestRequire(\"/samples/throws\");\n      }, function(err) {\n        return !/circular/i.test(err);\n      });\n    });\n    it(\"should cache modules\", function() {\n      var result;\n      result = latestRequire(\"/samples/random\");\n      return assert.equal(latestRequire(\"/samples/random\"), result);\n    });\n    return it(\"should be able to require a JSON package object\", function() {\n      var SAMPLE_PACKAGE, result;\n      SAMPLE_PACKAGE = {\n        entryPoint: \"main\",\n        distribution: {\n          main: {\n            content: \"module.exports = require('./other')\"\n          },\n          other: {\n            content: \"module.exports = 'TEST'\"\n          }\n        }\n      };\n      result = latestRequire(SAMPLE_PACKAGE);\n      return assert.equal(\"TEST\", result);\n    });\n  });\n\n  describe(\"package wrapper\", function() {\n    it(\"should be able to generate a package wrapper\", function() {\n      return assert(require('/main').executePackageWrapper(PACKAGE));\n    });\n    return it(\"should be able to execute code in the package context\", function() {\n      return assert(require('/main').packageWrapper(PACKAGE, \"my_codezz\"));\n    });\n  });\n\n  describe(\"module context\", function() {\n    it(\"should know __dirname\", function() {\n      return assert.equal(\"test\", __dirname);\n    });\n    it(\"should know __filename\", function() {\n      return assert(__filename);\n    });\n    return it(\"should know its package\", function() {\n      return assert(PACKAGE);\n    });\n  });\n\n  describe(\"malformed package\", function() {\n    var malformedPackage;\n    malformedPackage = {\n      distribution: {\n        yolo: \"No content!\"\n      }\n    };\n    return it(\"should throw an error when attempting to require a malformed file in a package distribution\", function() {\n      var r;\n      r = require('/main').generateFor(malformedPackage);\n      return assert.throws(function() {\n        return r.require(\"yolo\");\n      }, function(err) {\n        return !/malformed/i.test(err);\n      });\n    });\n  });\n\n  describe(\"dependent packages\", function() {\n    PACKAGE.dependencies[\"test-package\"] = {\n      distribution: {\n        main: {\n          content: \"module.exports = PACKAGE.name\"\n        }\n      }\n    };\n    PACKAGE.dependencies[\"strange/name\"] = {\n      distribution: {\n        main: {\n          content: \"\"\n        }\n      }\n    };\n    it(\"should raise an error when requiring a package that doesn't exist\", function() {\n      return assert.throws(function() {\n        return latestRequire(\"nonexistent\");\n      }, function(err) {\n        return /nonexistent/i.test(err);\n      });\n    });\n    it(\"should be able to require a package that exists\", function() {\n      return assert(latestRequire(\"test-package\"));\n    });\n    it(\"Dependent packages should know their names when required\", function() {\n      return assert.equal(latestRequire(\"test-package\"), \"test-package\");\n    });\n    return it(\"should be able to require by pretty much any name\", function() {\n      return assert(latestRequire(\"strange/name\"));\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://www.danielx.net/editor/"
      },
      "version": "0.5.0",
      "entryPoint": "main",
      "repository": {
        "branch": "v0.5.0",
        "default_branch": "master",
        "full_name": "distri/require",
        "homepage": null,
        "description": "Require system for self replicating client side apps",
        "html_url": "https://github.com/distri/require",
        "url": "https://api.github.com/repos/distri/require",
        "publishBranch": "gh-pages"
      },
      "dependencies": {}
    }
  }
});