(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Log = Package.logging.Log;
var _ = Package.underscore._;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var Boilerplate = Package['boilerplate-generator'].Boilerplate;
var WebAppHashing = Package['webapp-hashing'].WebAppHashing;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var WebApp, WebAppInternals, main;

var require = meteorInstall({"node_modules":{"meteor":{"webapp":{"webapp_server.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/webapp/webapp_server.js                                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
!function (module1) {
  let _objectSpread;

  module1.link("@babel/runtime/helpers/objectSpread2", {
    default(v) {
      _objectSpread = v;
    }

  }, 0);
  module1.export({
    WebApp: () => WebApp,
    WebAppInternals: () => WebAppInternals
  });
  let assert;
  module1.link("assert", {
    default(v) {
      assert = v;
    }

  }, 0);
  let readFileSync;
  module1.link("fs", {
    readFileSync(v) {
      readFileSync = v;
    }

  }, 1);
  let createServer;
  module1.link("http", {
    createServer(v) {
      createServer = v;
    }

  }, 2);
  let pathJoin, pathDirname;
  module1.link("path", {
    join(v) {
      pathJoin = v;
    },

    dirname(v) {
      pathDirname = v;
    }

  }, 3);
  let parseUrl;
  module1.link("url", {
    parse(v) {
      parseUrl = v;
    }

  }, 4);
  let createHash;
  module1.link("crypto", {
    createHash(v) {
      createHash = v;
    }

  }, 5);
  let connect;
  module1.link("./connect.js", {
    connect(v) {
      connect = v;
    }

  }, 6);
  let compress;
  module1.link("compression", {
    default(v) {
      compress = v;
    }

  }, 7);
  let cookieParser;
  module1.link("cookie-parser", {
    default(v) {
      cookieParser = v;
    }

  }, 8);
  let qs;
  module1.link("qs", {
    default(v) {
      qs = v;
    }

  }, 9);
  let parseRequest;
  module1.link("parseurl", {
    default(v) {
      parseRequest = v;
    }

  }, 10);
  let basicAuth;
  module1.link("basic-auth-connect", {
    default(v) {
      basicAuth = v;
    }

  }, 11);
  let lookupUserAgent;
  module1.link("useragent", {
    lookup(v) {
      lookupUserAgent = v;
    }

  }, 12);
  let isModern;
  module1.link("meteor/modern-browsers", {
    isModern(v) {
      isModern = v;
    }

  }, 13);
  let send;
  module1.link("send", {
    default(v) {
      send = v;
    }

  }, 14);
  let removeExistingSocketFile, registerSocketFileCleanup;
  module1.link("./socket_file.js", {
    removeExistingSocketFile(v) {
      removeExistingSocketFile = v;
    },

    registerSocketFileCleanup(v) {
      registerSocketFileCleanup = v;
    }

  }, 15);
  let onMessage;
  module1.link("meteor/inter-process-messaging", {
    onMessage(v) {
      onMessage = v;
    }

  }, 16);
  var SHORT_SOCKET_TIMEOUT = 5 * 1000;
  var LONG_SOCKET_TIMEOUT = 120 * 1000;
  const WebApp = {};
  const WebAppInternals = {};
  const hasOwn = Object.prototype.hasOwnProperty; // backwards compat to 2.0 of connect

  connect.basicAuth = basicAuth;
  WebAppInternals.NpmModules = {
    connect: {
      version: Npm.require('connect/package.json').version,
      module: connect
    }
  }; // Though we might prefer to use web.browser (modern) as the default
  // architecture, safety requires a more compatible defaultArch.

  WebApp.defaultArch = 'web.browser.legacy'; // XXX maps archs to manifests

  WebApp.clientPrograms = {}; // XXX maps archs to program path on filesystem

  var archPath = {};

  var bundledJsCssUrlRewriteHook = function (url) {
    var bundledPrefix = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || '';
    return bundledPrefix + url;
  };

  var sha1 = function (contents) {
    var hash = createHash('sha1');
    hash.update(contents);
    return hash.digest('hex');
  };

  function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false;
    } // fallback to standard filter function


    return compress.filter(req, res);
  }

  ; // #BrowserIdentification
  //
  // We have multiple places that want to identify the browser: the
  // unsupported browser page, the appcache package, and, eventually
  // delivering browser polyfills only as needed.
  //
  // To avoid detecting the browser in multiple places ad-hoc, we create a
  // Meteor "browser" object. It uses but does not expose the npm
  // useragent module (we could choose a different mechanism to identify
  // the browser in the future if we wanted to).  The browser object
  // contains
  //
  // * `name`: the name of the browser in camel case
  // * `major`, `minor`, `patch`: integers describing the browser version
  //
  // Also here is an early version of a Meteor `request` object, intended
  // to be a high-level description of the request without exposing
  // details of connect's low-level `req`.  Currently it contains:
  //
  // * `browser`: browser identification object described above
  // * `url`: parsed url, including parsed query params
  //
  // As a temporary hack there is a `categorizeRequest` function on WebApp which
  // converts a connect `req` to a Meteor `request`. This can go away once smart
  // packages such as appcache are being passed a `request` object directly when
  // they serve content.
  //
  // This allows `request` to be used uniformly: it is passed to the html
  // attributes hook, and the appcache package can use it when deciding
  // whether to generate a 404 for the manifest.
  //
  // Real routing / server side rendering will probably refactor this
  // heavily.
  // e.g. "Mobile Safari" => "mobileSafari"

  var camelCase = function (name) {
    var parts = name.split(' ');
    parts[0] = parts[0].toLowerCase();

    for (var i = 1; i < parts.length; ++i) {
      parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].substr(1);
    }

    return parts.join('');
  };

  var identifyBrowser = function (userAgentString) {
    var userAgent = lookupUserAgent(userAgentString);
    return {
      name: camelCase(userAgent.family),
      major: +userAgent.major,
      minor: +userAgent.minor,
      patch: +userAgent.patch
    };
  }; // XXX Refactor as part of implementing real routing.


  WebAppInternals.identifyBrowser = identifyBrowser;

  WebApp.categorizeRequest = function (req) {
    return _.extend({
      browser: identifyBrowser(req.headers['user-agent']),
      url: parseUrl(req.url, true)
    }, _.pick(req, 'dynamicHead', 'dynamicBody', 'headers', 'cookies'));
  }; // HTML attribute hooks: functions to be called to determine any attributes to
  // be added to the '<html>' tag. Each function is passed a 'request' object (see
  // #BrowserIdentification) and should return null or object.


  var htmlAttributeHooks = [];

  var getHtmlAttributes = function (request) {
    var combinedAttributes = {};

    _.each(htmlAttributeHooks || [], function (hook) {
      var attributes = hook(request);
      if (attributes === null) return;
      if (typeof attributes !== 'object') throw Error("HTML attribute hook must return null or object");

      _.extend(combinedAttributes, attributes);
    });

    return combinedAttributes;
  };

  WebApp.addHtmlAttributeHook = function (hook) {
    htmlAttributeHooks.push(hook);
  }; // Serve app HTML for this URL?


  var appUrl = function (url) {
    if (url === '/favicon.ico' || url === '/robots.txt') return false; // NOTE: app.manifest is not a web standard like favicon.ico and
    // robots.txt. It is a file name we have chosen to use for HTML5
    // appcache URLs. It is included here to prevent using an appcache
    // then removing it from poisoning an app permanently. Eventually,
    // once we have server side routing, this won't be needed as
    // unknown URLs with return a 404 automatically.

    if (url === '/app.manifest') return false; // Avoid serving app HTML for declared routes such as /sockjs/.

    if (RoutePolicy.classify(url)) return false; // we currently return app HTML on all URLs by default

    return true;
  }; // We need to calculate the client hash after all packages have loaded
  // to give them a chance to populate __meteor_runtime_config__.
  //
  // Calculating the hash during startup means that packages can only
  // populate __meteor_runtime_config__ during load, not during startup.
  //
  // Calculating instead it at the beginning of main after all startup
  // hooks had run would allow packages to also populate
  // __meteor_runtime_config__ during startup, but that's too late for
  // autoupdate because it needs to have the client hash at startup to
  // insert the auto update version itself into
  // __meteor_runtime_config__ to get it to the client.
  //
  // An alternative would be to give autoupdate a "post-start,
  // pre-listen" hook to allow it to insert the auto update version at
  // the right moment.


  Meteor.startup(function () {
    function getter(key) {
      return function (arch) {
        arch = arch || WebApp.defaultArch;
        const program = WebApp.clientPrograms[arch];
        const value = program && program[key]; // If this is the first time we have calculated this hash,
        // program[key] will be a thunk (lazy function with no parameters)
        // that we should call to do the actual computation.

        return typeof value === "function" ? program[key] = value() : value;
      };
    }

    WebApp.calculateClientHash = WebApp.clientHash = getter("version");
    WebApp.calculateClientHashRefreshable = getter("versionRefreshable");
    WebApp.calculateClientHashNonRefreshable = getter("versionNonRefreshable");
    WebApp.getRefreshableAssets = getter("refreshableAssets");
  }); // When we have a request pending, we want the socket timeout to be long, to
  // give ourselves a while to serve it, and to allow sockjs long polls to
  // complete.  On the other hand, we want to close idle sockets relatively
  // quickly, so that we can shut down relatively promptly but cleanly, without
  // cutting off anyone's response.

  WebApp._timeoutAdjustmentRequestCallback = function (req, res) {
    // this is really just req.socket.setTimeout(LONG_SOCKET_TIMEOUT);
    req.setTimeout(LONG_SOCKET_TIMEOUT); // Insert our new finish listener to run BEFORE the existing one which removes
    // the response from the socket.

    var finishListeners = res.listeners('finish'); // XXX Apparently in Node 0.12 this event was called 'prefinish'.
    // https://github.com/joyent/node/commit/7c9b6070
    // But it has switched back to 'finish' in Node v4:
    // https://github.com/nodejs/node/pull/1411

    res.removeAllListeners('finish');
    res.on('finish', function () {
      res.setTimeout(SHORT_SOCKET_TIMEOUT);
    });

    _.each(finishListeners, function (l) {
      res.on('finish', l);
    });
  }; // Will be updated by main before we listen.
  // Map from client arch to boilerplate object.
  // Boilerplate object has:
  //   - func: XXX
  //   - baseData: XXX


  var boilerplateByArch = {}; // Register a callback function that can selectively modify boilerplate
  // data given arguments (request, data, arch). The key should be a unique
  // identifier, to prevent accumulating duplicate callbacks from the same
  // call site over time. Callbacks will be called in the order they were
  // registered. A callback should return false if it did not make any
  // changes affecting the boilerplate. Passing null deletes the callback.
  // Any previous callback registered for this key will be returned.

  const boilerplateDataCallbacks = Object.create(null);

  WebAppInternals.registerBoilerplateDataCallback = function (key, callback) {
    const previousCallback = boilerplateDataCallbacks[key];

    if (typeof callback === "function") {
      boilerplateDataCallbacks[key] = callback;
    } else {
      assert.strictEqual(callback, null);
      delete boilerplateDataCallbacks[key];
    } // Return the previous callback in case the new callback needs to call
    // it; for example, when the new callback is a wrapper for the old.


    return previousCallback || null;
  }; // Given a request (as returned from `categorizeRequest`), return the
  // boilerplate HTML to serve for that request.
  //
  // If a previous connect middleware has rendered content for the head or body,
  // returns the boilerplate with that content patched in otherwise
  // memoizes on HTML attributes (used by, eg, appcache) and whether inline
  // scripts are currently allowed.
  // XXX so far this function is always called with arch === 'web.browser'


  function getBoilerplate(request, arch) {
    return getBoilerplateAsync(request, arch).await();
  }

  function getBoilerplateAsync(request, arch) {
    const boilerplate = boilerplateByArch[arch];
    const data = Object.assign({}, boilerplate.baseData, {
      htmlAttributes: getHtmlAttributes(request)
    }, _.pick(request, "dynamicHead", "dynamicBody"));
    let madeChanges = false;
    let promise = Promise.resolve();
    Object.keys(boilerplateDataCallbacks).forEach(key => {
      promise = promise.then(() => {
        const callback = boilerplateDataCallbacks[key];
        return callback(request, data, arch);
      }).then(result => {
        // Callbacks should return false if they did not make any changes.
        if (result !== false) {
          madeChanges = true;
        }
      });
    });
    return promise.then(() => ({
      stream: boilerplate.toHTMLStream(data),
      statusCode: data.statusCode,
      headers: data.headers
    }));
  }

  WebAppInternals.generateBoilerplateInstance = function (arch, manifest, additionalOptions) {
    additionalOptions = additionalOptions || {};
    const meteorRuntimeConfig = JSON.stringify(encodeURIComponent(JSON.stringify(_objectSpread({}, __meteor_runtime_config__, {}, additionalOptions.runtimeConfigOverrides || {}))));
    return new Boilerplate(arch, manifest, _.extend({
      pathMapper(itemPath) {
        return pathJoin(archPath[arch], itemPath);
      },

      baseDataExtension: {
        additionalStaticJs: _.map(additionalStaticJs || [], function (contents, pathname) {
          return {
            pathname: pathname,
            contents: contents
          };
        }),
        // Convert to a JSON string, then get rid of most weird characters, then
        // wrap in double quotes. (The outermost JSON.stringify really ought to
        // just be "wrap in double quotes" but we use it to be safe.) This might
        // end up inside a <script> tag so we need to be careful to not include
        // "</script>", but normal {{spacebars}} escaping escapes too much! See
        // https://github.com/meteor/meteor/issues/3730
        meteorRuntimeConfig,
        meteorRuntimeHash: sha1(meteorRuntimeConfig),
        rootUrlPathPrefix: __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || '',
        bundledJsCssUrlRewriteHook: bundledJsCssUrlRewriteHook,
        sriMode: sriMode,
        inlineScriptsAllowed: WebAppInternals.inlineScriptsAllowed(),
        inline: additionalOptions.inline
      }
    }, additionalOptions));
  }; // A mapping from url path to architecture (e.g. "web.browser") to static
  // file information with the following fields:
  // - type: the type of file to be served
  // - cacheable: optionally, whether the file should be cached or not
  // - sourceMapUrl: optionally, the url of the source map
  //
  // Info also contains one of the following:
  // - content: the stringified content that should be served at this path
  // - absolutePath: the absolute path on disk to the file
  // Serve static files from the manifest or added with
  // `addStaticJs`. Exported for tests.


  WebAppInternals.staticFilesMiddleware = function (staticFilesByArch, req, res, next) {
    return Promise.asyncApply(() => {
      if ('GET' != req.method && 'HEAD' != req.method && 'OPTIONS' != req.method) {
        next();
        return;
      }

      var pathname = parseRequest(req).pathname;

      try {
        pathname = decodeURIComponent(pathname);
      } catch (e) {
        next();
        return;
      }

      var serveStaticJs = function (s) {
        res.writeHead(200, {
          'Content-type': 'application/javascript; charset=UTF-8'
        });
        res.write(s);
        res.end();
      };

      if (_.has(additionalStaticJs, pathname) && !WebAppInternals.inlineScriptsAllowed()) {
        serveStaticJs(additionalStaticJs[pathname]);
        return;
      }

      const {
        arch,
        path
      } = getArchAndPath(pathname, identifyBrowser(req.headers["user-agent"]));

      if (!hasOwn.call(WebApp.clientPrograms, arch)) {
        // We could come here in case we run with some architectures excluded
        next();
        return;
      } // If pauseClient(arch) has been called, program.paused will be a
      // Promise that will be resolved when the program is unpaused.


      const program = WebApp.clientPrograms[arch];
      Promise.await(program.paused);

      if (path === "/meteor_runtime_config.js" && !WebAppInternals.inlineScriptsAllowed()) {
        serveStaticJs("__meteor_runtime_config__ = ".concat(program.meteorRuntimeConfig, ";"));
        return;
      }

      const info = getStaticFileInfo(staticFilesByArch, pathname, path, arch);

      if (!info) {
        next();
        return;
      } // We don't need to call pause because, unlike 'static', once we call into
      // 'send' and yield to the event loop, we never call another handler with
      // 'next'.
      // Cacheable files are files that should never change. Typically
      // named by their hash (eg meteor bundled js and css files).
      // We cache them ~forever (1yr).


      const maxAge = info.cacheable ? 1000 * 60 * 60 * 24 * 365 : 0;

      if (info.cacheable) {
        // Since we use req.headers["user-agent"] to determine whether the
        // client should receive modern or legacy resources, tell the client
        // to invalidate cached resources when/if its user agent string
        // changes in the future.
        res.setHeader("Vary", "User-Agent");
      } // Set the X-SourceMap header, which current Chrome, FireFox, and Safari
      // understand.  (The SourceMap header is slightly more spec-correct but FF
      // doesn't understand it.)
      //
      // You may also need to enable source maps in Chrome: open dev tools, click
      // the gear in the bottom right corner, and select "enable source maps".


      if (info.sourceMapUrl) {
        res.setHeader('X-SourceMap', __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + info.sourceMapUrl);
      }

      if (info.type === "js" || info.type === "dynamic js") {
        res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
      } else if (info.type === "css") {
        res.setHeader("Content-Type", "text/css; charset=UTF-8");
      } else if (info.type === "json") {
        res.setHeader("Content-Type", "application/json; charset=UTF-8");
      }

      if (info.hash) {
        res.setHeader('ETag', '"' + info.hash + '"');
      }

      if (info.content) {
        res.write(info.content);
        res.end();
      } else {
        send(req, info.absolutePath, {
          maxage: maxAge,
          dotfiles: 'allow',
          // if we specified a dotfile in the manifest, serve it
          lastModified: false // don't set last-modified based on the file date

        }).on('error', function (err) {
          Log.error("Error serving static file " + err);
          res.writeHead(500);
          res.end();
        }).on('directory', function () {
          Log.error("Unexpected directory " + info.absolutePath);
          res.writeHead(500);
          res.end();
        }).pipe(res);
      }
    });
  };

  function getStaticFileInfo(staticFilesByArch, originalPath, path, arch) {
    if (!hasOwn.call(WebApp.clientPrograms, arch)) {
      return null;
    } // Get a list of all available static file architectures, with arch
    // first in the list if it exists.


    const staticArchList = Object.keys(staticFilesByArch);
    const archIndex = staticArchList.indexOf(arch);

    if (archIndex > 0) {
      staticArchList.unshift(staticArchList.splice(archIndex, 1)[0]);
    }

    let info = null;
    staticArchList.some(arch => {
      const staticFiles = staticFilesByArch[arch];

      function finalize(path) {
        info = staticFiles[path]; // Sometimes we register a lazy function instead of actual data in
        // the staticFiles manifest.

        if (typeof info === "function") {
          info = staticFiles[path] = info();
        }

        return info;
      } // If staticFiles contains originalPath with the arch inferred above,
      // use that information.


      if (hasOwn.call(staticFiles, originalPath)) {
        return finalize(originalPath);
      } // If getArchAndPath returned an alternate path, try that instead.


      if (path !== originalPath && hasOwn.call(staticFiles, path)) {
        return finalize(path);
      }
    });
    return info;
  }

  function getArchAndPath(path, browser) {
    const pathParts = path.split("/");
    const archKey = pathParts[1];

    if (archKey.startsWith("__")) {
      const archCleaned = "web." + archKey.slice(2);

      if (hasOwn.call(WebApp.clientPrograms, archCleaned)) {
        pathParts.splice(1, 1); // Remove the archKey part.

        return {
          arch: archCleaned,
          path: pathParts.join("/")
        };
      }
    } // TODO Perhaps one day we could infer Cordova clients here, so that we
    // wouldn't have to use prefixed "/__cordova/..." URLs.


    const arch = isModern(browser) ? "web.browser" : "web.browser.legacy";

    if (hasOwn.call(WebApp.clientPrograms, arch)) {
      return {
        arch,
        path
      };
    }

    return {
      arch: WebApp.defaultArch,
      path
    };
  } // Parse the passed in port value. Return the port as-is if it's a String
  // (e.g. a Windows Server style named pipe), otherwise return the port as an
  // integer.
  //
  // DEPRECATED: Direct use of this function is not recommended; it is no
  // longer used internally, and will be removed in a future release.


  WebAppInternals.parsePort = port => {
    let parsedPort = parseInt(port);

    if (Number.isNaN(parsedPort)) {
      parsedPort = port;
    }

    return parsedPort;
  };

  onMessage("webapp-pause-client", (_ref) => Promise.asyncApply(() => {
    let {
      arch
    } = _ref;
    WebAppInternals.pauseClient(arch);
  }));
  onMessage("webapp-reload-client", (_ref2) => Promise.asyncApply(() => {
    let {
      arch
    } = _ref2;
    WebAppInternals.generateClientProgram(arch);
  }));

  function runWebAppServer() {
    var shuttingDown = false;
    var syncQueue = new Meteor._SynchronousQueue();

    var getItemPathname = function (itemUrl) {
      return decodeURIComponent(parseUrl(itemUrl).pathname);
    };

    WebAppInternals.reloadClientPrograms = function () {
      syncQueue.runTask(function () {
        const staticFilesByArch = Object.create(null);
        const {
          configJson
        } = __meteor_bootstrap__;
        const clientArchs = configJson.clientArchs || Object.keys(configJson.clientPaths);

        try {
          clientArchs.forEach(arch => {
            generateClientProgram(arch, staticFilesByArch);
          });
          WebAppInternals.staticFilesByArch = staticFilesByArch;
        } catch (e) {
          Log.error("Error reloading the client program: " + e.stack);
          process.exit(1);
        }
      });
    }; // Pause any incoming requests and make them wait for the program to be
    // unpaused the next time generateClientProgram(arch) is called.


    WebAppInternals.pauseClient = function (arch) {
      syncQueue.runTask(() => {
        const program = WebApp.clientPrograms[arch];
        const {
          unpause
        } = program;
        program.paused = new Promise(resolve => {
          if (typeof unpause === "function") {
            // If there happens to be an existing program.unpause function,
            // compose it with the resolve function.
            program.unpause = function () {
              unpause();
              resolve();
            };
          } else {
            program.unpause = resolve;
          }
        });
      });
    };

    WebAppInternals.generateClientProgram = function (arch) {
      syncQueue.runTask(() => generateClientProgram(arch));
    };

    function generateClientProgram(arch) {
      let staticFilesByArch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : WebAppInternals.staticFilesByArch;
      const clientDir = pathJoin(pathDirname(__meteor_bootstrap__.serverDir), arch); // read the control for the client we'll be serving up

      const programJsonPath = pathJoin(clientDir, "program.json");
      let programJson;

      try {
        programJson = JSON.parse(readFileSync(programJsonPath));
      } catch (e) {
        if (e.code === "ENOENT") return;
        throw e;
      }

      if (programJson.format !== "web-program-pre1") {
        throw new Error("Unsupported format for client assets: " + JSON.stringify(programJson.format));
      }

      if (!programJsonPath || !clientDir || !programJson) {
        throw new Error("Client config file not parsed.");
      }

      archPath[arch] = clientDir;
      const staticFiles = staticFilesByArch[arch] = Object.create(null);
      const {
        manifest
      } = programJson;
      manifest.forEach(item => {
        if (item.url && item.where === "client") {
          staticFiles[getItemPathname(item.url)] = {
            absolutePath: pathJoin(clientDir, item.path),
            cacheable: item.cacheable,
            hash: item.hash,
            // Link from source to its map
            sourceMapUrl: item.sourceMapUrl,
            type: item.type
          };

          if (item.sourceMap) {
            // Serve the source map too, under the specified URL. We assume
            // all source maps are cacheable.
            staticFiles[getItemPathname(item.sourceMapUrl)] = {
              absolutePath: pathJoin(clientDir, item.sourceMap),
              cacheable: true
            };
          }
        }
      });
      const {
        PUBLIC_SETTINGS
      } = __meteor_runtime_config__;
      const configOverrides = {
        PUBLIC_SETTINGS
      };
      const oldProgram = WebApp.clientPrograms[arch];
      const newProgram = WebApp.clientPrograms[arch] = {
        format: "web-program-pre1",
        manifest: manifest,
        // Use arrow functions so that these versions can be lazily
        // calculated later, and so that they will not be included in the
        // staticFiles[manifestUrl].content string below.
        //
        // Note: these version calculations must be kept in agreement with
        // CordovaBuilder#appendVersion in tools/cordova/builder.js, or hot
        // code push will reload Cordova apps unnecessarily.
        version: () => WebAppHashing.calculateClientHash(manifest, null, configOverrides),
        versionRefreshable: () => WebAppHashing.calculateClientHash(manifest, type => type === "css", configOverrides),
        versionNonRefreshable: () => WebAppHashing.calculateClientHash(manifest, type => type !== "css", configOverrides),
        cordovaCompatibilityVersions: programJson.cordovaCompatibilityVersions,
        PUBLIC_SETTINGS
      }; // Expose program details as a string reachable via the following URL.

      const manifestUrlPrefix = "/__" + arch.replace(/^web\./, "");
      const manifestUrl = manifestUrlPrefix + getItemPathname("/manifest.json");

      staticFiles[manifestUrl] = () => {
        if (Package.autoupdate) {
          const {
            AUTOUPDATE_VERSION = Package.autoupdate.Autoupdate.autoupdateVersion
          } = process.env;

          if (AUTOUPDATE_VERSION) {
            newProgram.version = AUTOUPDATE_VERSION;
          }
        }

        if (typeof newProgram.version === "function") {
          newProgram.version = newProgram.version();
        }

        return {
          content: JSON.stringify(newProgram),
          cacheable: false,
          hash: newProgram.version,
          type: "json"
        };
      };

      generateBoilerplateForArch(arch); // If there are any requests waiting on oldProgram.paused, let them
      // continue now (using the new program).

      if (oldProgram && oldProgram.paused) {
        oldProgram.unpause();
      }
    }

    ;
    const defaultOptionsForArch = {
      'web.cordova': {
        runtimeConfigOverrides: {
          // XXX We use absoluteUrl() here so that we serve https://
          // URLs to cordova clients if force-ssl is in use. If we were
          // to use __meteor_runtime_config__.ROOT_URL instead of
          // absoluteUrl(), then Cordova clients would immediately get a
          // HCP setting their DDP_DEFAULT_CONNECTION_URL to
          // http://example.meteor.com. This breaks the app, because
          // force-ssl doesn't serve CORS headers on 302
          // redirects. (Plus it's undesirable to have clients
          // connecting to http://example.meteor.com when force-ssl is
          // in use.)
          DDP_DEFAULT_CONNECTION_URL: process.env.MOBILE_DDP_URL || Meteor.absoluteUrl(),
          ROOT_URL: process.env.MOBILE_ROOT_URL || Meteor.absoluteUrl()
        }
      },
      "web.browser": {
        runtimeConfigOverrides: {
          isModern: true
        }
      },
      "web.browser.legacy": {
        runtimeConfigOverrides: {
          isModern: false
        }
      }
    };

    WebAppInternals.generateBoilerplate = function () {
      // This boilerplate will be served to the mobile devices when used with
      // Meteor/Cordova for the Hot-Code Push and since the file will be served by
      // the device's server, it is important to set the DDP url to the actual
      // Meteor server accepting DDP connections and not the device's file server.
      syncQueue.runTask(function () {
        Object.keys(WebApp.clientPrograms).forEach(generateBoilerplateForArch);
      });
    };

    function generateBoilerplateForArch(arch) {
      const program = WebApp.clientPrograms[arch];
      const additionalOptions = defaultOptionsForArch[arch] || {};
      const {
        baseData
      } = boilerplateByArch[arch] = WebAppInternals.generateBoilerplateInstance(arch, program.manifest, additionalOptions); // We need the runtime config with overrides for meteor_runtime_config.js:

      program.meteorRuntimeConfig = JSON.stringify(_objectSpread({}, __meteor_runtime_config__, {}, additionalOptions.runtimeConfigOverrides || null));
      program.refreshableAssets = baseData.css.map(file => ({
        url: bundledJsCssUrlRewriteHook(file.url)
      }));
    }

    WebAppInternals.reloadClientPrograms(); // webserver

    var app = connect(); // Packages and apps can add handlers that run before any other Meteor
    // handlers via WebApp.rawConnectHandlers.

    var rawConnectHandlers = connect();
    app.use(rawConnectHandlers); // Auto-compress any json, javascript, or text.

    app.use(compress({
      filter: shouldCompress
    })); // parse cookies into an object

    app.use(cookieParser()); // We're not a proxy; reject (without crashing) attempts to treat us like
    // one. (See #1212.)

    app.use(function (req, res, next) {
      if (RoutePolicy.isValidUrl(req.url)) {
        next();
        return;
      }

      res.writeHead(400);
      res.write("Not a proxy");
      res.end();
    }); // Parse the query string into res.query. Used by oauth_server, but it's
    // generally pretty handy..
    //
    // Do this before the next middleware destroys req.url if a path prefix
    // is set to close #10111.

    app.use(function (request, response, next) {
      request.query = qs.parse(parseUrl(request.url).query);
      next();
    });

    function getPathParts(path) {
      const parts = path.split("/");

      while (parts[0] === "") parts.shift();

      return parts;
    }

    function isPrefixOf(prefix, array) {
      return prefix.length <= array.length && prefix.every((part, i) => part === array[i]);
    } // Strip off the path prefix, if it exists.


    app.use(function (request, response, next) {
      const pathPrefix = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;
      const {
        pathname,
        search
      } = parseUrl(request.url); // check if the path in the url starts with the path prefix

      if (pathPrefix) {
        const prefixParts = getPathParts(pathPrefix);
        const pathParts = getPathParts(pathname);

        if (isPrefixOf(prefixParts, pathParts)) {
          request.url = "/" + pathParts.slice(prefixParts.length).join("/");

          if (search) {
            request.url += search;
          }

          return next();
        }
      }

      if (pathname === "/favicon.ico" || pathname === "/robots.txt") {
        return next();
      }

      if (pathPrefix) {
        response.writeHead(404);
        response.write("Unknown path");
        response.end();
        return;
      }

      next();
    }); // Serve static files from the manifest.
    // This is inspired by the 'static' middleware.

    app.use(function (req, res, next) {
      WebAppInternals.staticFilesMiddleware(WebAppInternals.staticFilesByArch, req, res, next);
    }); // Core Meteor packages like dynamic-import can add handlers before
    // other handlers added by package and application code.

    app.use(WebAppInternals.meteorInternalHandlers = connect()); // Packages and apps can add handlers to this via WebApp.connectHandlers.
    // They are inserted before our default handler.

    var packageAndAppHandlers = connect();
    app.use(packageAndAppHandlers);
    var suppressConnectErrors = false; // connect knows it is an error handler because it has 4 arguments instead of
    // 3. go figure.  (It is not smart enough to find such a thing if it's hidden
    // inside packageAndAppHandlers.)

    app.use(function (err, req, res, next) {
      if (!err || !suppressConnectErrors || !req.headers['x-suppress-error']) {
        next(err);
        return;
      }

      res.writeHead(err.status, {
        'Content-Type': 'text/plain'
      });
      res.end("An error message");
    });
    app.use(function (req, res, next) {
      return Promise.asyncApply(() => {
        if (!appUrl(req.url)) {
          return next();
        } else {
          var headers = {
            'Content-Type': 'text/html; charset=utf-8'
          };

          if (shuttingDown) {
            headers['Connection'] = 'Close';
          }

          var request = WebApp.categorizeRequest(req);

          if (request.url.query && request.url.query['meteor_css_resource']) {
            // In this case, we're requesting a CSS resource in the meteor-specific
            // way, but we don't have it.  Serve a static css file that indicates that
            // we didn't have it, so we can detect that and refresh.  Make sure
            // that any proxies or CDNs don't cache this error!  (Normally proxies
            // or CDNs are smart enough not to cache error pages, but in order to
            // make this hack work, we need to return the CSS file as a 200, which
            // would otherwise be cached.)
            headers['Content-Type'] = 'text/css; charset=utf-8';
            headers['Cache-Control'] = 'no-cache';
            res.writeHead(200, headers);
            res.write(".meteor-css-not-found-error { width: 0px;}");
            res.end();
            return;
          }

          if (request.url.query && request.url.query['meteor_js_resource']) {
            // Similarly, we're requesting a JS resource that we don't have.
            // Serve an uncached 404. (We can't use the same hack we use for CSS,
            // because actually acting on that hack requires us to have the JS
            // already!)
            headers['Cache-Control'] = 'no-cache';
            res.writeHead(404, headers);
            res.end("404 Not Found");
            return;
          }

          if (request.url.query && request.url.query['meteor_dont_serve_index']) {
            // When downloading files during a Cordova hot code push, we need
            // to detect if a file is not available instead of inadvertently
            // downloading the default index page.
            // So similar to the situation above, we serve an uncached 404.
            headers['Cache-Control'] = 'no-cache';
            res.writeHead(404, headers);
            res.end("404 Not Found");
            return;
          }

          const {
            arch
          } = getArchAndPath(parseRequest(req).pathname, request.browser);

          if (!hasOwn.call(WebApp.clientPrograms, arch)) {
            // We could come here in case we run with some architectures excluded
            headers['Cache-Control'] = 'no-cache';
            res.writeHead(404, headers);

            if (Meteor.isDevelopment) {
              res.end("No client program found for the ".concat(arch, " architecture."));
            } else {
              // Safety net, but this branch should not be possible.
              res.end("404 Not Found");
            }

            return;
          } // If pauseClient(arch) has been called, program.paused will be a
          // Promise that will be resolved when the program is unpaused.


          Promise.await(WebApp.clientPrograms[arch].paused);
          return getBoilerplateAsync(request, arch).then((_ref3) => {
            let {
              stream,
              statusCode,
              headers: newHeaders
            } = _ref3;

            if (!statusCode) {
              statusCode = res.statusCode ? res.statusCode : 200;
            }

            if (newHeaders) {
              Object.assign(headers, newHeaders);
            }

            res.writeHead(statusCode, headers);
            stream.pipe(res, {
              // End the response when the stream ends.
              end: true
            });
          }).catch(error => {
            Log.error("Error running template: " + error.stack);
            res.writeHead(500, headers);
            res.end();
          });
        }
      });
    }); // Return 404 by default, if no other handlers serve this URL.

    app.use(function (req, res) {
      res.writeHead(404);
      res.end();
    });
    var httpServer = createServer(app);
    var onListeningCallbacks = []; // After 5 seconds w/o data on a socket, kill it.  On the other hand, if
    // there's an outstanding request, give it a higher timeout instead (to avoid
    // killing long-polling requests)

    httpServer.setTimeout(SHORT_SOCKET_TIMEOUT); // Do this here, and then also in livedata/stream_server.js, because
    // stream_server.js kills all the current request handlers when installing its
    // own.

    httpServer.on('request', WebApp._timeoutAdjustmentRequestCallback); // If the client gave us a bad request, tell it instead of just closing the
    // socket. This lets load balancers in front of us differentiate between "a
    // server is randomly closing sockets for no reason" and "client sent a bad
    // request".
    //
    // This will only work on Node 6; Node 4 destroys the socket before calling
    // this event. See https://github.com/nodejs/node/pull/4557/ for details.

    httpServer.on('clientError', (err, socket) => {
      // Pre-Node-6, do nothing.
      if (socket.destroyed) {
        return;
      }

      if (err.message === 'Parse Error') {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      } else {
        // For other errors, use the default behavior as if we had no clientError
        // handler.
        socket.destroy(err);
      }
    }); // start up app

    _.extend(WebApp, {
      connectHandlers: packageAndAppHandlers,
      rawConnectHandlers: rawConnectHandlers,
      httpServer: httpServer,
      connectApp: app,
      // For testing.
      suppressConnectErrors: function () {
        suppressConnectErrors = true;
      },
      onListening: function (f) {
        if (onListeningCallbacks) onListeningCallbacks.push(f);else f();
      },
      // This can be overridden by users who want to modify how listening works
      // (eg, to run a proxy like Apollo Engine Proxy in front of the server).
      startListening: function (httpServer, listenOptions, cb) {
        httpServer.listen(listenOptions, cb);
      }
    }); // Let the rest of the packages (and Meteor.startup hooks) insert connect
    // middlewares and update __meteor_runtime_config__, then keep going to set up
    // actually serving HTML.


    exports.main = argv => {
      WebAppInternals.generateBoilerplate();

      const startHttpServer = listenOptions => {
        WebApp.startListening(httpServer, listenOptions, Meteor.bindEnvironment(() => {
          if (process.env.METEOR_PRINT_ON_LISTEN) {
            console.log("LISTENING");
          }

          const callbacks = onListeningCallbacks;
          onListeningCallbacks = null;
          callbacks.forEach(callback => {
            callback();
          });
        }, e => {
          console.error("Error listening:", e);
          console.error(e && e.stack);
        }));
      };

      let localPort = process.env.PORT || 0;
      const unixSocketPath = process.env.UNIX_SOCKET_PATH;

      if (unixSocketPath) {
        // Start the HTTP server using a socket file.
        removeExistingSocketFile(unixSocketPath);
        startHttpServer({
          path: unixSocketPath
        });
        registerSocketFileCleanup(unixSocketPath);
      } else {
        localPort = isNaN(Number(localPort)) ? localPort : Number(localPort);

        if (/\\\\?.+\\pipe\\?.+/.test(localPort)) {
          // Start the HTTP server using Windows Server style named pipe.
          startHttpServer({
            path: localPort
          });
        } else if (typeof localPort === "number") {
          // Start the HTTP server using TCP.
          startHttpServer({
            port: localPort,
            host: process.env.BIND_IP || "0.0.0.0"
          });
        } else {
          throw new Error("Invalid PORT specified");
        }
      }

      return "DAEMON";
    };
  }

  var inlineScriptsAllowed = true;

  WebAppInternals.inlineScriptsAllowed = function () {
    return inlineScriptsAllowed;
  };

  WebAppInternals.setInlineScriptsAllowed = function (value) {
    inlineScriptsAllowed = value;
    WebAppInternals.generateBoilerplate();
  };

  var sriMode;

  WebAppInternals.enableSubresourceIntegrity = function () {
    let use_credentials = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    sriMode = use_credentials ? 'use-credentials' : 'anonymous';
    WebAppInternals.generateBoilerplate();
  };

  WebAppInternals.setBundledJsCssUrlRewriteHook = function (hookFn) {
    bundledJsCssUrlRewriteHook = hookFn;
    WebAppInternals.generateBoilerplate();
  };

  WebAppInternals.setBundledJsCssPrefix = function (prefix) {
    var self = this;
    self.setBundledJsCssUrlRewriteHook(function (url) {
      return prefix + url;
    });
  }; // Packages can call `WebAppInternals.addStaticJs` to specify static
  // JavaScript to be included in the app. This static JS will be inlined,
  // unless inline scripts have been disabled, in which case it will be
  // served under `/<sha1 of contents>`.


  var additionalStaticJs = {};

  WebAppInternals.addStaticJs = function (contents) {
    additionalStaticJs["/" + sha1(contents) + ".js"] = contents;
  }; // Exported for tests


  WebAppInternals.getBoilerplate = getBoilerplate;
  WebAppInternals.additionalStaticJs = additionalStaticJs; // Start the server!

  runWebAppServer();
}.call(this, module);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"connect.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/webapp/connect.js                                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  connect: () => connect
});
let npmConnect;
module.link("connect", {
  default(v) {
    npmConnect = v;
  }

}, 0);

function connect() {
  for (var _len = arguments.length, connectArgs = new Array(_len), _key = 0; _key < _len; _key++) {
    connectArgs[_key] = arguments[_key];
  }

  const handlers = npmConnect.apply(this, connectArgs);
  const originalUse = handlers.use; // Wrap the handlers.use method so that any provided handler functions
  // alway run in a Fiber.

  handlers.use = function use() {
    for (var _len2 = arguments.length, useArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      useArgs[_key2] = arguments[_key2];
    }

    const {
      stack
    } = this;
    const originalLength = stack.length;
    const result = originalUse.apply(this, useArgs); // If we just added anything to the stack, wrap each new entry.handle
    // with a function that calls Promise.asyncApply to ensure the
    // original handler runs in a Fiber.

    for (let i = originalLength; i < stack.length; ++i) {
      const entry = stack[i];
      const originalHandle = entry.handle;

      if (originalHandle.length >= 4) {
        // If the original handle had four (or more) parameters, the
        // wrapper must also have four parameters, since connect uses
        // handle.length to dermine whether to pass the error as the first
        // argument to the handle function.
        entry.handle = function handle(err, req, res, next) {
          return Promise.asyncApply(originalHandle, this, arguments);
        };
      } else {
        entry.handle = function handle(req, res, next) {
          return Promise.asyncApply(originalHandle, this, arguments);
        };
      }
    }

    return result;
  };

  return handlers;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"socket_file.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/webapp/socket_file.js                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  removeExistingSocketFile: () => removeExistingSocketFile,
  registerSocketFileCleanup: () => registerSocketFileCleanup
});
let statSync, unlinkSync, existsSync;
module.link("fs", {
  statSync(v) {
    statSync = v;
  },

  unlinkSync(v) {
    unlinkSync = v;
  },

  existsSync(v) {
    existsSync = v;
  }

}, 0);

const removeExistingSocketFile = socketPath => {
  try {
    if (statSync(socketPath).isSocket()) {
      // Since a new socket file will be created, remove the existing
      // file.
      unlinkSync(socketPath);
    } else {
      throw new Error("An existing file was found at \"".concat(socketPath, "\" and it is not ") + 'a socket file. Please confirm PORT is pointing to valid and ' + 'un-used socket file path.');
    }
  } catch (error) {
    // If there is no existing socket file to cleanup, great, we'll
    // continue normally. If the caught exception represents any other
    // issue, re-throw.
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

const registerSocketFileCleanup = function (socketPath) {
  let eventEmitter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process;
  ['exit', 'SIGINT', 'SIGHUP', 'SIGTERM'].forEach(signal => {
    eventEmitter.on(signal, Meteor.bindEnvironment(() => {
      if (existsSync(socketPath)) {
        unlinkSync(socketPath);
      }
    }));
  });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"connect":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/connect/package.json                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "connect",
  "version": "3.6.5"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/connect/index.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"compression":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/compression/package.json                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "compression",
  "version": "1.7.1"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/compression/index.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"cookie-parser":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/cookie-parser/package.json                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "cookie-parser",
  "version": "1.4.3"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/cookie-parser/index.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"qs":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/qs/package.json                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "qs",
  "version": "6.4.0",
  "main": "lib/index.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/qs/lib/index.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"parseurl":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/parseurl/package.json                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "parseurl",
  "version": "1.3.2"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/parseurl/index.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"basic-auth-connect":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/basic-auth-connect/package.json                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "basic-auth-connect",
  "version": "1.0.0"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/basic-auth-connect/index.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"useragent":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/useragent/package.json                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "useragent",
  "version": "2.3.0",
  "main": "./index.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/useragent/index.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"send":{"package.json":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/send/package.json                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "send",
  "version": "0.16.1"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/webapp/node_modules/send/index.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/webapp/webapp_server.js");

/* Exports */
Package._define("webapp", exports, {
  WebApp: WebApp,
  WebAppInternals: WebAppInternals,
  main: main
});

})();

//# sourceURL=meteor://💻app/packages/webapp.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvd2ViYXBwL3dlYmFwcF9zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3dlYmFwcC9jb25uZWN0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy93ZWJhcHAvc29ja2V0X2ZpbGUuanMiXSwibmFtZXMiOlsiX29iamVjdFNwcmVhZCIsIm1vZHVsZTEiLCJsaW5rIiwiZGVmYXVsdCIsInYiLCJleHBvcnQiLCJXZWJBcHAiLCJXZWJBcHBJbnRlcm5hbHMiLCJhc3NlcnQiLCJyZWFkRmlsZVN5bmMiLCJjcmVhdGVTZXJ2ZXIiLCJwYXRoSm9pbiIsInBhdGhEaXJuYW1lIiwiam9pbiIsImRpcm5hbWUiLCJwYXJzZVVybCIsInBhcnNlIiwiY3JlYXRlSGFzaCIsImNvbm5lY3QiLCJjb21wcmVzcyIsImNvb2tpZVBhcnNlciIsInFzIiwicGFyc2VSZXF1ZXN0IiwiYmFzaWNBdXRoIiwibG9va3VwVXNlckFnZW50IiwibG9va3VwIiwiaXNNb2Rlcm4iLCJzZW5kIiwicmVtb3ZlRXhpc3RpbmdTb2NrZXRGaWxlIiwicmVnaXN0ZXJTb2NrZXRGaWxlQ2xlYW51cCIsIm9uTWVzc2FnZSIsIlNIT1JUX1NPQ0tFVF9USU1FT1VUIiwiTE9OR19TT0NLRVRfVElNRU9VVCIsImhhc093biIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiTnBtTW9kdWxlcyIsInZlcnNpb24iLCJOcG0iLCJyZXF1aXJlIiwibW9kdWxlIiwiZGVmYXVsdEFyY2giLCJjbGllbnRQcm9ncmFtcyIsImFyY2hQYXRoIiwiYnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2siLCJ1cmwiLCJidW5kbGVkUHJlZml4IiwiX19tZXRlb3JfcnVudGltZV9jb25maWdfXyIsIlJPT1RfVVJMX1BBVEhfUFJFRklYIiwic2hhMSIsImNvbnRlbnRzIiwiaGFzaCIsInVwZGF0ZSIsImRpZ2VzdCIsInNob3VsZENvbXByZXNzIiwicmVxIiwicmVzIiwiaGVhZGVycyIsImZpbHRlciIsImNhbWVsQ2FzZSIsIm5hbWUiLCJwYXJ0cyIsInNwbGl0IiwidG9Mb3dlckNhc2UiLCJpIiwibGVuZ3RoIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJpZGVudGlmeUJyb3dzZXIiLCJ1c2VyQWdlbnRTdHJpbmciLCJ1c2VyQWdlbnQiLCJmYW1pbHkiLCJtYWpvciIsIm1pbm9yIiwicGF0Y2giLCJjYXRlZ29yaXplUmVxdWVzdCIsIl8iLCJleHRlbmQiLCJicm93c2VyIiwicGljayIsImh0bWxBdHRyaWJ1dGVIb29rcyIsImdldEh0bWxBdHRyaWJ1dGVzIiwicmVxdWVzdCIsImNvbWJpbmVkQXR0cmlidXRlcyIsImVhY2giLCJob29rIiwiYXR0cmlidXRlcyIsIkVycm9yIiwiYWRkSHRtbEF0dHJpYnV0ZUhvb2siLCJwdXNoIiwiYXBwVXJsIiwiUm91dGVQb2xpY3kiLCJjbGFzc2lmeSIsIk1ldGVvciIsInN0YXJ0dXAiLCJnZXR0ZXIiLCJrZXkiLCJhcmNoIiwicHJvZ3JhbSIsInZhbHVlIiwiY2FsY3VsYXRlQ2xpZW50SGFzaCIsImNsaWVudEhhc2giLCJjYWxjdWxhdGVDbGllbnRIYXNoUmVmcmVzaGFibGUiLCJjYWxjdWxhdGVDbGllbnRIYXNoTm9uUmVmcmVzaGFibGUiLCJnZXRSZWZyZXNoYWJsZUFzc2V0cyIsIl90aW1lb3V0QWRqdXN0bWVudFJlcXVlc3RDYWxsYmFjayIsInNldFRpbWVvdXQiLCJmaW5pc2hMaXN0ZW5lcnMiLCJsaXN0ZW5lcnMiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJvbiIsImwiLCJib2lsZXJwbGF0ZUJ5QXJjaCIsImJvaWxlcnBsYXRlRGF0YUNhbGxiYWNrcyIsImNyZWF0ZSIsInJlZ2lzdGVyQm9pbGVycGxhdGVEYXRhQ2FsbGJhY2siLCJjYWxsYmFjayIsInByZXZpb3VzQ2FsbGJhY2siLCJzdHJpY3RFcXVhbCIsImdldEJvaWxlcnBsYXRlIiwiZ2V0Qm9pbGVycGxhdGVBc3luYyIsImF3YWl0IiwiYm9pbGVycGxhdGUiLCJkYXRhIiwiYXNzaWduIiwiYmFzZURhdGEiLCJodG1sQXR0cmlidXRlcyIsIm1hZGVDaGFuZ2VzIiwicHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwia2V5cyIsImZvckVhY2giLCJ0aGVuIiwicmVzdWx0Iiwic3RyZWFtIiwidG9IVE1MU3RyZWFtIiwic3RhdHVzQ29kZSIsImdlbmVyYXRlQm9pbGVycGxhdGVJbnN0YW5jZSIsIm1hbmlmZXN0IiwiYWRkaXRpb25hbE9wdGlvbnMiLCJtZXRlb3JSdW50aW1lQ29uZmlnIiwiSlNPTiIsInN0cmluZ2lmeSIsImVuY29kZVVSSUNvbXBvbmVudCIsInJ1bnRpbWVDb25maWdPdmVycmlkZXMiLCJCb2lsZXJwbGF0ZSIsInBhdGhNYXBwZXIiLCJpdGVtUGF0aCIsImJhc2VEYXRhRXh0ZW5zaW9uIiwiYWRkaXRpb25hbFN0YXRpY0pzIiwibWFwIiwicGF0aG5hbWUiLCJtZXRlb3JSdW50aW1lSGFzaCIsInJvb3RVcmxQYXRoUHJlZml4Iiwic3JpTW9kZSIsImlubGluZVNjcmlwdHNBbGxvd2VkIiwiaW5saW5lIiwic3RhdGljRmlsZXNNaWRkbGV3YXJlIiwic3RhdGljRmlsZXNCeUFyY2giLCJuZXh0IiwibWV0aG9kIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiZSIsInNlcnZlU3RhdGljSnMiLCJzIiwid3JpdGVIZWFkIiwid3JpdGUiLCJlbmQiLCJoYXMiLCJwYXRoIiwiZ2V0QXJjaEFuZFBhdGgiLCJjYWxsIiwicGF1c2VkIiwiaW5mbyIsImdldFN0YXRpY0ZpbGVJbmZvIiwibWF4QWdlIiwiY2FjaGVhYmxlIiwic2V0SGVhZGVyIiwic291cmNlTWFwVXJsIiwidHlwZSIsImNvbnRlbnQiLCJhYnNvbHV0ZVBhdGgiLCJtYXhhZ2UiLCJkb3RmaWxlcyIsImxhc3RNb2RpZmllZCIsImVyciIsIkxvZyIsImVycm9yIiwicGlwZSIsIm9yaWdpbmFsUGF0aCIsInN0YXRpY0FyY2hMaXN0IiwiYXJjaEluZGV4IiwiaW5kZXhPZiIsInVuc2hpZnQiLCJzcGxpY2UiLCJzb21lIiwic3RhdGljRmlsZXMiLCJmaW5hbGl6ZSIsInBhdGhQYXJ0cyIsImFyY2hLZXkiLCJzdGFydHNXaXRoIiwiYXJjaENsZWFuZWQiLCJzbGljZSIsInBhcnNlUG9ydCIsInBvcnQiLCJwYXJzZWRQb3J0IiwicGFyc2VJbnQiLCJOdW1iZXIiLCJpc05hTiIsInBhdXNlQ2xpZW50IiwiZ2VuZXJhdGVDbGllbnRQcm9ncmFtIiwicnVuV2ViQXBwU2VydmVyIiwic2h1dHRpbmdEb3duIiwic3luY1F1ZXVlIiwiX1N5bmNocm9ub3VzUXVldWUiLCJnZXRJdGVtUGF0aG5hbWUiLCJpdGVtVXJsIiwicmVsb2FkQ2xpZW50UHJvZ3JhbXMiLCJydW5UYXNrIiwiY29uZmlnSnNvbiIsIl9fbWV0ZW9yX2Jvb3RzdHJhcF9fIiwiY2xpZW50QXJjaHMiLCJjbGllbnRQYXRocyIsInN0YWNrIiwicHJvY2VzcyIsImV4aXQiLCJ1bnBhdXNlIiwiY2xpZW50RGlyIiwic2VydmVyRGlyIiwicHJvZ3JhbUpzb25QYXRoIiwicHJvZ3JhbUpzb24iLCJjb2RlIiwiZm9ybWF0IiwiaXRlbSIsIndoZXJlIiwic291cmNlTWFwIiwiUFVCTElDX1NFVFRJTkdTIiwiY29uZmlnT3ZlcnJpZGVzIiwib2xkUHJvZ3JhbSIsIm5ld1Byb2dyYW0iLCJXZWJBcHBIYXNoaW5nIiwidmVyc2lvblJlZnJlc2hhYmxlIiwidmVyc2lvbk5vblJlZnJlc2hhYmxlIiwiY29yZG92YUNvbXBhdGliaWxpdHlWZXJzaW9ucyIsIm1hbmlmZXN0VXJsUHJlZml4IiwicmVwbGFjZSIsIm1hbmlmZXN0VXJsIiwiUGFja2FnZSIsImF1dG91cGRhdGUiLCJBVVRPVVBEQVRFX1ZFUlNJT04iLCJBdXRvdXBkYXRlIiwiYXV0b3VwZGF0ZVZlcnNpb24iLCJlbnYiLCJnZW5lcmF0ZUJvaWxlcnBsYXRlRm9yQXJjaCIsImRlZmF1bHRPcHRpb25zRm9yQXJjaCIsIkREUF9ERUZBVUxUX0NPTk5FQ1RJT05fVVJMIiwiTU9CSUxFX0REUF9VUkwiLCJhYnNvbHV0ZVVybCIsIlJPT1RfVVJMIiwiTU9CSUxFX1JPT1RfVVJMIiwiZ2VuZXJhdGVCb2lsZXJwbGF0ZSIsInJlZnJlc2hhYmxlQXNzZXRzIiwiY3NzIiwiZmlsZSIsImFwcCIsInJhd0Nvbm5lY3RIYW5kbGVycyIsInVzZSIsImlzVmFsaWRVcmwiLCJyZXNwb25zZSIsInF1ZXJ5IiwiZ2V0UGF0aFBhcnRzIiwic2hpZnQiLCJpc1ByZWZpeE9mIiwicHJlZml4IiwiYXJyYXkiLCJldmVyeSIsInBhcnQiLCJwYXRoUHJlZml4Iiwic2VhcmNoIiwicHJlZml4UGFydHMiLCJtZXRlb3JJbnRlcm5hbEhhbmRsZXJzIiwicGFja2FnZUFuZEFwcEhhbmRsZXJzIiwic3VwcHJlc3NDb25uZWN0RXJyb3JzIiwic3RhdHVzIiwiaXNEZXZlbG9wbWVudCIsIm5ld0hlYWRlcnMiLCJjYXRjaCIsImh0dHBTZXJ2ZXIiLCJvbkxpc3RlbmluZ0NhbGxiYWNrcyIsInNvY2tldCIsImRlc3Ryb3llZCIsIm1lc3NhZ2UiLCJkZXN0cm95IiwiY29ubmVjdEhhbmRsZXJzIiwiY29ubmVjdEFwcCIsIm9uTGlzdGVuaW5nIiwiZiIsInN0YXJ0TGlzdGVuaW5nIiwibGlzdGVuT3B0aW9ucyIsImNiIiwibGlzdGVuIiwiZXhwb3J0cyIsIm1haW4iLCJhcmd2Iiwic3RhcnRIdHRwU2VydmVyIiwiYmluZEVudmlyb25tZW50IiwiTUVURU9SX1BSSU5UX09OX0xJU1RFTiIsImNvbnNvbGUiLCJsb2ciLCJjYWxsYmFja3MiLCJsb2NhbFBvcnQiLCJQT1JUIiwidW5peFNvY2tldFBhdGgiLCJVTklYX1NPQ0tFVF9QQVRIIiwidGVzdCIsImhvc3QiLCJCSU5EX0lQIiwic2V0SW5saW5lU2NyaXB0c0FsbG93ZWQiLCJlbmFibGVTdWJyZXNvdXJjZUludGVncml0eSIsInVzZV9jcmVkZW50aWFscyIsInNldEJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rIiwiaG9va0ZuIiwic2V0QnVuZGxlZEpzQ3NzUHJlZml4Iiwic2VsZiIsImFkZFN0YXRpY0pzIiwibnBtQ29ubmVjdCIsImNvbm5lY3RBcmdzIiwiaGFuZGxlcnMiLCJhcHBseSIsIm9yaWdpbmFsVXNlIiwidXNlQXJncyIsIm9yaWdpbmFsTGVuZ3RoIiwiZW50cnkiLCJvcmlnaW5hbEhhbmRsZSIsImhhbmRsZSIsImFzeW5jQXBwbHkiLCJhcmd1bWVudHMiLCJzdGF0U3luYyIsInVubGlua1N5bmMiLCJleGlzdHNTeW5jIiwic29ja2V0UGF0aCIsImlzU29ja2V0IiwiZXZlbnRFbWl0dGVyIiwic2lnbmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFJQSxhQUFKOztBQUFrQkMsU0FBTyxDQUFDQyxJQUFSLENBQWEsc0NBQWIsRUFBb0Q7QUFBQ0MsV0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0osbUJBQWEsR0FBQ0ksQ0FBZDtBQUFnQjs7QUFBNUIsR0FBcEQsRUFBa0YsQ0FBbEY7QUFBbEJILFNBQU8sQ0FBQ0ksTUFBUixDQUFlO0FBQUNDLFVBQU0sRUFBQyxNQUFJQSxNQUFaO0FBQW1CQyxtQkFBZSxFQUFDLE1BQUlBO0FBQXZDLEdBQWY7QUFBd0UsTUFBSUMsTUFBSjtBQUFXUCxTQUFPLENBQUNDLElBQVIsQ0FBYSxRQUFiLEVBQXNCO0FBQUNDLFdBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNJLFlBQU0sR0FBQ0osQ0FBUDtBQUFTOztBQUFyQixHQUF0QixFQUE2QyxDQUE3QztBQUFnRCxNQUFJSyxZQUFKO0FBQWlCUixTQUFPLENBQUNDLElBQVIsQ0FBYSxJQUFiLEVBQWtCO0FBQUNPLGdCQUFZLENBQUNMLENBQUQsRUFBRztBQUFDSyxrQkFBWSxHQUFDTCxDQUFiO0FBQWU7O0FBQWhDLEdBQWxCLEVBQW9ELENBQXBEO0FBQXVELE1BQUlNLFlBQUo7QUFBaUJULFNBQU8sQ0FBQ0MsSUFBUixDQUFhLE1BQWIsRUFBb0I7QUFBQ1EsZ0JBQVksQ0FBQ04sQ0FBRCxFQUFHO0FBQUNNLGtCQUFZLEdBQUNOLENBQWI7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TWpLLHlCQUF5QixHQUNwQyxVQUFDMFQsVUFBRCxFQUF3QztBQUFBLE1BQTNCRSxZQUEyQix1RUFBWnRILE9BQVk7QUFDdEMsR0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixRQUFuQixFQUE2QixTQUE3QixFQUF3QzdGLE9BQXhDLENBQWdEb04sTUFBTSxJQUFJO0FBQ3hERCxnQkFBWSxDQUFDek8sRUFBYixDQUFnQjBPLE1BQWhCLEVBQXdCM1AsTUFBTSxDQUFDcU4sZUFBUCxDQUF1QixNQUFNO0FBQ25ELFVBQUlrQyxVQUFVLENBQUNDLFVBQUQsQ0FBZCxFQUE0QjtBQUMxQkYsa0JBQVUsQ0FBQ0UsVUFBRCxDQUFWO0FBQ0Q7QUFDRixLQUp1QixDQUF4QjtBQUtELEdBTkQ7QUFPRCxDQVRJLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3dlYmFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhc3NlcnQgZnJvbSBcImFzc2VydFwiO1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBjcmVhdGVTZXJ2ZXIgfSBmcm9tIFwiaHR0cFwiO1xuaW1wb3J0IHtcbiAgam9pbiBhcyBwYXRoSm9pbixcbiAgZGlybmFtZSBhcyBwYXRoRGlybmFtZSxcbn0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IHBhcnNlIGFzIHBhcnNlVXJsIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHsgY3JlYXRlSGFzaCB9IGZyb20gXCJjcnlwdG9cIjtcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tIFwiLi9jb25uZWN0LmpzXCI7XG5pbXBvcnQgY29tcHJlc3MgZnJvbSBcImNvbXByZXNzaW9uXCI7XG5pbXBvcnQgY29va2llUGFyc2VyIGZyb20gXCJjb29raWUtcGFyc2VyXCI7XG5pbXBvcnQgcXMgZnJvbSBcInFzXCI7XG5pbXBvcnQgcGFyc2VSZXF1ZXN0IGZyb20gXCJwYXJzZXVybFwiO1xuaW1wb3J0IGJhc2ljQXV0aCBmcm9tIFwiYmFzaWMtYXV0aC1jb25uZWN0XCI7XG5pbXBvcnQgeyBsb29rdXAgYXMgbG9va3VwVXNlckFnZW50IH0gZnJvbSBcInVzZXJhZ2VudFwiO1xuaW1wb3J0IHsgaXNNb2Rlcm4gfSBmcm9tIFwibWV0ZW9yL21vZGVybi1icm93c2Vyc1wiO1xuaW1wb3J0IHNlbmQgZnJvbSBcInNlbmRcIjtcbmltcG9ydCB7XG4gIHJlbW92ZUV4aXN0aW5nU29ja2V0RmlsZSxcbiAgcmVnaXN0ZXJTb2NrZXRGaWxlQ2xlYW51cCxcbn0gZnJvbSAnLi9zb2NrZXRfZmlsZS5qcyc7XG5cbnZhciBTSE9SVF9TT0NLRVRfVElNRU9VVCA9IDUqMTAwMDtcbnZhciBMT05HX1NPQ0tFVF9USU1FT1VUID0gMTIwKjEwMDA7XG5cbmV4cG9ydCBjb25zdCBXZWJBcHAgPSB7fTtcbmV4cG9ydCBjb25zdCBXZWJBcHBJbnRlcm5hbHMgPSB7fTtcblxuY29uc3QgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLy8gYmFja3dhcmRzIGNvbXBhdCB0byAyLjAgb2YgY29ubmVjdFxuY29ubmVjdC5iYXNpY0F1dGggPSBiYXNpY0F1dGg7XG5cbldlYkFwcEludGVybmFscy5OcG1Nb2R1bGVzID0ge1xuICBjb25uZWN0OiB7XG4gICAgdmVyc2lvbjogTnBtLnJlcXVpcmUoJ2Nvbm5lY3QvcGFja2FnZS5qc29uJykudmVyc2lvbixcbiAgICBtb2R1bGU6IGNvbm5lY3QsXG4gIH1cbn07XG5cbi8vIFRob3VnaCB3ZSBtaWdodCBwcmVmZXIgdG8gdXNlIHdlYi5icm93c2VyIChtb2Rlcm4pIGFzIHRoZSBkZWZhdWx0XG4vLyBhcmNoaXRlY3R1cmUsIHNhZmV0eSByZXF1aXJlcyBhIG1vcmUgY29tcGF0aWJsZSBkZWZhdWx0QXJjaC5cbldlYkFwcC5kZWZhdWx0QXJjaCA9ICd3ZWIuYnJvd3Nlci5sZWdhY3knO1xuXG4vLyBYWFggbWFwcyBhcmNocyB0byBtYW5pZmVzdHNcbldlYkFwcC5jbGllbnRQcm9ncmFtcyA9IHt9O1xuXG4vLyBYWFggbWFwcyBhcmNocyB0byBwcm9ncmFtIHBhdGggb24gZmlsZXN5c3RlbVxudmFyIGFyY2hQYXRoID0ge307XG5cbnZhciBidW5kbGVkSnNDc3NVcmxSZXdyaXRlSG9vayA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgdmFyIGJ1bmRsZWRQcmVmaXggPVxuICAgICBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYIHx8ICcnO1xuICByZXR1cm4gYnVuZGxlZFByZWZpeCArIHVybDtcbn07XG5cbnZhciBzaGExID0gZnVuY3Rpb24gKGNvbnRlbnRzKSB7XG4gIHZhciBoYXNoID0gY3JlYXRlSGFzaCgnc2hhMScpO1xuICBoYXNoLnVwZGF0ZShjb250ZW50cyk7XG4gIHJldHVybiBoYXNoLmRpZ2VzdCgnaGV4Jyk7XG59O1xuXG4gZnVuY3Rpb24gc2hvdWxkQ29tcHJlc3MocmVxLCByZXMpIHtcbiAgaWYgKHJlcS5oZWFkZXJzWyd4LW5vLWNvbXByZXNzaW9uJ10pIHtcbiAgICAvLyBkb24ndCBjb21wcmVzcyByZXNwb25zZXMgd2l0aCB0aGlzIHJlcXVlc3QgaGVhZGVyXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gZmFsbGJhY2sgdG8gc3RhbmRhcmQgZmlsdGVyIGZ1bmN0aW9uXG4gIHJldHVybiBjb21wcmVzcy5maWx0ZXIocmVxLCByZXMpO1xufTtcblxuLy8gI0Jyb3dzZXJJZGVudGlmaWNhdGlvblxuLy9cbi8vIFdlIGhhdmUgbXVsdGlwbGUgcGxhY2VzIHRoYXQgd2FudCB0byBpZGVudGlmeSB0aGUgYnJvd3NlcjogdGhlXG4vLyB1bnN1cHBvcnRlZCBicm93c2VyIHBhZ2UsIHRoZSBhcHBjYWNoZSBwYWNrYWdlLCBhbmQsIGV2ZW50dWFsbHlcbi8vIGRlbGl2ZXJpbmcgYnJvd3NlciBwb2x5ZmlsbHMgb25seSBhcyBuZWVkZWQuXG4vL1xuLy8gVG8gYXZvaWQgZGV0ZWN0aW5nIHRoZSBicm93c2VyIGluIG11bHRpcGxlIHBsYWNlcyBhZC1ob2MsIHdlIGNyZWF0ZSBhXG4vLyBNZXRlb3IgXCJicm93c2VyXCIgb2JqZWN0LiBJdCB1c2VzIGJ1dCBkb2VzIG5vdCBleHBvc2UgdGhlIG5wbVxuLy8gdXNlcmFnZW50IG1vZHVsZSAod2UgY291bGQgY2hvb3NlIGEgZGlmZmVyZW50IG1lY2hhbmlzbSB0byBpZGVudGlmeVxuLy8gdGhlIGJyb3dzZXIgaW4gdGhlIGZ1dHVyZSBpZiB3ZSB3YW50ZWQgdG8pLiAgVGhlIGJyb3dzZXIgb2JqZWN0XG4vLyBjb250YWluc1xuLy9cbi8vICogYG5hbWVgOiB0aGUgbmFtZSBvZiB0aGUgYnJvd3NlciBpbiBjYW1lbCBjYXNlXG4vLyAqIGBtYWpvcmAsIGBtaW5vcmAsIGBwYXRjaGA6IGludGVnZXJzIGRlc2NyaWJpbmcgdGhlIGJyb3dzZXIgdmVyc2lvblxuLy9cbi8vIEFsc28gaGVyZSBpcyBhbiBlYXJseSB2ZXJzaW9uIG9mIGEgTWV0ZW9yIGByZXF1ZXN0YCBvYmplY3QsIGludGVuZGVkXG4vLyB0byBiZSBhIGhpZ2gtbGV2ZWwgZGVzY3JpcHRpb24gb2YgdGhlIHJlcXVlc3Qgd2l0aG91dCBleHBvc2luZ1xuLy8gZGV0YWlscyBvZiBjb25uZWN0J3MgbG93LWxldmVsIGByZXFgLiAgQ3VycmVudGx5IGl0IGNvbnRhaW5zOlxuLy9cbi8vICogYGJyb3dzZXJgOiBicm93c2VyIGlkZW50aWZpY2F0aW9uIG9iamVjdCBkZXNjcmliZWQgYWJvdmVcbi8vICogYHVybGA6IHBhcnNlZCB1cmwsIGluY2x1ZGluZyBwYXJzZWQgcXVlcnkgcGFyYW1zXG4vL1xuLy8gQXMgYSB0ZW1wb3JhcnkgaGFjayB0aGVyZSBpcyBhIGBjYXRlZ29yaXplUmVxdWVzdGAgZnVuY3Rpb24gb24gV2ViQXBwIHdoaWNoXG4vLyBjb252ZXJ0cyBhIGNvbm5lY3QgYHJlcWAgdG8gYSBNZXRlb3IgYHJlcXVlc3RgLiBUaGlzIGNhbiBnbyBhd2F5IG9uY2Ugc21hcnRcbi8vIHBhY2thZ2VzIHN1Y2ggYXMgYXBwY2FjaGUgYXJlIGJlaW5nIHBhc3NlZCBhIGByZXF1ZXN0YCBvYmplY3QgZGlyZWN0bHkgd2hlblxuLy8gdGhleSBzZXJ2ZSBjb250ZW50LlxuLy9cbi8vIFRoaXMgYWxsb3dzIGByZXF1ZXN0YCB0byBiZSB1c2VkIHVuaWZvcm1seTogaXQgaXMgcGFzc2VkIHRvIHRoZSBodG1sXG4vLyBhdHRyaWJ1dGVzIGhvb2ssIGFuZCB0aGUgYXBwY2FjaGUgcGFja2FnZSBjYW4gdXNlIGl0IHdoZW4gZGVjaWRpbmdcbi8vIHdoZXRoZXIgdG8gZ2VuZXJhdGUgYSA0MDQgZm9yIHRoZSBtYW5pZmVzdC5cbi8vXG4vLyBSZWFsIHJvdXRpbmcgLyBzZXJ2ZXIgc2lkZSByZW5kZXJpbmcgd2lsbCBwcm9iYWJseSByZWZhY3RvciB0aGlzXG4vLyBoZWF2aWx5LlxuXG5cbi8vIGUuZy4gXCJNb2JpbGUgU2FmYXJpXCIgPT4gXCJtb2JpbGVTYWZhcmlcIlxudmFyIGNhbWVsQ2FzZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBwYXJ0cyA9IG5hbWUuc3BsaXQoJyAnKTtcbiAgcGFydHNbMF0gPSBwYXJ0c1swXS50b0xvd2VyQ2FzZSgpO1xuICBmb3IgKHZhciBpID0gMTsgIGkgPCBwYXJ0cy5sZW5ndGg7ICArK2kpIHtcbiAgICBwYXJ0c1tpXSA9IHBhcnRzW2ldLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcGFydHNbaV0uc3Vic3RyKDEpO1xuICB9XG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKTtcbn07XG5cbnZhciBpZGVudGlmeUJyb3dzZXIgPSBmdW5jdGlvbiAodXNlckFnZW50U3RyaW5nKSB7XG4gIHZhciB1c2VyQWdlbnQgPSBsb29rdXBVc2VyQWdlbnQodXNlckFnZW50U3RyaW5nKTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBjYW1lbENhc2UodXNlckFnZW50LmZhbWlseSksXG4gICAgbWFqb3I6ICt1c2VyQWdlbnQubWFqb3IsXG4gICAgbWlub3I6ICt1c2VyQWdlbnQubWlub3IsXG4gICAgcGF0Y2g6ICt1c2VyQWdlbnQucGF0Y2hcbiAgfTtcbn07XG5cbi8vIFhYWCBSZWZhY3RvciBhcyBwYXJ0IG9mIGltcGxlbWVudGluZyByZWFsIHJvdXRpbmcuXG5XZWJBcHBJbnRlcm5hbHMuaWRlbnRpZnlCcm93c2VyID0gaWRlbnRpZnlCcm93c2VyO1xuXG5XZWJBcHAuY2F0ZWdvcml6ZVJlcXVlc3QgPSBmdW5jdGlvbiAocmVxKSB7XG4gIHJldHVybiBfLmV4dGVuZCh7XG4gICAgYnJvd3NlcjogaWRlbnRpZnlCcm93c2VyKHJlcS5oZWFkZXJzWyd1c2VyLWFnZW50J10pLFxuICAgIHVybDogcGFyc2VVcmwocmVxLnVybCwgdHJ1ZSlcbiAgfSwgXy5waWNrKHJlcSwgJ2R5bmFtaWNIZWFkJywgJ2R5bmFtaWNCb2R5JywgJ2hlYWRlcnMnLCAnY29va2llcycpKTtcbn07XG5cbi8vIEhUTUwgYXR0cmlidXRlIGhvb2tzOiBmdW5jdGlvbnMgdG8gYmUgY2FsbGVkIHRvIGRldGVybWluZSBhbnkgYXR0cmlidXRlcyB0b1xuLy8gYmUgYWRkZWQgdG8gdGhlICc8aHRtbD4nIHRhZy4gRWFjaCBmdW5jdGlvbiBpcyBwYXNzZWQgYSAncmVxdWVzdCcgb2JqZWN0IChzZWVcbi8vICNCcm93c2VySWRlbnRpZmljYXRpb24pIGFuZCBzaG91bGQgcmV0dXJuIG51bGwgb3Igb2JqZWN0LlxudmFyIGh0bWxBdHRyaWJ1dGVIb29rcyA9IFtdO1xudmFyIGdldEh0bWxBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKHJlcXVlc3QpIHtcbiAgdmFyIGNvbWJpbmVkQXR0cmlidXRlcyAgPSB7fTtcbiAgXy5lYWNoKGh0bWxBdHRyaWJ1dGVIb29rcyB8fCBbXSwgZnVuY3Rpb24gKGhvb2spIHtcbiAgICB2YXIgYXR0cmlidXRlcyA9IGhvb2socmVxdWVzdCk7XG4gICAgaWYgKGF0dHJpYnV0ZXMgPT09IG51bGwpXG4gICAgICByZXR1cm47XG4gICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVzICE9PSAnb2JqZWN0JylcbiAgICAgIHRocm93IEVycm9yKFwiSFRNTCBhdHRyaWJ1dGUgaG9vayBtdXN0IHJldHVybiBudWxsIG9yIG9iamVjdFwiKTtcbiAgICBfLmV4dGVuZChjb21iaW5lZEF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpO1xuICB9KTtcbiAgcmV0dXJuIGNvbWJpbmVkQXR0cmlidXRlcztcbn07XG5XZWJBcHAuYWRkSHRtbEF0dHJpYnV0ZUhvb2sgPSBmdW5jdGlvbiAoaG9vaykge1xuICBodG1sQXR0cmlidXRlSG9va3MucHVzaChob29rKTtcbn07XG5cbi8vIFNlcnZlIGFwcCBIVE1MIGZvciB0aGlzIFVSTD9cbnZhciBhcHBVcmwgPSBmdW5jdGlvbiAodXJsKSB7XG4gIGlmICh1cmwgPT09ICcvZmF2aWNvbi5pY28nIHx8IHVybCA9PT0gJy9yb2JvdHMudHh0JylcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gTk9URTogYXBwLm1hbmlmZXN0IGlzIG5vdCBhIHdlYiBzdGFuZGFyZCBsaWtlIGZhdmljb24uaWNvIGFuZFxuICAvLyByb2JvdHMudHh0LiBJdCBpcyBhIGZpbGUgbmFtZSB3ZSBoYXZlIGNob3NlbiB0byB1c2UgZm9yIEhUTUw1XG4gIC8vIGFwcGNhY2hlIFVSTHMuIEl0IGlzIGluY2x1ZGVkIGhlcmUgdG8gcHJldmVudCB1c2luZyBhbiBhcHBjYWNoZVxuICAvLyB0aGVuIHJlbW92aW5nIGl0IGZyb20gcG9pc29uaW5nIGFuIGFwcCBwZXJtYW5lbnRseS4gRXZlbnR1YWxseSxcbiAgLy8gb25jZSB3ZSBoYXZlIHNlcnZlciBzaWRlIHJvdXRpbmcsIHRoaXMgd29uJ3QgYmUgbmVlZGVkIGFzXG4gIC8vIHVua25vd24gVVJMcyB3aXRoIHJldHVybiBhIDQwNCBhdXRvbWF0aWNhbGx5LlxuICBpZiAodXJsID09PSAnL2FwcC5tYW5pZmVzdCcpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIEF2b2lkIHNlcnZpbmcgYXBwIEhUTUwgZm9yIGRlY2xhcmVkIHJvdXRlcyBzdWNoIGFzIC9zb2NranMvLlxuICBpZiAoUm91dGVQb2xpY3kuY2xhc3NpZnkodXJsKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gd2UgY3VycmVudGx5IHJldHVybiBhcHAgSFRNTCBvbiBhbGwgVVJMcyBieSBkZWZhdWx0XG4gIHJldHVybiB0cnVlO1xufTtcblxuXG4vLyBXZSBuZWVkIHRvIGNhbGN1bGF0ZSB0aGUgY2xpZW50IGhhc2ggYWZ0ZXIgYWxsIHBhY2thZ2VzIGhhdmUgbG9hZGVkXG4vLyB0byBnaXZlIHRoZW0gYSBjaGFuY2UgdG8gcG9wdWxhdGUgX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5cbi8vXG4vLyBDYWxjdWxhdGluZyB0aGUgaGFzaCBkdXJpbmcgc3RhcnR1cCBtZWFucyB0aGF0IHBhY2thZ2VzIGNhbiBvbmx5XG4vLyBwb3B1bGF0ZSBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fIGR1cmluZyBsb2FkLCBub3QgZHVyaW5nIHN0YXJ0dXAuXG4vL1xuLy8gQ2FsY3VsYXRpbmcgaW5zdGVhZCBpdCBhdCB0aGUgYmVnaW5uaW5nIG9mIG1haW4gYWZ0ZXIgYWxsIHN0YXJ0dXBcbi8vIGhvb2tzIGhhZCBydW4gd291bGQgYWxsb3cgcGFja2FnZXMgdG8gYWxzbyBwb3B1bGF0ZVxuLy8gX19tZXRlb3JfcnVudGltZV9jb25maWdfXyBkdXJpbmcgc3RhcnR1cCwgYnV0IHRoYXQncyB0b28gbGF0ZSBmb3Jcbi8vIGF1dG91cGRhdGUgYmVjYXVzZSBpdCBuZWVkcyB0byBoYXZlIHRoZSBjbGllbnQgaGFzaCBhdCBzdGFydHVwIHRvXG4vLyBpbnNlcnQgdGhlIGF1dG8gdXBkYXRlIHZlcnNpb24gaXRzZWxmIGludG9cbi8vIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18gdG8gZ2V0IGl0IHRvIHRoZSBjbGllbnQuXG4vL1xuLy8gQW4gYWx0ZXJuYXRpdmUgd291bGQgYmUgdG8gZ2l2ZSBhdXRvdXBkYXRlIGEgXCJwb3N0LXN0YXJ0LFxuLy8gcHJlLWxpc3RlblwiIGhvb2sgdG8gYWxsb3cgaXQgdG8gaW5zZXJ0IHRoZSBhdXRvIHVwZGF0ZSB2ZXJzaW9uIGF0XG4vLyB0aGUgcmlnaHQgbW9tZW50LlxuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGdldHRlcihrZXkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFyY2gpIHtcbiAgICAgIGFyY2ggPSBhcmNoIHx8IFdlYkFwcC5kZWZhdWx0QXJjaDtcbiAgICAgIGNvbnN0IHByb2dyYW0gPSBXZWJBcHAuY2xpZW50UHJvZ3JhbXNbYXJjaF07XG4gICAgICBjb25zdCB2YWx1ZSA9IHByb2dyYW0gJiYgcHJvZ3JhbVtrZXldO1xuICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZSB3ZSBoYXZlIGNhbGN1bGF0ZWQgdGhpcyBoYXNoLFxuICAgICAgLy8gcHJvZ3JhbVtrZXldIHdpbGwgYmUgYSB0aHVuayAobGF6eSBmdW5jdGlvbiB3aXRoIG5vIHBhcmFtZXRlcnMpXG4gICAgICAvLyB0aGF0IHdlIHNob3VsZCBjYWxsIHRvIGRvIHRoZSBhY3R1YWwgY29tcHV0YXRpb24uXG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgPyBwcm9ncmFtW2tleV0gPSB2YWx1ZSgpXG4gICAgICAgIDogdmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIFdlYkFwcC5jYWxjdWxhdGVDbGllbnRIYXNoID0gV2ViQXBwLmNsaWVudEhhc2ggPSBnZXR0ZXIoXCJ2ZXJzaW9uXCIpO1xuICBXZWJBcHAuY2FsY3VsYXRlQ2xpZW50SGFzaFJlZnJlc2hhYmxlID0gZ2V0dGVyKFwidmVyc2lvblJlZnJlc2hhYmxlXCIpO1xuICBXZWJBcHAuY2FsY3VsYXRlQ2xpZW50SGFzaE5vblJlZnJlc2hhYmxlID0gZ2V0dGVyKFwidmVyc2lvbk5vblJlZnJlc2hhYmxlXCIpO1xuICBXZWJBcHAuZ2V0UmVmcmVzaGFibGVBc3NldHMgPSBnZXR0ZXIoXCJyZWZyZXNoYWJsZUFzc2V0c1wiKTtcbn0pO1xuXG5cblxuLy8gV2hlbiB3ZSBoYXZlIGEgcmVxdWVzdCBwZW5kaW5nLCB3ZSB3YW50IHRoZSBzb2NrZXQgdGltZW91dCB0byBiZSBsb25nLCB0b1xuLy8gZ2l2ZSBvdXJzZWx2ZXMgYSB3aGlsZSB0byBzZXJ2ZSBpdCwgYW5kIHRvIGFsbG93IHNvY2tqcyBsb25nIHBvbGxzIHRvXG4vLyBjb21wbGV0ZS4gIE9uIHRoZSBvdGhlciBoYW5kLCB3ZSB3YW50IHRvIGNsb3NlIGlkbGUgc29ja2V0cyByZWxhdGl2ZWx5XG4vLyBxdWlja2x5LCBzbyB0aGF0IHdlIGNhbiBzaHV0IGRvd24gcmVsYXRpdmVseSBwcm9tcHRseSBidXQgY2xlYW5seSwgd2l0aG91dFxuLy8gY3V0dGluZyBvZmYgYW55b25lJ3MgcmVzcG9uc2UuXG5XZWJBcHAuX3RpbWVvdXRBZGp1c3RtZW50UmVxdWVzdENhbGxiYWNrID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7XG4gIC8vIHRoaXMgaXMgcmVhbGx5IGp1c3QgcmVxLnNvY2tldC5zZXRUaW1lb3V0KExPTkdfU09DS0VUX1RJTUVPVVQpO1xuICByZXEuc2V0VGltZW91dChMT05HX1NPQ0tFVF9USU1FT1VUKTtcbiAgLy8gSW5zZXJ0IG91ciBuZXcgZmluaXNoIGxpc3RlbmVyIHRvIHJ1biBCRUZPUkUgdGhlIGV4aXN0aW5nIG9uZSB3aGljaCByZW1vdmVzXG4gIC8vIHRoZSByZXNwb25zZSBmcm9tIHRoZSBzb2NrZXQuXG4gIHZhciBmaW5pc2hMaXN0ZW5lcnMgPSByZXMubGlzdGVuZXJzKCdmaW5pc2gnKTtcbiAgLy8gWFhYIEFwcGFyZW50bHkgaW4gTm9kZSAwLjEyIHRoaXMgZXZlbnQgd2FzIGNhbGxlZCAncHJlZmluaXNoJy5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2NvbW1pdC83YzliNjA3MFxuICAvLyBCdXQgaXQgaGFzIHN3aXRjaGVkIGJhY2sgdG8gJ2ZpbmlzaCcgaW4gTm9kZSB2NDpcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL3B1bGwvMTQxMVxuICByZXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdmaW5pc2gnKTtcbiAgcmVzLm9uKCdmaW5pc2gnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmVzLnNldFRpbWVvdXQoU0hPUlRfU09DS0VUX1RJTUVPVVQpO1xuICB9KTtcbiAgXy5lYWNoKGZpbmlzaExpc3RlbmVycywgZnVuY3Rpb24gKGwpIHsgcmVzLm9uKCdmaW5pc2gnLCBsKTsgfSk7XG59O1xuXG5cbi8vIFdpbGwgYmUgdXBkYXRlZCBieSBtYWluIGJlZm9yZSB3ZSBsaXN0ZW4uXG4vLyBNYXAgZnJvbSBjbGllbnQgYXJjaCB0byBib2lsZXJwbGF0ZSBvYmplY3QuXG4vLyBCb2lsZXJwbGF0ZSBvYmplY3QgaGFzOlxuLy8gICAtIGZ1bmM6IFhYWFxuLy8gICAtIGJhc2VEYXRhOiBYWFhcbnZhciBib2lsZXJwbGF0ZUJ5QXJjaCA9IHt9O1xuXG4vLyBSZWdpc3RlciBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgY2FuIHNlbGVjdGl2ZWx5IG1vZGlmeSBib2lsZXJwbGF0ZVxuLy8gZGF0YSBnaXZlbiBhcmd1bWVudHMgKHJlcXVlc3QsIGRhdGEsIGFyY2gpLiBUaGUga2V5IHNob3VsZCBiZSBhIHVuaXF1ZVxuLy8gaWRlbnRpZmllciwgdG8gcHJldmVudCBhY2N1bXVsYXRpbmcgZHVwbGljYXRlIGNhbGxiYWNrcyBmcm9tIHRoZSBzYW1lXG4vLyBjYWxsIHNpdGUgb3ZlciB0aW1lLiBDYWxsYmFja3Mgd2lsbCBiZSBjYWxsZWQgaW4gdGhlIG9yZGVyIHRoZXkgd2VyZVxuLy8gcmVnaXN0ZXJlZC4gQSBjYWxsYmFjayBzaG91bGQgcmV0dXJuIGZhbHNlIGlmIGl0IGRpZCBub3QgbWFrZSBhbnlcbi8vIGNoYW5nZXMgYWZmZWN0aW5nIHRoZSBib2lsZXJwbGF0ZS4gUGFzc2luZyBudWxsIGRlbGV0ZXMgdGhlIGNhbGxiYWNrLlxuLy8gQW55IHByZXZpb3VzIGNhbGxiYWNrIHJlZ2lzdGVyZWQgZm9yIHRoaXMga2V5IHdpbGwgYmUgcmV0dXJuZWQuXG5jb25zdCBib2lsZXJwbGF0ZURhdGFDYWxsYmFja3MgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuV2ViQXBwSW50ZXJuYWxzLnJlZ2lzdGVyQm9pbGVycGxhdGVEYXRhQ2FsbGJhY2sgPSBmdW5jdGlvbiAoa2V5LCBjYWxsYmFjaykge1xuICBjb25zdCBwcmV2aW91c0NhbGxiYWNrID0gYm9pbGVycGxhdGVEYXRhQ2FsbGJhY2tzW2tleV07XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgYm9pbGVycGxhdGVEYXRhQ2FsbGJhY2tzW2tleV0gPSBjYWxsYmFjaztcbiAgfSBlbHNlIHtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoY2FsbGJhY2ssIG51bGwpO1xuICAgIGRlbGV0ZSBib2lsZXJwbGF0ZURhdGFDYWxsYmFja3Nba2V5XTtcbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgcHJldmlvdXMgY2FsbGJhY2sgaW4gY2FzZSB0aGUgbmV3IGNhbGxiYWNrIG5lZWRzIHRvIGNhbGxcbiAgLy8gaXQ7IGZvciBleGFtcGxlLCB3aGVuIHRoZSBuZXcgY2FsbGJhY2sgaXMgYSB3cmFwcGVyIGZvciB0aGUgb2xkLlxuICByZXR1cm4gcHJldmlvdXNDYWxsYmFjayB8fCBudWxsO1xufTtcblxuLy8gR2l2ZW4gYSByZXF1ZXN0IChhcyByZXR1cm5lZCBmcm9tIGBjYXRlZ29yaXplUmVxdWVzdGApLCByZXR1cm4gdGhlXG4vLyBib2lsZXJwbGF0ZSBIVE1MIHRvIHNlcnZlIGZvciB0aGF0IHJlcXVlc3QuXG4vL1xuLy8gSWYgYSBwcmV2aW91cyBjb25uZWN0IG1pZGRsZXdhcmUgaGFzIHJlbmRlcmVkIGNvbnRlbnQgZm9yIHRoZSBoZWFkIG9yIGJvZHksXG4vLyByZXR1cm5zIHRoZSBib2lsZXJwbGF0ZSB3aXRoIHRoYXQgY29udGVudCBwYXRjaGVkIGluIG90aGVyd2lzZVxuLy8gbWVtb2l6ZXMgb24gSFRNTCBhdHRyaWJ1dGVzICh1c2VkIGJ5LCBlZywgYXBwY2FjaGUpIGFuZCB3aGV0aGVyIGlubGluZVxuLy8gc2NyaXB0cyBhcmUgY3VycmVudGx5IGFsbG93ZWQuXG4vLyBYWFggc28gZmFyIHRoaXMgZnVuY3Rpb24gaXMgYWx3YXlzIGNhbGxlZCB3aXRoIGFyY2ggPT09ICd3ZWIuYnJvd3NlcidcbmZ1bmN0aW9uIGdldEJvaWxlcnBsYXRlKHJlcXVlc3QsIGFyY2gpIHtcbiAgcmV0dXJuIGdldEJvaWxlcnBsYXRlQXN5bmMocmVxdWVzdCwgYXJjaCkuYXdhaXQoKTtcbn1cblxuZnVuY3Rpb24gZ2V0Qm9pbGVycGxhdGVBc3luYyhyZXF1ZXN0LCBhcmNoKSB7XG4gIGNvbnN0IGJvaWxlcnBsYXRlID0gYm9pbGVycGxhdGVCeUFyY2hbYXJjaF07XG4gIGNvbnN0IGRhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBib2lsZXJwbGF0ZS5iYXNlRGF0YSwge1xuICAgIGh0bWxBdHRyaWJ1dGVzOiBnZXRIdG1sQXR0cmlidXRlcyhyZXF1ZXN0KSxcbiAgfSwgXy5waWNrKHJlcXVlc3QsIFwiZHluYW1pY0hlYWRcIiwgXCJkeW5hbWljQm9keVwiKSk7XG5cbiAgbGV0IG1hZGVDaGFuZ2VzID0gZmFsc2U7XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbiAgT2JqZWN0LmtleXMoYm9pbGVycGxhdGVEYXRhQ2FsbGJhY2tzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IGJvaWxlcnBsYXRlRGF0YUNhbGxiYWNrc1trZXldO1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHJlcXVlc3QsIGRhdGEsIGFyY2gpO1xuICAgIH0pLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgIC8vIENhbGxiYWNrcyBzaG91bGQgcmV0dXJuIGZhbHNlIGlmIHRoZXkgZGlkIG5vdCBtYWtlIGFueSBjaGFuZ2VzLlxuICAgICAgaWYgKHJlc3VsdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgbWFkZUNoYW5nZXMgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+ICh7XG4gICAgc3RyZWFtOiBib2lsZXJwbGF0ZS50b0hUTUxTdHJlYW0oZGF0YSksXG4gICAgc3RhdHVzQ29kZTogZGF0YS5zdGF0dXNDb2RlLFxuICAgIGhlYWRlcnM6IGRhdGEuaGVhZGVycyxcbiAgfSkpO1xufVxuXG5XZWJBcHBJbnRlcm5hbHMuZ2VuZXJhdGVCb2lsZXJwbGF0ZUluc3RhbmNlID0gZnVuY3Rpb24gKGFyY2gsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hbmlmZXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsT3B0aW9ucykge1xuICBhZGRpdGlvbmFsT3B0aW9ucyA9IGFkZGl0aW9uYWxPcHRpb25zIHx8IHt9O1xuXG4gIGNvbnN0IG1ldGVvclJ1bnRpbWVDb25maWcgPSBKU09OLnN0cmluZ2lmeShcbiAgICBlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgLi4uX19tZXRlb3JfcnVudGltZV9jb25maWdfXyxcbiAgICAgIC4uLihhZGRpdGlvbmFsT3B0aW9ucy5ydW50aW1lQ29uZmlnT3ZlcnJpZGVzIHx8IHt9KVxuICAgIH0pKVxuICApO1xuXG4gIHJldHVybiBuZXcgQm9pbGVycGxhdGUoYXJjaCwgbWFuaWZlc3QsIF8uZXh0ZW5kKHtcbiAgICBwYXRoTWFwcGVyKGl0ZW1QYXRoKSB7XG4gICAgICByZXR1cm4gcGF0aEpvaW4oYXJjaFBhdGhbYXJjaF0sIGl0ZW1QYXRoKTtcbiAgICB9LFxuICAgIGJhc2VEYXRhRXh0ZW5zaW9uOiB7XG4gICAgICBhZGRpdGlvbmFsU3RhdGljSnM6IF8ubWFwKFxuICAgICAgICBhZGRpdGlvbmFsU3RhdGljSnMgfHwgW10sXG4gICAgICAgIGZ1bmN0aW9uIChjb250ZW50cywgcGF0aG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGF0aG5hbWU6IHBhdGhuYW1lLFxuICAgICAgICAgICAgY29udGVudHM6IGNvbnRlbnRzXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgKSxcbiAgICAgIC8vIENvbnZlcnQgdG8gYSBKU09OIHN0cmluZywgdGhlbiBnZXQgcmlkIG9mIG1vc3Qgd2VpcmQgY2hhcmFjdGVycywgdGhlblxuICAgICAgLy8gd3JhcCBpbiBkb3VibGUgcXVvdGVzLiAoVGhlIG91dGVybW9zdCBKU09OLnN0cmluZ2lmeSByZWFsbHkgb3VnaHQgdG9cbiAgICAgIC8vIGp1c3QgYmUgXCJ3cmFwIGluIGRvdWJsZSBxdW90ZXNcIiBidXQgd2UgdXNlIGl0IHRvIGJlIHNhZmUuKSBUaGlzIG1pZ2h0XG4gICAgICAvLyBlbmQgdXAgaW5zaWRlIGEgPHNjcmlwdD4gdGFnIHNvIHdlIG5lZWQgdG8gYmUgY2FyZWZ1bCB0byBub3QgaW5jbHVkZVxuICAgICAgLy8gXCI8L3NjcmlwdD5cIiwgYnV0IG5vcm1hbCB7e3NwYWNlYmFyc319IGVzY2FwaW5nIGVzY2FwZXMgdG9vIG11Y2ghIFNlZVxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21ldGVvci9tZXRlb3IvaXNzdWVzLzM3MzBcbiAgICAgIG1ldGVvclJ1bnRpbWVDb25maWcsXG4gICAgICBtZXRlb3JSdW50aW1lSGFzaDogc2hhMShtZXRlb3JSdW50aW1lQ29uZmlnKSxcbiAgICAgIHJvb3RVcmxQYXRoUHJlZml4OiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYIHx8ICcnLFxuICAgICAgYnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2s6IGJ1bmRsZWRKc0Nzc1VybFJld3JpdGVIb29rLFxuICAgICAgc3JpTW9kZTogc3JpTW9kZSxcbiAgICAgIGlubGluZVNjcmlwdHNBbGxvd2VkOiBXZWJBcHBJbnRlcm5hbHMuaW5saW5lU2NyaXB0c0FsbG93ZWQoKSxcbiAgICAgIGlubGluZTogYWRkaXRpb25hbE9wdGlvbnMuaW5saW5lXG4gICAgfVxuICB9LCBhZGRpdGlvbmFsT3B0aW9ucykpO1xufTtcblxuLy8gQSBtYXBwaW5nIGZyb20gdXJsIHBhdGggdG8gYXJjaGl0ZWN0dXJlIChlLmcuIFwid2ViLmJyb3dzZXJcIikgdG8gc3RhdGljXG4vLyBmaWxlIGluZm9ybWF0aW9uIHdpdGggdGhlIGZvbGxvd2luZyBmaWVsZHM6XG4vLyAtIHR5cGU6IHRoZSB0eXBlIG9mIGZpbGUgdG8gYmUgc2VydmVkXG4vLyAtIGNhY2hlYWJsZTogb3B0aW9uYWxseSwgd2hldGhlciB0aGUgZmlsZSBzaG91bGQgYmUgY2FjaGVkIG9yIG5vdFxuLy8gLSBzb3VyY2VNYXBVcmw6IG9wdGlvbmFsbHksIHRoZSB1cmwgb2YgdGhlIHNvdXJjZSBtYXBcbi8vXG4vLyBJbmZvIGFsc28gY29udGFpbnMgb25lIG9mIHRoZSBmb2xsb3dpbmc6XG4vLyAtIGNvbnRlbnQ6IHRoZSBzdHJpbmdpZmllZCBjb250ZW50IHRoYXQgc2hvdWxkIGJlIHNlcnZlZCBhdCB0aGlzIHBhdGhcbi8vIC0gYWJzb2x1dGVQYXRoOiB0aGUgYWJzb2x1dGUgcGF0aCBvbiBkaXNrIHRvIHRoZSBmaWxlXG5cbi8vIFNlcnZlIHN0YXRpYyBmaWxlcyBmcm9tIHRoZSBtYW5pZmVzdCBvciBhZGRlZCB3aXRoXG4vLyBgYWRkU3RhdGljSnNgLiBFeHBvcnRlZCBmb3IgdGVzdHMuXG5XZWJBcHBJbnRlcm5hbHMuc3RhdGljRmlsZXNNaWRkbGV3YXJlID0gYXN5bmMgZnVuY3Rpb24gKFxuICBzdGF0aWNGaWxlc0J5QXJjaCxcbiAgcmVxLFxuICByZXMsXG4gIG5leHQsXG4pIHtcbiAgaWYgKCdHRVQnICE9IHJlcS5tZXRob2QgJiYgJ0hFQUQnICE9IHJlcS5tZXRob2QgJiYgJ09QVElPTlMnICE9IHJlcS5tZXRob2QpIHtcbiAgICBuZXh0KCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBwYXRobmFtZSA9IHBhcnNlUmVxdWVzdChyZXEpLnBhdGhuYW1lO1xuICB0cnkge1xuICAgIHBhdGhuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhdGhuYW1lKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIG5leHQoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgc2VydmVTdGF0aWNKcyA9IGZ1bmN0aW9uIChzKSB7XG4gICAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAgICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdDsgY2hhcnNldD1VVEYtOCdcbiAgICB9KTtcbiAgICByZXMud3JpdGUocyk7XG4gICAgcmVzLmVuZCgpO1xuICB9O1xuXG4gIGlmIChfLmhhcyhhZGRpdGlvbmFsU3RhdGljSnMsIHBhdGhuYW1lKSAmJlxuICAgICAgICAgICAgICAhIFdlYkFwcEludGVybmFscy5pbmxpbmVTY3JpcHRzQWxsb3dlZCgpKSB7XG4gICAgc2VydmVTdGF0aWNKcyhhZGRpdGlvbmFsU3RhdGljSnNbcGF0aG5hbWVdKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB7IGFyY2gsIHBhdGggfSA9IGdldEFyY2hBbmRQYXRoKFxuICAgIHBhdGhuYW1lLFxuICAgIGlkZW50aWZ5QnJvd3NlcihyZXEuaGVhZGVyc1tcInVzZXItYWdlbnRcIl0pLFxuICApO1xuXG4gIGlmICghIGhhc093bi5jYWxsKFdlYkFwcC5jbGllbnRQcm9ncmFtcywgYXJjaCkpIHtcbiAgICAvLyBXZSBjb3VsZCBjb21lIGhlcmUgaW4gY2FzZSB3ZSBydW4gd2l0aCBzb21lIGFyY2hpdGVjdHVyZXMgZXhjbHVkZWRcbiAgICBuZXh0KCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gSWYgcGF1c2VDbGllbnQoYXJjaCkgaGFzIGJlZW4gY2FsbGVkLCBwcm9ncmFtLnBhdXNlZCB3aWxsIGJlIGFcbiAgLy8gUHJvbWlzZSB0aGF0IHdpbGwgYmUgcmVzb2x2ZWQgd2hlbiB0aGUgcHJvZ3JhbSBpcyB1bnBhdXNlZC5cbiAgY29uc3QgcHJvZ3JhbSA9IFdlYkFwcC5jbGllbnRQcm9ncmFtc1thcmNoXTtcbiAgYXdhaXQgcHJvZ3JhbS5wYXVzZWQ7XG5cbiAgaWYgKHBhdGggPT09IFwiL21ldGVvcl9ydW50aW1lX2NvbmZpZy5qc1wiICYmXG4gICAgICAhIFdlYkFwcEludGVybmFscy5pbmxpbmVTY3JpcHRzQWxsb3dlZCgpKSB7XG4gICAgc2VydmVTdGF0aWNKcyhgX19tZXRlb3JfcnVudGltZV9jb25maWdfXyA9ICR7cHJvZ3JhbS5tZXRlb3JSdW50aW1lQ29uZmlnfTtgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBpbmZvID0gZ2V0U3RhdGljRmlsZUluZm8oc3RhdGljRmlsZXNCeUFyY2gsIHBhdGhuYW1lLCBwYXRoLCBhcmNoKTtcbiAgaWYgKCEgaW5mbykge1xuICAgIG5leHQoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBXZSBkb24ndCBuZWVkIHRvIGNhbGwgcGF1c2UgYmVjYXVzZSwgdW5saWtlICdzdGF0aWMnLCBvbmNlIHdlIGNhbGwgaW50b1xuICAvLyAnc2VuZCcgYW5kIHlpZWxkIHRvIHRoZSBldmVudCBsb29wLCB3ZSBuZXZlciBjYWxsIGFub3RoZXIgaGFuZGxlciB3aXRoXG4gIC8vICduZXh0Jy5cblxuICAvLyBDYWNoZWFibGUgZmlsZXMgYXJlIGZpbGVzIHRoYXQgc2hvdWxkIG5ldmVyIGNoYW5nZS4gVHlwaWNhbGx5XG4gIC8vIG5hbWVkIGJ5IHRoZWlyIGhhc2ggKGVnIG1ldGVvciBidW5kbGVkIGpzIGFuZCBjc3MgZmlsZXMpLlxuICAvLyBXZSBjYWNoZSB0aGVtIH5mb3JldmVyICgxeXIpLlxuICBjb25zdCBtYXhBZ2UgPSBpbmZvLmNhY2hlYWJsZVxuICAgID8gMTAwMCAqIDYwICogNjAgKiAyNCAqIDM2NVxuICAgIDogMDtcblxuICBpZiAoaW5mby5jYWNoZWFibGUpIHtcbiAgICAvLyBTaW5jZSB3ZSB1c2UgcmVxLmhlYWRlcnNbXCJ1c2VyLWFnZW50XCJdIHRvIGRldGVybWluZSB3aGV0aGVyIHRoZVxuICAgIC8vIGNsaWVudCBzaG91bGQgcmVjZWl2ZSBtb2Rlcm4gb3IgbGVnYWN5IHJlc291cmNlcywgdGVsbCB0aGUgY2xpZW50XG4gICAgLy8gdG8gaW52YWxpZGF0ZSBjYWNoZWQgcmVzb3VyY2VzIHdoZW4vaWYgaXRzIHVzZXIgYWdlbnQgc3RyaW5nXG4gICAgLy8gY2hhbmdlcyBpbiB0aGUgZnV0dXJlLlxuICAgIHJlcy5zZXRIZWFkZXIoXCJWYXJ5XCIsIFwiVXNlci1BZ2VudFwiKTtcbiAgfVxuXG4gIC8vIFNldCB0aGUgWC1Tb3VyY2VNYXAgaGVhZGVyLCB3aGljaCBjdXJyZW50IENocm9tZSwgRmlyZUZveCwgYW5kIFNhZmFyaVxuICAvLyB1bmRlcnN0YW5kLiAgKFRoZSBTb3VyY2VNYXAgaGVhZGVyIGlzIHNsaWdodGx5IG1vcmUgc3BlYy1jb3JyZWN0IGJ1dCBGRlxuICAvLyBkb2Vzbid0IHVuZGVyc3RhbmQgaXQuKVxuICAvL1xuICAvLyBZb3UgbWF5IGFsc28gbmVlZCB0byBlbmFibGUgc291cmNlIG1hcHMgaW4gQ2hyb21lOiBvcGVuIGRldiB0b29scywgY2xpY2tcbiAgLy8gdGhlIGdlYXIgaW4gdGhlIGJvdHRvbSByaWdodCBjb3JuZXIsIGFuZCBzZWxlY3QgXCJlbmFibGUgc291cmNlIG1hcHNcIi5cbiAgaWYgKGluZm8uc291cmNlTWFwVXJsKSB7XG4gICAgcmVzLnNldEhlYWRlcignWC1Tb3VyY2VNYXAnLFxuICAgICAgICAgICAgICAgICAgX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTF9QQVRIX1BSRUZJWCArXG4gICAgICAgICAgICAgICAgICBpbmZvLnNvdXJjZU1hcFVybCk7XG4gIH1cblxuICBpZiAoaW5mby50eXBlID09PSBcImpzXCIgfHxcbiAgICAgIGluZm8udHlwZSA9PT0gXCJkeW5hbWljIGpzXCIpIHtcbiAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vamF2YXNjcmlwdDsgY2hhcnNldD1VVEYtOFwiKTtcbiAgfSBlbHNlIGlmIChpbmZvLnR5cGUgPT09IFwiY3NzXCIpIHtcbiAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwidGV4dC9jc3M7IGNoYXJzZXQ9VVRGLThcIik7XG4gIH0gZWxzZSBpZiAoaW5mby50eXBlID09PSBcImpzb25cIikge1xuICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCIpO1xuICB9XG5cbiAgaWYgKGluZm8uaGFzaCkge1xuICAgIHJlcy5zZXRIZWFkZXIoJ0VUYWcnLCAnXCInICsgaW5mby5oYXNoICsgJ1wiJyk7XG4gIH1cblxuICBpZiAoaW5mby5jb250ZW50KSB7XG4gICAgcmVzLndyaXRlKGluZm8uY29udGVudCk7XG4gICAgcmVzLmVuZCgpO1xuICB9IGVsc2Uge1xuICAgIHNlbmQocmVxLCBpbmZvLmFic29sdXRlUGF0aCwge1xuICAgICAgbWF4YWdlOiBtYXhBZ2UsXG4gICAgICBkb3RmaWxlczogJ2FsbG93JywgLy8gaWYgd2Ugc3BlY2lmaWVkIGEgZG90ZmlsZSBpbiB0aGUgbWFuaWZlc3QsIHNlcnZlIGl0XG4gICAgICBsYXN0TW9kaWZpZWQ6IGZhbHNlIC8vIGRvbid0IHNldCBsYXN0LW1vZGlmaWVkIGJhc2VkIG9uIHRoZSBmaWxlIGRhdGVcbiAgICB9KS5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBMb2cuZXJyb3IoXCJFcnJvciBzZXJ2aW5nIHN0YXRpYyBmaWxlIFwiICsgZXJyKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoNTAwKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9KS5vbignZGlyZWN0b3J5JywgZnVuY3Rpb24gKCkge1xuICAgICAgTG9nLmVycm9yKFwiVW5leHBlY3RlZCBkaXJlY3RvcnkgXCIgKyBpbmZvLmFic29sdXRlUGF0aCk7XG4gICAgICByZXMud3JpdGVIZWFkKDUwMCk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfSkucGlwZShyZXMpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBnZXRTdGF0aWNGaWxlSW5mbyhzdGF0aWNGaWxlc0J5QXJjaCwgb3JpZ2luYWxQYXRoLCBwYXRoLCBhcmNoKSB7XG4gIGlmICghIGhhc093bi5jYWxsKFdlYkFwcC5jbGllbnRQcm9ncmFtcywgYXJjaCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEdldCBhIGxpc3Qgb2YgYWxsIGF2YWlsYWJsZSBzdGF0aWMgZmlsZSBhcmNoaXRlY3R1cmVzLCB3aXRoIGFyY2hcbiAgLy8gZmlyc3QgaW4gdGhlIGxpc3QgaWYgaXQgZXhpc3RzLlxuICBjb25zdCBzdGF0aWNBcmNoTGlzdCA9IE9iamVjdC5rZXlzKHN0YXRpY0ZpbGVzQnlBcmNoKTtcbiAgY29uc3QgYXJjaEluZGV4ID0gc3RhdGljQXJjaExpc3QuaW5kZXhPZihhcmNoKTtcbiAgaWYgKGFyY2hJbmRleCA+IDApIHtcbiAgICBzdGF0aWNBcmNoTGlzdC51bnNoaWZ0KHN0YXRpY0FyY2hMaXN0LnNwbGljZShhcmNoSW5kZXgsIDEpWzBdKTtcbiAgfVxuXG4gIGxldCBpbmZvID0gbnVsbDtcblxuICBzdGF0aWNBcmNoTGlzdC5zb21lKGFyY2ggPT4ge1xuICAgIGNvbnN0IHN0YXRpY0ZpbGVzID0gc3RhdGljRmlsZXNCeUFyY2hbYXJjaF07XG5cbiAgICBmdW5jdGlvbiBmaW5hbGl6ZShwYXRoKSB7XG4gICAgICBpbmZvID0gc3RhdGljRmlsZXNbcGF0aF07XG4gICAgICAvLyBTb21ldGltZXMgd2UgcmVnaXN0ZXIgYSBsYXp5IGZ1bmN0aW9uIGluc3RlYWQgb2YgYWN0dWFsIGRhdGEgaW5cbiAgICAgIC8vIHRoZSBzdGF0aWNGaWxlcyBtYW5pZmVzdC5cbiAgICAgIGlmICh0eXBlb2YgaW5mbyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGluZm8gPSBzdGF0aWNGaWxlc1twYXRoXSA9IGluZm8oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIElmIHN0YXRpY0ZpbGVzIGNvbnRhaW5zIG9yaWdpbmFsUGF0aCB3aXRoIHRoZSBhcmNoIGluZmVycmVkIGFib3ZlLFxuICAgIC8vIHVzZSB0aGF0IGluZm9ybWF0aW9uLlxuICAgIGlmIChoYXNPd24uY2FsbChzdGF0aWNGaWxlcywgb3JpZ2luYWxQYXRoKSkge1xuICAgICAgcmV0dXJuIGZpbmFsaXplKG9yaWdpbmFsUGF0aCk7XG4gICAgfVxuXG4gICAgLy8gSWYgZ2V0QXJjaEFuZFBhdGggcmV0dXJuZWQgYW4gYWx0ZXJuYXRlIHBhdGgsIHRyeSB0aGF0IGluc3RlYWQuXG4gICAgaWYgKHBhdGggIT09IG9yaWdpbmFsUGF0aCAmJlxuICAgICAgICBoYXNPd24uY2FsbChzdGF0aWNGaWxlcywgcGF0aCkpIHtcbiAgICAgIHJldHVybiBmaW5hbGl6ZShwYXRoKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBpbmZvO1xufVxuXG5mdW5jdGlvbiBnZXRBcmNoQW5kUGF0aChwYXRoLCBicm93c2VyKSB7XG4gIGNvbnN0IHBhdGhQYXJ0cyA9IHBhdGguc3BsaXQoXCIvXCIpO1xuICBjb25zdCBhcmNoS2V5ID0gcGF0aFBhcnRzWzFdO1xuXG4gIGlmIChhcmNoS2V5LnN0YXJ0c1dpdGgoXCJfX1wiKSkge1xuICAgIGNvbnN0IGFyY2hDbGVhbmVkID0gXCJ3ZWIuXCIgKyBhcmNoS2V5LnNsaWNlKDIpO1xuICAgIGlmIChoYXNPd24uY2FsbChXZWJBcHAuY2xpZW50UHJvZ3JhbXMsIGFyY2hDbGVhbmVkKSkge1xuICAgICAgcGF0aFBhcnRzLnNwbGljZSgxLCAxKTsgLy8gUmVtb3ZlIHRoZSBhcmNoS2V5IHBhcnQuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBhcmNoOiBhcmNoQ2xlYW5lZCxcbiAgICAgICAgcGF0aDogcGF0aFBhcnRzLmpvaW4oXCIvXCIpLFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICAvLyBUT0RPIFBlcmhhcHMgb25lIGRheSB3ZSBjb3VsZCBpbmZlciBDb3Jkb3ZhIGNsaWVudHMgaGVyZSwgc28gdGhhdCB3ZVxuICAvLyB3b3VsZG4ndCBoYXZlIHRvIHVzZSBwcmVmaXhlZCBcIi9fX2NvcmRvdmEvLi4uXCIgVVJMcy5cbiAgY29uc3QgYXJjaCA9IGlzTW9kZXJuKGJyb3dzZXIpXG4gICAgPyBcIndlYi5icm93c2VyXCJcbiAgICA6IFwid2ViLmJyb3dzZXIubGVnYWN5XCI7XG5cbiAgaWYgKGhhc093bi5jYWxsKFdlYkFwcC5jbGllbnRQcm9ncmFtcywgYXJjaCkpIHtcbiAgICByZXR1cm4geyBhcmNoLCBwYXRoIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGFyY2g6IFdlYkFwcC5kZWZhdWx0QXJjaCxcbiAgICBwYXRoLFxuICB9O1xufVxuXG4vLyBQYXJzZSB0aGUgcGFzc2VkIGluIHBvcnQgdmFsdWUuIFJldHVybiB0aGUgcG9ydCBhcy1pcyBpZiBpdCdzIGEgU3RyaW5nXG4vLyAoZS5nLiBhIFdpbmRvd3MgU2VydmVyIHN0eWxlIG5hbWVkIHBpcGUpLCBvdGhlcndpc2UgcmV0dXJuIHRoZSBwb3J0IGFzIGFuXG4vLyBpbnRlZ2VyLlxuLy9cbi8vIERFUFJFQ0FURUQ6IERpcmVjdCB1c2Ugb2YgdGhpcyBmdW5jdGlvbiBpcyBub3QgcmVjb21tZW5kZWQ7IGl0IGlzIG5vXG4vLyBsb25nZXIgdXNlZCBpbnRlcm5hbGx5LCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGEgZnV0dXJlIHJlbGVhc2UuXG5XZWJBcHBJbnRlcm5hbHMucGFyc2VQb3J0ID0gcG9ydCA9PiB7XG4gIGxldCBwYXJzZWRQb3J0ID0gcGFyc2VJbnQocG9ydCk7XG4gIGlmIChOdW1iZXIuaXNOYU4ocGFyc2VkUG9ydCkpIHtcbiAgICBwYXJzZWRQb3J0ID0gcG9ydDtcbiAgfVxuICByZXR1cm4gcGFyc2VkUG9ydDtcbn1cblxuaW1wb3J0IHsgb25NZXNzYWdlIH0gZnJvbSBcIm1ldGVvci9pbnRlci1wcm9jZXNzLW1lc3NhZ2luZ1wiO1xuXG5vbk1lc3NhZ2UoXCJ3ZWJhcHAtcGF1c2UtY2xpZW50XCIsIGFzeW5jICh7IGFyY2ggfSkgPT4ge1xuICBXZWJBcHBJbnRlcm5hbHMucGF1c2VDbGllbnQoYXJjaCk7XG59KTtcblxub25NZXNzYWdlKFwid2ViYXBwLXJlbG9hZC1jbGllbnRcIiwgYXN5bmMgKHsgYXJjaCB9KSA9PiB7XG4gIFdlYkFwcEludGVybmFscy5nZW5lcmF0ZUNsaWVudFByb2dyYW0oYXJjaCk7XG59KTtcblxuZnVuY3Rpb24gcnVuV2ViQXBwU2VydmVyKCkge1xuICB2YXIgc2h1dHRpbmdEb3duID0gZmFsc2U7XG4gIHZhciBzeW5jUXVldWUgPSBuZXcgTWV0ZW9yLl9TeW5jaHJvbm91c1F1ZXVlKCk7XG5cbiAgdmFyIGdldEl0ZW1QYXRobmFtZSA9IGZ1bmN0aW9uIChpdGVtVXJsKSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChwYXJzZVVybChpdGVtVXJsKS5wYXRobmFtZSk7XG4gIH07XG5cbiAgV2ViQXBwSW50ZXJuYWxzLnJlbG9hZENsaWVudFByb2dyYW1zID0gZnVuY3Rpb24gKCkge1xuICAgIHN5bmNRdWV1ZS5ydW5UYXNrKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qgc3RhdGljRmlsZXNCeUFyY2ggPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgICBjb25zdCB7IGNvbmZpZ0pzb24gfSA9IF9fbWV0ZW9yX2Jvb3RzdHJhcF9fO1xuICAgICAgY29uc3QgY2xpZW50QXJjaHMgPSBjb25maWdKc29uLmNsaWVudEFyY2hzIHx8XG4gICAgICAgIE9iamVjdC5rZXlzKGNvbmZpZ0pzb24uY2xpZW50UGF0aHMpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjbGllbnRBcmNocy5mb3JFYWNoKGFyY2ggPT4ge1xuICAgICAgICAgIGdlbmVyYXRlQ2xpZW50UHJvZ3JhbShhcmNoLCBzdGF0aWNGaWxlc0J5QXJjaCk7XG4gICAgICAgIH0pO1xuICAgICAgICBXZWJBcHBJbnRlcm5hbHMuc3RhdGljRmlsZXNCeUFyY2ggPSBzdGF0aWNGaWxlc0J5QXJjaDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgTG9nLmVycm9yKFwiRXJyb3IgcmVsb2FkaW5nIHRoZSBjbGllbnQgcHJvZ3JhbTogXCIgKyBlLnN0YWNrKTtcbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIC8vIFBhdXNlIGFueSBpbmNvbWluZyByZXF1ZXN0cyBhbmQgbWFrZSB0aGVtIHdhaXQgZm9yIHRoZSBwcm9ncmFtIHRvIGJlXG4gIC8vIHVucGF1c2VkIHRoZSBuZXh0IHRpbWUgZ2VuZXJhdGVDbGllbnRQcm9ncmFtKGFyY2gpIGlzIGNhbGxlZC5cbiAgV2ViQXBwSW50ZXJuYWxzLnBhdXNlQ2xpZW50ID0gZnVuY3Rpb24gKGFyY2gpIHtcbiAgICBzeW5jUXVldWUucnVuVGFzaygoKSA9PiB7XG4gICAgICBjb25zdCBwcm9ncmFtID0gV2ViQXBwLmNsaWVudFByb2dyYW1zW2FyY2hdO1xuICAgICAgY29uc3QgeyB1bnBhdXNlIH0gPSBwcm9ncmFtO1xuICAgICAgcHJvZ3JhbS5wYXVzZWQgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB1bnBhdXNlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAvLyBJZiB0aGVyZSBoYXBwZW5zIHRvIGJlIGFuIGV4aXN0aW5nIHByb2dyYW0udW5wYXVzZSBmdW5jdGlvbixcbiAgICAgICAgICAvLyBjb21wb3NlIGl0IHdpdGggdGhlIHJlc29sdmUgZnVuY3Rpb24uXG4gICAgICAgICAgcHJvZ3JhbS51bnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdW5wYXVzZSgpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvZ3JhbS51bnBhdXNlID0gcmVzb2x2ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgV2ViQXBwSW50ZXJuYWxzLmdlbmVyYXRlQ2xpZW50UHJvZ3JhbSA9IGZ1bmN0aW9uIChhcmNoKSB7XG4gICAgc3luY1F1ZXVlLnJ1blRhc2soKCkgPT4gZ2VuZXJhdGVDbGllbnRQcm9ncmFtKGFyY2gpKTtcbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZUNsaWVudFByb2dyYW0oXG4gICAgYXJjaCxcbiAgICBzdGF0aWNGaWxlc0J5QXJjaCA9IFdlYkFwcEludGVybmFscy5zdGF0aWNGaWxlc0J5QXJjaCxcbiAgKSB7XG4gICAgY29uc3QgY2xpZW50RGlyID0gcGF0aEpvaW4oXG4gICAgICBwYXRoRGlybmFtZShfX21ldGVvcl9ib290c3RyYXBfXy5zZXJ2ZXJEaXIpLFxuICAgICAgYXJjaCxcbiAgICApO1xuXG4gICAgLy8gcmVhZCB0aGUgY29udHJvbCBmb3IgdGhlIGNsaWVudCB3ZSdsbCBiZSBzZXJ2aW5nIHVwXG4gICAgY29uc3QgcHJvZ3JhbUpzb25QYXRoID0gcGF0aEpvaW4oY2xpZW50RGlyLCBcInByb2dyYW0uanNvblwiKTtcblxuICAgIGxldCBwcm9ncmFtSnNvbjtcbiAgICB0cnkge1xuICAgICAgcHJvZ3JhbUpzb24gPSBKU09OLnBhcnNlKHJlYWRGaWxlU3luYyhwcm9ncmFtSnNvblBhdGgpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5jb2RlID09PSBcIkVOT0VOVFwiKSByZXR1cm47XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIGlmIChwcm9ncmFtSnNvbi5mb3JtYXQgIT09IFwid2ViLXByb2dyYW0tcHJlMVwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBmb3JtYXQgZm9yIGNsaWVudCBhc3NldHM6IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShwcm9ncmFtSnNvbi5mb3JtYXQpKTtcbiAgICB9XG5cbiAgICBpZiAoISBwcm9ncmFtSnNvblBhdGggfHwgISBjbGllbnREaXIgfHwgISBwcm9ncmFtSnNvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2xpZW50IGNvbmZpZyBmaWxlIG5vdCBwYXJzZWQuXCIpO1xuICAgIH1cblxuICAgIGFyY2hQYXRoW2FyY2hdID0gY2xpZW50RGlyO1xuICAgIGNvbnN0IHN0YXRpY0ZpbGVzID0gc3RhdGljRmlsZXNCeUFyY2hbYXJjaF0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgY29uc3QgeyBtYW5pZmVzdCB9ID0gcHJvZ3JhbUpzb247XG4gICAgbWFuaWZlc3QuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtLnVybCAmJiBpdGVtLndoZXJlID09PSBcImNsaWVudFwiKSB7XG4gICAgICAgIHN0YXRpY0ZpbGVzW2dldEl0ZW1QYXRobmFtZShpdGVtLnVybCldID0ge1xuICAgICAgICAgIGFic29sdXRlUGF0aDogcGF0aEpvaW4oY2xpZW50RGlyLCBpdGVtLnBhdGgpLFxuICAgICAgICAgIGNhY2hlYWJsZTogaXRlbS5jYWNoZWFibGUsXG4gICAgICAgICAgaGFzaDogaXRlbS5oYXNoLFxuICAgICAgICAgIC8vIExpbmsgZnJvbSBzb3VyY2UgdG8gaXRzIG1hcFxuICAgICAgICAgIHNvdXJjZU1hcFVybDogaXRlbS5zb3VyY2VNYXBVcmwsXG4gICAgICAgICAgdHlwZTogaXRlbS50eXBlXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGl0ZW0uc291cmNlTWFwKSB7XG4gICAgICAgICAgLy8gU2VydmUgdGhlIHNvdXJjZSBtYXAgdG9vLCB1bmRlciB0aGUgc3BlY2lmaWVkIFVSTC4gV2UgYXNzdW1lXG4gICAgICAgICAgLy8gYWxsIHNvdXJjZSBtYXBzIGFyZSBjYWNoZWFibGUuXG4gICAgICAgICAgc3RhdGljRmlsZXNbZ2V0SXRlbVBhdGhuYW1lKGl0ZW0uc291cmNlTWFwVXJsKV0gPSB7XG4gICAgICAgICAgICBhYnNvbHV0ZVBhdGg6IHBhdGhKb2luKGNsaWVudERpciwgaXRlbS5zb3VyY2VNYXApLFxuICAgICAgICAgICAgY2FjaGVhYmxlOiB0cnVlXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgeyBQVUJMSUNfU0VUVElOR1MgfSA9IF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX187XG4gICAgY29uc3QgY29uZmlnT3ZlcnJpZGVzID0ge1xuICAgICAgUFVCTElDX1NFVFRJTkdTLFxuICAgIH07XG5cbiAgICBjb25zdCBvbGRQcm9ncmFtID0gV2ViQXBwLmNsaWVudFByb2dyYW1zW2FyY2hdO1xuICAgIGNvbnN0IG5ld1Byb2dyYW0gPSBXZWJBcHAuY2xpZW50UHJvZ3JhbXNbYXJjaF0gPSB7XG4gICAgICBmb3JtYXQ6IFwid2ViLXByb2dyYW0tcHJlMVwiLFxuICAgICAgbWFuaWZlc3Q6IG1hbmlmZXN0LFxuICAgICAgLy8gVXNlIGFycm93IGZ1bmN0aW9ucyBzbyB0aGF0IHRoZXNlIHZlcnNpb25zIGNhbiBiZSBsYXppbHlcbiAgICAgIC8vIGNhbGN1bGF0ZWQgbGF0ZXIsIGFuZCBzbyB0aGF0IHRoZXkgd2lsbCBub3QgYmUgaW5jbHVkZWQgaW4gdGhlXG4gICAgICAvLyBzdGF0aWNGaWxlc1ttYW5pZmVzdFVybF0uY29udGVudCBzdHJpbmcgYmVsb3cuXG4gICAgICAvL1xuICAgICAgLy8gTm90ZTogdGhlc2UgdmVyc2lvbiBjYWxjdWxhdGlvbnMgbXVzdCBiZSBrZXB0IGluIGFncmVlbWVudCB3aXRoXG4gICAgICAvLyBDb3Jkb3ZhQnVpbGRlciNhcHBlbmRWZXJzaW9uIGluIHRvb2xzL2NvcmRvdmEvYnVpbGRlci5qcywgb3IgaG90XG4gICAgICAvLyBjb2RlIHB1c2ggd2lsbCByZWxvYWQgQ29yZG92YSBhcHBzIHVubmVjZXNzYXJpbHkuXG4gICAgICB2ZXJzaW9uOiAoKSA9PiBXZWJBcHBIYXNoaW5nLmNhbGN1bGF0ZUNsaWVudEhhc2goXG4gICAgICAgIG1hbmlmZXN0LCBudWxsLCBjb25maWdPdmVycmlkZXMpLFxuICAgICAgdmVyc2lvblJlZnJlc2hhYmxlOiAoKSA9PiBXZWJBcHBIYXNoaW5nLmNhbGN1bGF0ZUNsaWVudEhhc2goXG4gICAgICAgIG1hbmlmZXN0LCB0eXBlID0+IHR5cGUgPT09IFwiY3NzXCIsIGNvbmZpZ092ZXJyaWRlcyksXG4gICAgICB2ZXJzaW9uTm9uUmVmcmVzaGFibGU6ICgpID0+IFdlYkFwcEhhc2hpbmcuY2FsY3VsYXRlQ2xpZW50SGFzaChcbiAgICAgICAgbWFuaWZlc3QsIHR5cGUgPT4gdHlwZSAhPT0gXCJjc3NcIiwgY29uZmlnT3ZlcnJpZGVzKSxcbiAgICAgIGNvcmRvdmFDb21wYXRpYmlsaXR5VmVyc2lvbnM6IHByb2dyYW1Kc29uLmNvcmRvdmFDb21wYXRpYmlsaXR5VmVyc2lvbnMsXG4gICAgICBQVUJMSUNfU0VUVElOR1MsXG4gICAgfTtcblxuICAgIC8vIEV4cG9zZSBwcm9ncmFtIGRldGFpbHMgYXMgYSBzdHJpbmcgcmVhY2hhYmxlIHZpYSB0aGUgZm9sbG93aW5nIFVSTC5cbiAgICBjb25zdCBtYW5pZmVzdFVybFByZWZpeCA9IFwiL19fXCIgKyBhcmNoLnJlcGxhY2UoL153ZWJcXC4vLCBcIlwiKTtcbiAgICBjb25zdCBtYW5pZmVzdFVybCA9IG1hbmlmZXN0VXJsUHJlZml4ICsgZ2V0SXRlbVBhdGhuYW1lKFwiL21hbmlmZXN0Lmpzb25cIik7XG5cbiAgICBzdGF0aWNGaWxlc1ttYW5pZmVzdFVybF0gPSAoKSA9PiB7XG4gICAgICBpZiAoUGFja2FnZS5hdXRvdXBkYXRlKSB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBBVVRPVVBEQVRFX1ZFUlNJT04gPVxuICAgICAgICAgICAgUGFja2FnZS5hdXRvdXBkYXRlLkF1dG91cGRhdGUuYXV0b3VwZGF0ZVZlcnNpb25cbiAgICAgICAgfSA9IHByb2Nlc3MuZW52O1xuXG4gICAgICAgIGlmIChBVVRPVVBEQVRFX1ZFUlNJT04pIHtcbiAgICAgICAgICBuZXdQcm9ncmFtLnZlcnNpb24gPSBBVVRPVVBEQVRFX1ZFUlNJT047XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBuZXdQcm9ncmFtLnZlcnNpb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBuZXdQcm9ncmFtLnZlcnNpb24gPSBuZXdQcm9ncmFtLnZlcnNpb24oKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29udGVudDogSlNPTi5zdHJpbmdpZnkobmV3UHJvZ3JhbSksXG4gICAgICAgIGNhY2hlYWJsZTogZmFsc2UsXG4gICAgICAgIGhhc2g6IG5ld1Byb2dyYW0udmVyc2lvbixcbiAgICAgICAgdHlwZTogXCJqc29uXCJcbiAgICAgIH07XG4gICAgfTtcblxuICAgIGdlbmVyYXRlQm9pbGVycGxhdGVGb3JBcmNoKGFyY2gpO1xuXG4gICAgLy8gSWYgdGhlcmUgYXJlIGFueSByZXF1ZXN0cyB3YWl0aW5nIG9uIG9sZFByb2dyYW0ucGF1c2VkLCBsZXQgdGhlbVxuICAgIC8vIGNvbnRpbnVlIG5vdyAodXNpbmcgdGhlIG5ldyBwcm9ncmFtKS5cbiAgICBpZiAob2xkUHJvZ3JhbSAmJlxuICAgICAgICBvbGRQcm9ncmFtLnBhdXNlZCkge1xuICAgICAgb2xkUHJvZ3JhbS51bnBhdXNlKCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGRlZmF1bHRPcHRpb25zRm9yQXJjaCA9IHtcbiAgICAnd2ViLmNvcmRvdmEnOiB7XG4gICAgICBydW50aW1lQ29uZmlnT3ZlcnJpZGVzOiB7XG4gICAgICAgIC8vIFhYWCBXZSB1c2UgYWJzb2x1dGVVcmwoKSBoZXJlIHNvIHRoYXQgd2Ugc2VydmUgaHR0cHM6Ly9cbiAgICAgICAgLy8gVVJMcyB0byBjb3Jkb3ZhIGNsaWVudHMgaWYgZm9yY2Utc3NsIGlzIGluIHVzZS4gSWYgd2Ugd2VyZVxuICAgICAgICAvLyB0byB1c2UgX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTCBpbnN0ZWFkIG9mXG4gICAgICAgIC8vIGFic29sdXRlVXJsKCksIHRoZW4gQ29yZG92YSBjbGllbnRzIHdvdWxkIGltbWVkaWF0ZWx5IGdldCBhXG4gICAgICAgIC8vIEhDUCBzZXR0aW5nIHRoZWlyIEREUF9ERUZBVUxUX0NPTk5FQ1RJT05fVVJMIHRvXG4gICAgICAgIC8vIGh0dHA6Ly9leGFtcGxlLm1ldGVvci5jb20uIFRoaXMgYnJlYWtzIHRoZSBhcHAsIGJlY2F1c2VcbiAgICAgICAgLy8gZm9yY2Utc3NsIGRvZXNuJ3Qgc2VydmUgQ09SUyBoZWFkZXJzIG9uIDMwMlxuICAgICAgICAvLyByZWRpcmVjdHMuIChQbHVzIGl0J3MgdW5kZXNpcmFibGUgdG8gaGF2ZSBjbGllbnRzXG4gICAgICAgIC8vIGNvbm5lY3RpbmcgdG8gaHR0cDovL2V4YW1wbGUubWV0ZW9yLmNvbSB3aGVuIGZvcmNlLXNzbCBpc1xuICAgICAgICAvLyBpbiB1c2UuKVxuICAgICAgICBERFBfREVGQVVMVF9DT05ORUNUSU9OX1VSTDogcHJvY2Vzcy5lbnYuTU9CSUxFX0REUF9VUkwgfHxcbiAgICAgICAgICBNZXRlb3IuYWJzb2x1dGVVcmwoKSxcbiAgICAgICAgUk9PVF9VUkw6IHByb2Nlc3MuZW52Lk1PQklMRV9ST09UX1VSTCB8fFxuICAgICAgICAgIE1ldGVvci5hYnNvbHV0ZVVybCgpXG4gICAgICB9XG4gICAgfSxcblxuICAgIFwid2ViLmJyb3dzZXJcIjoge1xuICAgICAgcnVudGltZUNvbmZpZ092ZXJyaWRlczoge1xuICAgICAgICBpc01vZGVybjogdHJ1ZSxcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJ3ZWIuYnJvd3Nlci5sZWdhY3lcIjoge1xuICAgICAgcnVudGltZUNvbmZpZ092ZXJyaWRlczoge1xuICAgICAgICBpc01vZGVybjogZmFsc2UsXG4gICAgICB9XG4gICAgfSxcbiAgfTtcblxuICBXZWJBcHBJbnRlcm5hbHMuZ2VuZXJhdGVCb2lsZXJwbGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUaGlzIGJvaWxlcnBsYXRlIHdpbGwgYmUgc2VydmVkIHRvIHRoZSBtb2JpbGUgZGV2aWNlcyB3aGVuIHVzZWQgd2l0aFxuICAgIC8vIE1ldGVvci9Db3Jkb3ZhIGZvciB0aGUgSG90LUNvZGUgUHVzaCBhbmQgc2luY2UgdGhlIGZpbGUgd2lsbCBiZSBzZXJ2ZWQgYnlcbiAgICAvLyB0aGUgZGV2aWNlJ3Mgc2VydmVyLCBpdCBpcyBpbXBvcnRhbnQgdG8gc2V0IHRoZSBERFAgdXJsIHRvIHRoZSBhY3R1YWxcbiAgICAvLyBNZXRlb3Igc2VydmVyIGFjY2VwdGluZyBERFAgY29ubmVjdGlvbnMgYW5kIG5vdCB0aGUgZGV2aWNlJ3MgZmlsZSBzZXJ2ZXIuXG4gICAgc3luY1F1ZXVlLnJ1blRhc2soZnVuY3Rpb24oKSB7XG4gICAgICBPYmplY3Qua2V5cyhXZWJBcHAuY2xpZW50UHJvZ3JhbXMpXG4gICAgICAgIC5mb3JFYWNoKGdlbmVyYXRlQm9pbGVycGxhdGVGb3JBcmNoKTtcbiAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBnZW5lcmF0ZUJvaWxlcnBsYXRlRm9yQXJjaChhcmNoKSB7XG4gICAgY29uc3QgcHJvZ3JhbSA9IFdlYkFwcC5jbGllbnRQcm9ncmFtc1thcmNoXTtcbiAgICBjb25zdCBhZGRpdGlvbmFsT3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zRm9yQXJjaFthcmNoXSB8fCB7fTtcbiAgICBjb25zdCB7IGJhc2VEYXRhIH0gPSBib2lsZXJwbGF0ZUJ5QXJjaFthcmNoXSA9XG4gICAgICBXZWJBcHBJbnRlcm5hbHMuZ2VuZXJhdGVCb2lsZXJwbGF0ZUluc3RhbmNlKFxuICAgICAgICBhcmNoLFxuICAgICAgICBwcm9ncmFtLm1hbmlmZXN0LFxuICAgICAgICBhZGRpdGlvbmFsT3B0aW9ucyxcbiAgICAgICk7XG4gICAgLy8gV2UgbmVlZCB0aGUgcnVudGltZSBjb25maWcgd2l0aCBvdmVycmlkZXMgZm9yIG1ldGVvcl9ydW50aW1lX2NvbmZpZy5qczpcbiAgICBwcm9ncmFtLm1ldGVvclJ1bnRpbWVDb25maWcgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAuLi5fX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLFxuICAgICAgLi4uKGFkZGl0aW9uYWxPcHRpb25zLnJ1bnRpbWVDb25maWdPdmVycmlkZXMgfHwgbnVsbCksXG4gICAgfSk7XG4gICAgcHJvZ3JhbS5yZWZyZXNoYWJsZUFzc2V0cyA9IGJhc2VEYXRhLmNzcy5tYXAoZmlsZSA9PiAoe1xuICAgICAgdXJsOiBidW5kbGVkSnNDc3NVcmxSZXdyaXRlSG9vayhmaWxlLnVybCksXG4gICAgfSkpO1xuICB9XG5cbiAgV2ViQXBwSW50ZXJuYWxzLnJlbG9hZENsaWVudFByb2dyYW1zKCk7XG5cbiAgLy8gd2Vic2VydmVyXG4gIHZhciBhcHAgPSBjb25uZWN0KCk7XG5cbiAgLy8gUGFja2FnZXMgYW5kIGFwcHMgY2FuIGFkZCBoYW5kbGVycyB0aGF0IHJ1biBiZWZvcmUgYW55IG90aGVyIE1ldGVvclxuICAvLyBoYW5kbGVycyB2aWEgV2ViQXBwLnJhd0Nvbm5lY3RIYW5kbGVycy5cbiAgdmFyIHJhd0Nvbm5lY3RIYW5kbGVycyA9IGNvbm5lY3QoKTtcbiAgYXBwLnVzZShyYXdDb25uZWN0SGFuZGxlcnMpO1xuXG4gIC8vIEF1dG8tY29tcHJlc3MgYW55IGpzb24sIGphdmFzY3JpcHQsIG9yIHRleHQuXG4gIGFwcC51c2UoY29tcHJlc3Moe2ZpbHRlcjogc2hvdWxkQ29tcHJlc3N9KSk7XG5cbiAgLy8gcGFyc2UgY29va2llcyBpbnRvIGFuIG9iamVjdFxuICBhcHAudXNlKGNvb2tpZVBhcnNlcigpKTtcblxuICAvLyBXZSdyZSBub3QgYSBwcm94eTsgcmVqZWN0ICh3aXRob3V0IGNyYXNoaW5nKSBhdHRlbXB0cyB0byB0cmVhdCB1cyBsaWtlXG4gIC8vIG9uZS4gKFNlZSAjMTIxMi4pXG4gIGFwcC51c2UoZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICBpZiAoUm91dGVQb2xpY3kuaXNWYWxpZFVybChyZXEudXJsKSkge1xuICAgICAgbmV4dCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXMud3JpdGVIZWFkKDQwMCk7XG4gICAgcmVzLndyaXRlKFwiTm90IGEgcHJveHlcIik7XG4gICAgcmVzLmVuZCgpO1xuICB9KTtcblxuICAvLyBQYXJzZSB0aGUgcXVlcnkgc3RyaW5nIGludG8gcmVzLnF1ZXJ5LiBVc2VkIGJ5IG9hdXRoX3NlcnZlciwgYnV0IGl0J3NcbiAgLy8gZ2VuZXJhbGx5IHByZXR0eSBoYW5keS4uXG4gIC8vXG4gIC8vIERvIHRoaXMgYmVmb3JlIHRoZSBuZXh0IG1pZGRsZXdhcmUgZGVzdHJveXMgcmVxLnVybCBpZiBhIHBhdGggcHJlZml4XG4gIC8vIGlzIHNldCB0byBjbG9zZSAjMTAxMTEuXG4gIGFwcC51c2UoZnVuY3Rpb24gKHJlcXVlc3QsIHJlc3BvbnNlLCBuZXh0KSB7XG4gICAgcmVxdWVzdC5xdWVyeSA9IHFzLnBhcnNlKHBhcnNlVXJsKHJlcXVlc3QudXJsKS5xdWVyeSk7XG4gICAgbmV4dCgpO1xuICB9KTtcblxuICBmdW5jdGlvbiBnZXRQYXRoUGFydHMocGF0aCkge1xuICAgIGNvbnN0IHBhcnRzID0gcGF0aC5zcGxpdChcIi9cIik7XG4gICAgd2hpbGUgKHBhcnRzWzBdID09PSBcIlwiKSBwYXJ0cy5zaGlmdCgpO1xuICAgIHJldHVybiBwYXJ0cztcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUHJlZml4T2YocHJlZml4LCBhcnJheSkge1xuICAgIHJldHVybiBwcmVmaXgubGVuZ3RoIDw9IGFycmF5Lmxlbmd0aCAmJlxuICAgICAgcHJlZml4LmV2ZXJ5KChwYXJ0LCBpKSA9PiBwYXJ0ID09PSBhcnJheVtpXSk7XG4gIH1cblxuICAvLyBTdHJpcCBvZmYgdGhlIHBhdGggcHJlZml4LCBpZiBpdCBleGlzdHMuXG4gIGFwcC51c2UoZnVuY3Rpb24gKHJlcXVlc3QsIHJlc3BvbnNlLCBuZXh0KSB7XG4gICAgY29uc3QgcGF0aFByZWZpeCA9IF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVg7XG4gICAgY29uc3QgeyBwYXRobmFtZSwgc2VhcmNoIH0gPSBwYXJzZVVybChyZXF1ZXN0LnVybCk7XG5cbiAgICAvLyBjaGVjayBpZiB0aGUgcGF0aCBpbiB0aGUgdXJsIHN0YXJ0cyB3aXRoIHRoZSBwYXRoIHByZWZpeFxuICAgIGlmIChwYXRoUHJlZml4KSB7XG4gICAgICBjb25zdCBwcmVmaXhQYXJ0cyA9IGdldFBhdGhQYXJ0cyhwYXRoUHJlZml4KTtcbiAgICAgIGNvbnN0IHBhdGhQYXJ0cyA9IGdldFBhdGhQYXJ0cyhwYXRobmFtZSk7XG4gICAgICBpZiAoaXNQcmVmaXhPZihwcmVmaXhQYXJ0cywgcGF0aFBhcnRzKSkge1xuICAgICAgICByZXF1ZXN0LnVybCA9IFwiL1wiICsgcGF0aFBhcnRzLnNsaWNlKHByZWZpeFBhcnRzLmxlbmd0aCkuam9pbihcIi9cIik7XG4gICAgICAgIGlmIChzZWFyY2gpIHtcbiAgICAgICAgICByZXF1ZXN0LnVybCArPSBzZWFyY2g7IFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhdGhuYW1lID09PSBcIi9mYXZpY29uLmljb1wiIHx8XG4gICAgICAgIHBhdGhuYW1lID09PSBcIi9yb2JvdHMudHh0XCIpIHtcbiAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgfVxuXG4gICAgaWYgKHBhdGhQcmVmaXgpIHtcbiAgICAgIHJlc3BvbnNlLndyaXRlSGVhZCg0MDQpO1xuICAgICAgcmVzcG9uc2Uud3JpdGUoXCJVbmtub3duIHBhdGhcIik7XG4gICAgICByZXNwb25zZS5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBuZXh0KCk7XG4gIH0pO1xuXG4gIC8vIFNlcnZlIHN0YXRpYyBmaWxlcyBmcm9tIHRoZSBtYW5pZmVzdC5cbiAgLy8gVGhpcyBpcyBpbnNwaXJlZCBieSB0aGUgJ3N0YXRpYycgbWlkZGxld2FyZS5cbiAgYXBwLnVzZShmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgICBXZWJBcHBJbnRlcm5hbHMuc3RhdGljRmlsZXNNaWRkbGV3YXJlKFxuICAgICAgV2ViQXBwSW50ZXJuYWxzLnN0YXRpY0ZpbGVzQnlBcmNoLFxuICAgICAgcmVxLCByZXMsIG5leHRcbiAgICApO1xuICB9KTtcblxuICAvLyBDb3JlIE1ldGVvciBwYWNrYWdlcyBsaWtlIGR5bmFtaWMtaW1wb3J0IGNhbiBhZGQgaGFuZGxlcnMgYmVmb3JlXG4gIC8vIG90aGVyIGhhbmRsZXJzIGFkZGVkIGJ5IHBhY2thZ2UgYW5kIGFwcGxpY2F0aW9uIGNvZGUuXG4gIGFwcC51c2UoV2ViQXBwSW50ZXJuYWxzLm1ldGVvckludGVybmFsSGFuZGxlcnMgPSBjb25uZWN0KCkpO1xuXG4gIC8vIFBhY2thZ2VzIGFuZCBhcHBzIGNhbiBhZGQgaGFuZGxlcnMgdG8gdGhpcyB2aWEgV2ViQXBwLmNvbm5lY3RIYW5kbGVycy5cbiAgLy8gVGhleSBhcmUgaW5zZXJ0ZWQgYmVmb3JlIG91ciBkZWZhdWx0IGhhbmRsZXIuXG4gIHZhciBwYWNrYWdlQW5kQXBwSGFuZGxlcnMgPSBjb25uZWN0KCk7XG4gIGFwcC51c2UocGFja2FnZUFuZEFwcEhhbmRsZXJzKTtcblxuICB2YXIgc3VwcHJlc3NDb25uZWN0RXJyb3JzID0gZmFsc2U7XG4gIC8vIGNvbm5lY3Qga25vd3MgaXQgaXMgYW4gZXJyb3IgaGFuZGxlciBiZWNhdXNlIGl0IGhhcyA0IGFyZ3VtZW50cyBpbnN0ZWFkIG9mXG4gIC8vIDMuIGdvIGZpZ3VyZS4gIChJdCBpcyBub3Qgc21hcnQgZW5vdWdoIHRvIGZpbmQgc3VjaCBhIHRoaW5nIGlmIGl0J3MgaGlkZGVuXG4gIC8vIGluc2lkZSBwYWNrYWdlQW5kQXBwSGFuZGxlcnMuKVxuICBhcHAudXNlKGZ1bmN0aW9uIChlcnIsIHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgaWYgKCFlcnIgfHwgIXN1cHByZXNzQ29ubmVjdEVycm9ycyB8fCAhcmVxLmhlYWRlcnNbJ3gtc3VwcHJlc3MtZXJyb3InXSkge1xuICAgICAgbmV4dChlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXMud3JpdGVIZWFkKGVyci5zdGF0dXMsIHsgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3BsYWluJyB9KTtcbiAgICByZXMuZW5kKFwiQW4gZXJyb3IgbWVzc2FnZVwiKTtcbiAgfSk7XG5cbiAgYXBwLnVzZShhc3luYyBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgICBpZiAoISBhcHBVcmwocmVxLnVybCkpIHtcbiAgICAgIHJldHVybiBuZXh0KCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGhlYWRlcnMgPSB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04J1xuICAgICAgfTtcblxuICAgICAgaWYgKHNodXR0aW5nRG93bikge1xuICAgICAgICBoZWFkZXJzWydDb25uZWN0aW9uJ10gPSAnQ2xvc2UnO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVxdWVzdCA9IFdlYkFwcC5jYXRlZ29yaXplUmVxdWVzdChyZXEpO1xuXG4gICAgICBpZiAocmVxdWVzdC51cmwucXVlcnkgJiYgcmVxdWVzdC51cmwucXVlcnlbJ21ldGVvcl9jc3NfcmVzb3VyY2UnXSkge1xuICAgICAgICAvLyBJbiB0aGlzIGNhc2UsIHdlJ3JlIHJlcXVlc3RpbmcgYSBDU1MgcmVzb3VyY2UgaW4gdGhlIG1ldGVvci1zcGVjaWZpY1xuICAgICAgICAvLyB3YXksIGJ1dCB3ZSBkb24ndCBoYXZlIGl0LiAgU2VydmUgYSBzdGF0aWMgY3NzIGZpbGUgdGhhdCBpbmRpY2F0ZXMgdGhhdFxuICAgICAgICAvLyB3ZSBkaWRuJ3QgaGF2ZSBpdCwgc28gd2UgY2FuIGRldGVjdCB0aGF0IGFuZCByZWZyZXNoLiAgTWFrZSBzdXJlXG4gICAgICAgIC8vIHRoYXQgYW55IHByb3hpZXMgb3IgQ0ROcyBkb24ndCBjYWNoZSB0aGlzIGVycm9yISAgKE5vcm1hbGx5IHByb3hpZXNcbiAgICAgICAgLy8gb3IgQ0ROcyBhcmUgc21hcnQgZW5vdWdoIG5vdCB0byBjYWNoZSBlcnJvciBwYWdlcywgYnV0IGluIG9yZGVyIHRvXG4gICAgICAgIC8vIG1ha2UgdGhpcyBoYWNrIHdvcmssIHdlIG5lZWQgdG8gcmV0dXJuIHRoZSBDU1MgZmlsZSBhcyBhIDIwMCwgd2hpY2hcbiAgICAgICAgLy8gd291bGQgb3RoZXJ3aXNlIGJlIGNhY2hlZC4pXG4gICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ3RleHQvY3NzOyBjaGFyc2V0PXV0Zi04JztcbiAgICAgICAgaGVhZGVyc1snQ2FjaGUtQ29udHJvbCddID0gJ25vLWNhY2hlJztcbiAgICAgICAgcmVzLndyaXRlSGVhZCgyMDAsIGhlYWRlcnMpO1xuICAgICAgICByZXMud3JpdGUoXCIubWV0ZW9yLWNzcy1ub3QtZm91bmQtZXJyb3IgeyB3aWR0aDogMHB4O31cIik7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVxdWVzdC51cmwucXVlcnkgJiYgcmVxdWVzdC51cmwucXVlcnlbJ21ldGVvcl9qc19yZXNvdXJjZSddKSB7XG4gICAgICAgIC8vIFNpbWlsYXJseSwgd2UncmUgcmVxdWVzdGluZyBhIEpTIHJlc291cmNlIHRoYXQgd2UgZG9uJ3QgaGF2ZS5cbiAgICAgICAgLy8gU2VydmUgYW4gdW5jYWNoZWQgNDA0LiAoV2UgY2FuJ3QgdXNlIHRoZSBzYW1lIGhhY2sgd2UgdXNlIGZvciBDU1MsXG4gICAgICAgIC8vIGJlY2F1c2UgYWN0dWFsbHkgYWN0aW5nIG9uIHRoYXQgaGFjayByZXF1aXJlcyB1cyB0byBoYXZlIHRoZSBKU1xuICAgICAgICAvLyBhbHJlYWR5ISlcbiAgICAgICAgaGVhZGVyc1snQ2FjaGUtQ29udHJvbCddID0gJ25vLWNhY2hlJztcbiAgICAgICAgcmVzLndyaXRlSGVhZCg0MDQsIGhlYWRlcnMpO1xuICAgICAgICByZXMuZW5kKFwiNDA0IE5vdCBGb3VuZFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVxdWVzdC51cmwucXVlcnkgJiYgcmVxdWVzdC51cmwucXVlcnlbJ21ldGVvcl9kb250X3NlcnZlX2luZGV4J10pIHtcbiAgICAgICAgLy8gV2hlbiBkb3dubG9hZGluZyBmaWxlcyBkdXJpbmcgYSBDb3Jkb3ZhIGhvdCBjb2RlIHB1c2gsIHdlIG5lZWRcbiAgICAgICAgLy8gdG8gZGV0ZWN0IGlmIGEgZmlsZSBpcyBub3QgYXZhaWxhYmxlIGluc3RlYWQgb2YgaW5hZHZlcnRlbnRseVxuICAgICAgICAvLyBkb3dubG9hZGluZyB0aGUgZGVmYXVsdCBpbmRleCBwYWdlLlxuICAgICAgICAvLyBTbyBzaW1pbGFyIHRvIHRoZSBzaXR1YXRpb24gYWJvdmUsIHdlIHNlcnZlIGFuIHVuY2FjaGVkIDQwNC5cbiAgICAgICAgaGVhZGVyc1snQ2FjaGUtQ29udHJvbCddID0gJ25vLWNhY2hlJztcbiAgICAgICAgcmVzLndyaXRlSGVhZCg0MDQsIGhlYWRlcnMpO1xuICAgICAgICByZXMuZW5kKFwiNDA0IE5vdCBGb3VuZFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGFyY2ggfSA9IGdldEFyY2hBbmRQYXRoKFxuICAgICAgICBwYXJzZVJlcXVlc3QocmVxKS5wYXRobmFtZSxcbiAgICAgICAgcmVxdWVzdC5icm93c2VyLFxuICAgICAgKTtcblxuICAgICAgaWYgKCEgaGFzT3duLmNhbGwoV2ViQXBwLmNsaWVudFByb2dyYW1zLCBhcmNoKSkge1xuICAgICAgICAvLyBXZSBjb3VsZCBjb21lIGhlcmUgaW4gY2FzZSB3ZSBydW4gd2l0aCBzb21lIGFyY2hpdGVjdHVyZXMgZXhjbHVkZWRcbiAgICAgICAgaGVhZGVyc1snQ2FjaGUtQ29udHJvbCddID0gJ25vLWNhY2hlJztcbiAgICAgICAgcmVzLndyaXRlSGVhZCg0MDQsIGhlYWRlcnMpO1xuICAgICAgICBpZiAoTWV0ZW9yLmlzRGV2ZWxvcG1lbnQpIHtcbiAgICAgICAgICByZXMuZW5kKGBObyBjbGllbnQgcHJvZ3JhbSBmb3VuZCBmb3IgdGhlICR7YXJjaH0gYXJjaGl0ZWN0dXJlLmApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFNhZmV0eSBuZXQsIGJ1dCB0aGlzIGJyYW5jaCBzaG91bGQgbm90IGJlIHBvc3NpYmxlLlxuICAgICAgICAgIHJlcy5lbmQoXCI0MDQgTm90IEZvdW5kXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgcGF1c2VDbGllbnQoYXJjaCkgaGFzIGJlZW4gY2FsbGVkLCBwcm9ncmFtLnBhdXNlZCB3aWxsIGJlIGFcbiAgICAgIC8vIFByb21pc2UgdGhhdCB3aWxsIGJlIHJlc29sdmVkIHdoZW4gdGhlIHByb2dyYW0gaXMgdW5wYXVzZWQuXG4gICAgICBhd2FpdCBXZWJBcHAuY2xpZW50UHJvZ3JhbXNbYXJjaF0ucGF1c2VkO1xuXG4gICAgICByZXR1cm4gZ2V0Qm9pbGVycGxhdGVBc3luYyhyZXF1ZXN0LCBhcmNoKS50aGVuKCh7XG4gICAgICAgIHN0cmVhbSxcbiAgICAgICAgc3RhdHVzQ29kZSxcbiAgICAgICAgaGVhZGVyczogbmV3SGVhZGVycyxcbiAgICAgIH0pID0+IHtcbiAgICAgICAgaWYgKCFzdGF0dXNDb2RlKSB7XG4gICAgICAgICAgc3RhdHVzQ29kZSA9IHJlcy5zdGF0dXNDb2RlID8gcmVzLnN0YXR1c0NvZGUgOiAyMDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3SGVhZGVycykge1xuICAgICAgICAgIE9iamVjdC5hc3NpZ24oaGVhZGVycywgbmV3SGVhZGVycyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXMud3JpdGVIZWFkKHN0YXR1c0NvZGUsIGhlYWRlcnMpO1xuXG4gICAgICAgIHN0cmVhbS5waXBlKHJlcywge1xuICAgICAgICAgIC8vIEVuZCB0aGUgcmVzcG9uc2Ugd2hlbiB0aGUgc3RyZWFtIGVuZHMuXG4gICAgICAgICAgZW5kOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBMb2cuZXJyb3IoXCJFcnJvciBydW5uaW5nIHRlbXBsYXRlOiBcIiArIGVycm9yLnN0YWNrKTtcbiAgICAgICAgcmVzLndyaXRlSGVhZCg1MDAsIGhlYWRlcnMpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFJldHVybiA0MDQgYnkgZGVmYXVsdCwgaWYgbm8gb3RoZXIgaGFuZGxlcnMgc2VydmUgdGhpcyBVUkwuXG4gIGFwcC51c2UoZnVuY3Rpb24gKHJlcSwgcmVzKSB7XG4gICAgcmVzLndyaXRlSGVhZCg0MDQpO1xuICAgIHJlcy5lbmQoKTtcbiAgfSk7XG5cblxuICB2YXIgaHR0cFNlcnZlciA9IGNyZWF0ZVNlcnZlcihhcHApO1xuICB2YXIgb25MaXN0ZW5pbmdDYWxsYmFja3MgPSBbXTtcblxuICAvLyBBZnRlciA1IHNlY29uZHMgdy9vIGRhdGEgb24gYSBzb2NrZXQsIGtpbGwgaXQuICBPbiB0aGUgb3RoZXIgaGFuZCwgaWZcbiAgLy8gdGhlcmUncyBhbiBvdXRzdGFuZGluZyByZXF1ZXN0LCBnaXZlIGl0IGEgaGlnaGVyIHRpbWVvdXQgaW5zdGVhZCAodG8gYXZvaWRcbiAgLy8ga2lsbGluZyBsb25nLXBvbGxpbmcgcmVxdWVzdHMpXG4gIGh0dHBTZXJ2ZXIuc2V0VGltZW91dChTSE9SVF9TT0NLRVRfVElNRU9VVCk7XG5cbiAgLy8gRG8gdGhpcyBoZXJlLCBhbmQgdGhlbiBhbHNvIGluIGxpdmVkYXRhL3N0cmVhbV9zZXJ2ZXIuanMsIGJlY2F1c2VcbiAgLy8gc3RyZWFtX3NlcnZlci5qcyBraWxscyBhbGwgdGhlIGN1cnJlbnQgcmVxdWVzdCBoYW5kbGVycyB3aGVuIGluc3RhbGxpbmcgaXRzXG4gIC8vIG93bi5cbiAgaHR0cFNlcnZlci5vbigncmVxdWVzdCcsIFdlYkFwcC5fdGltZW91dEFkanVzdG1lbnRSZXF1ZXN0Q2FsbGJhY2spO1xuXG4gIC8vIElmIHRoZSBjbGllbnQgZ2F2ZSB1cyBhIGJhZCByZXF1ZXN0LCB0ZWxsIGl0IGluc3RlYWQgb2YganVzdCBjbG9zaW5nIHRoZVxuICAvLyBzb2NrZXQuIFRoaXMgbGV0cyBsb2FkIGJhbGFuY2VycyBpbiBmcm9udCBvZiB1cyBkaWZmZXJlbnRpYXRlIGJldHdlZW4gXCJhXG4gIC8vIHNlcnZlciBpcyByYW5kb21seSBjbG9zaW5nIHNvY2tldHMgZm9yIG5vIHJlYXNvblwiIGFuZCBcImNsaWVudCBzZW50IGEgYmFkXG4gIC8vIHJlcXVlc3RcIi5cbiAgLy9cbiAgLy8gVGhpcyB3aWxsIG9ubHkgd29yayBvbiBOb2RlIDY7IE5vZGUgNCBkZXN0cm95cyB0aGUgc29ja2V0IGJlZm9yZSBjYWxsaW5nXG4gIC8vIHRoaXMgZXZlbnQuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvcHVsbC80NTU3LyBmb3IgZGV0YWlscy5cbiAgaHR0cFNlcnZlci5vbignY2xpZW50RXJyb3InLCAoZXJyLCBzb2NrZXQpID0+IHtcbiAgICAvLyBQcmUtTm9kZS02LCBkbyBub3RoaW5nLlxuICAgIGlmIChzb2NrZXQuZGVzdHJveWVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVyci5tZXNzYWdlID09PSAnUGFyc2UgRXJyb3InKSB7XG4gICAgICBzb2NrZXQuZW5kKCdIVFRQLzEuMSA0MDAgQmFkIFJlcXVlc3RcXHJcXG5cXHJcXG4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRm9yIG90aGVyIGVycm9ycywgdXNlIHRoZSBkZWZhdWx0IGJlaGF2aW9yIGFzIGlmIHdlIGhhZCBubyBjbGllbnRFcnJvclxuICAgICAgLy8gaGFuZGxlci5cbiAgICAgIHNvY2tldC5kZXN0cm95KGVycik7XG4gICAgfVxuICB9KTtcblxuICAvLyBzdGFydCB1cCBhcHBcbiAgXy5leHRlbmQoV2ViQXBwLCB7XG4gICAgY29ubmVjdEhhbmRsZXJzOiBwYWNrYWdlQW5kQXBwSGFuZGxlcnMsXG4gICAgcmF3Q29ubmVjdEhhbmRsZXJzOiByYXdDb25uZWN0SGFuZGxlcnMsXG4gICAgaHR0cFNlcnZlcjogaHR0cFNlcnZlcixcbiAgICBjb25uZWN0QXBwOiBhcHAsXG4gICAgLy8gRm9yIHRlc3RpbmcuXG4gICAgc3VwcHJlc3NDb25uZWN0RXJyb3JzOiBmdW5jdGlvbiAoKSB7XG4gICAgICBzdXBwcmVzc0Nvbm5lY3RFcnJvcnMgPSB0cnVlO1xuICAgIH0sXG4gICAgb25MaXN0ZW5pbmc6IGZ1bmN0aW9uIChmKSB7XG4gICAgICBpZiAob25MaXN0ZW5pbmdDYWxsYmFja3MpXG4gICAgICAgIG9uTGlzdGVuaW5nQ2FsbGJhY2tzLnB1c2goZik7XG4gICAgICBlbHNlXG4gICAgICAgIGYoKTtcbiAgICB9LFxuICAgIC8vIFRoaXMgY2FuIGJlIG92ZXJyaWRkZW4gYnkgdXNlcnMgd2hvIHdhbnQgdG8gbW9kaWZ5IGhvdyBsaXN0ZW5pbmcgd29ya3NcbiAgICAvLyAoZWcsIHRvIHJ1biBhIHByb3h5IGxpa2UgQXBvbGxvIEVuZ2luZSBQcm94eSBpbiBmcm9udCBvZiB0aGUgc2VydmVyKS5cbiAgICBzdGFydExpc3RlbmluZzogZnVuY3Rpb24gKGh0dHBTZXJ2ZXIsIGxpc3Rlbk9wdGlvbnMsIGNiKSB7XG4gICAgICBodHRwU2VydmVyLmxpc3RlbihsaXN0ZW5PcHRpb25zLCBjYik7XG4gICAgfSxcbiAgfSk7XG5cbiAgLy8gTGV0IHRoZSByZXN0IG9mIHRoZSBwYWNrYWdlcyAoYW5kIE1ldGVvci5zdGFydHVwIGhvb2tzKSBpbnNlcnQgY29ubmVjdFxuICAvLyBtaWRkbGV3YXJlcyBhbmQgdXBkYXRlIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18sIHRoZW4ga2VlcCBnb2luZyB0byBzZXQgdXBcbiAgLy8gYWN0dWFsbHkgc2VydmluZyBIVE1MLlxuICBleHBvcnRzLm1haW4gPSBhcmd2ID0+IHtcbiAgICBXZWJBcHBJbnRlcm5hbHMuZ2VuZXJhdGVCb2lsZXJwbGF0ZSgpO1xuXG4gICAgY29uc3Qgc3RhcnRIdHRwU2VydmVyID0gbGlzdGVuT3B0aW9ucyA9PiB7XG4gICAgICBXZWJBcHAuc3RhcnRMaXN0ZW5pbmcoaHR0cFNlcnZlciwgbGlzdGVuT3B0aW9ucywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoKSA9PiB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5NRVRFT1JfUFJJTlRfT05fTElTVEVOKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJMSVNURU5JTkdcIik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0gb25MaXN0ZW5pbmdDYWxsYmFja3M7XG4gICAgICAgIG9uTGlzdGVuaW5nQ2FsbGJhY2tzID0gbnVsbDtcbiAgICAgICAgY2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4geyBjYWxsYmFjaygpOyB9KTtcbiAgICAgIH0sIGUgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgbGlzdGVuaW5nOlwiLCBlKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlICYmIGUuc3RhY2spO1xuICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBsZXQgbG9jYWxQb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCAwO1xuICAgIGNvbnN0IHVuaXhTb2NrZXRQYXRoID0gcHJvY2Vzcy5lbnYuVU5JWF9TT0NLRVRfUEFUSDtcblxuICAgIGlmICh1bml4U29ja2V0UGF0aCkge1xuICAgICAgLy8gU3RhcnQgdGhlIEhUVFAgc2VydmVyIHVzaW5nIGEgc29ja2V0IGZpbGUuXG4gICAgICByZW1vdmVFeGlzdGluZ1NvY2tldEZpbGUodW5peFNvY2tldFBhdGgpO1xuICAgICAgc3RhcnRIdHRwU2VydmVyKHsgcGF0aDogdW5peFNvY2tldFBhdGggfSk7XG4gICAgICByZWdpc3RlclNvY2tldEZpbGVDbGVhbnVwKHVuaXhTb2NrZXRQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9jYWxQb3J0ID0gaXNOYU4oTnVtYmVyKGxvY2FsUG9ydCkpID8gbG9jYWxQb3J0IDogTnVtYmVyKGxvY2FsUG9ydCk7XG4gICAgICBpZiAoL1xcXFxcXFxcPy4rXFxcXHBpcGVcXFxcPy4rLy50ZXN0KGxvY2FsUG9ydCkpIHtcbiAgICAgICAgLy8gU3RhcnQgdGhlIEhUVFAgc2VydmVyIHVzaW5nIFdpbmRvd3MgU2VydmVyIHN0eWxlIG5hbWVkIHBpcGUuXG4gICAgICAgIHN0YXJ0SHR0cFNlcnZlcih7IHBhdGg6IGxvY2FsUG9ydCB9KTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGxvY2FsUG9ydCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAvLyBTdGFydCB0aGUgSFRUUCBzZXJ2ZXIgdXNpbmcgVENQLlxuICAgICAgICBzdGFydEh0dHBTZXJ2ZXIoe1xuICAgICAgICAgIHBvcnQ6IGxvY2FsUG9ydCxcbiAgICAgICAgICBob3N0OiBwcm9jZXNzLmVudi5CSU5EX0lQIHx8IFwiMC4wLjAuMFwiXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBQT1JUIHNwZWNpZmllZFwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gXCJEQUVNT05cIjtcbiAgfTtcbn1cblxudmFyIGlubGluZVNjcmlwdHNBbGxvd2VkID0gdHJ1ZTtcblxuV2ViQXBwSW50ZXJuYWxzLmlubGluZVNjcmlwdHNBbGxvd2VkID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gaW5saW5lU2NyaXB0c0FsbG93ZWQ7XG59O1xuXG5XZWJBcHBJbnRlcm5hbHMuc2V0SW5saW5lU2NyaXB0c0FsbG93ZWQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaW5saW5lU2NyaXB0c0FsbG93ZWQgPSB2YWx1ZTtcbiAgV2ViQXBwSW50ZXJuYWxzLmdlbmVyYXRlQm9pbGVycGxhdGUoKTtcbn07XG5cbnZhciBzcmlNb2RlO1xuXG5XZWJBcHBJbnRlcm5hbHMuZW5hYmxlU3VicmVzb3VyY2VJbnRlZ3JpdHkgPSBmdW5jdGlvbih1c2VfY3JlZGVudGlhbHMgPSBmYWxzZSkge1xuICBzcmlNb2RlID0gdXNlX2NyZWRlbnRpYWxzID8gJ3VzZS1jcmVkZW50aWFscycgOiAnYW5vbnltb3VzJztcbiAgV2ViQXBwSW50ZXJuYWxzLmdlbmVyYXRlQm9pbGVycGxhdGUoKTtcbn07XG5cbldlYkFwcEludGVybmFscy5zZXRCdW5kbGVkSnNDc3NVcmxSZXdyaXRlSG9vayA9IGZ1bmN0aW9uIChob29rRm4pIHtcbiAgYnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2sgPSBob29rRm47XG4gIFdlYkFwcEludGVybmFscy5nZW5lcmF0ZUJvaWxlcnBsYXRlKCk7XG59O1xuXG5XZWJBcHBJbnRlcm5hbHMuc2V0QnVuZGxlZEpzQ3NzUHJlZml4ID0gZnVuY3Rpb24gKHByZWZpeCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYuc2V0QnVuZGxlZEpzQ3NzVXJsUmV3cml0ZUhvb2soXG4gICAgZnVuY3Rpb24gKHVybCkge1xuICAgICAgcmV0dXJuIHByZWZpeCArIHVybDtcbiAgfSk7XG59O1xuXG4vLyBQYWNrYWdlcyBjYW4gY2FsbCBgV2ViQXBwSW50ZXJuYWxzLmFkZFN0YXRpY0pzYCB0byBzcGVjaWZ5IHN0YXRpY1xuLy8gSmF2YVNjcmlwdCB0byBiZSBpbmNsdWRlZCBpbiB0aGUgYXBwLiBUaGlzIHN0YXRpYyBKUyB3aWxsIGJlIGlubGluZWQsXG4vLyB1bmxlc3MgaW5saW5lIHNjcmlwdHMgaGF2ZSBiZWVuIGRpc2FibGVkLCBpbiB3aGljaCBjYXNlIGl0IHdpbGwgYmVcbi8vIHNlcnZlZCB1bmRlciBgLzxzaGExIG9mIGNvbnRlbnRzPmAuXG52YXIgYWRkaXRpb25hbFN0YXRpY0pzID0ge307XG5XZWJBcHBJbnRlcm5hbHMuYWRkU3RhdGljSnMgPSBmdW5jdGlvbiAoY29udGVudHMpIHtcbiAgYWRkaXRpb25hbFN0YXRpY0pzW1wiL1wiICsgc2hhMShjb250ZW50cykgKyBcIi5qc1wiXSA9IGNvbnRlbnRzO1xufTtcblxuLy8gRXhwb3J0ZWQgZm9yIHRlc3RzXG5XZWJBcHBJbnRlcm5hbHMuZ2V0Qm9pbGVycGxhdGUgPSBnZXRCb2lsZXJwbGF0ZTtcbldlYkFwcEludGVybmFscy5hZGRpdGlvbmFsU3RhdGljSnMgPSBhZGRpdGlvbmFsU3RhdGljSnM7XG5cbi8vIFN0YXJ0IHRoZSBzZXJ2ZXIhXG5ydW5XZWJBcHBTZXJ2ZXIoKTtcbiIsImltcG9ydCBucG1Db25uZWN0IGZyb20gXCJjb25uZWN0XCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25uZWN0KC4uLmNvbm5lY3RBcmdzKSB7XG4gIGNvbnN0IGhhbmRsZXJzID0gbnBtQ29ubmVjdC5hcHBseSh0aGlzLCBjb25uZWN0QXJncyk7XG4gIGNvbnN0IG9yaWdpbmFsVXNlID0gaGFuZGxlcnMudXNlO1xuXG4gIC8vIFdyYXAgdGhlIGhhbmRsZXJzLnVzZSBtZXRob2Qgc28gdGhhdCBhbnkgcHJvdmlkZWQgaGFuZGxlciBmdW5jdGlvbnNcbiAgLy8gYWx3YXkgcnVuIGluIGEgRmliZXIuXG4gIGhhbmRsZXJzLnVzZSA9IGZ1bmN0aW9uIHVzZSguLi51c2VBcmdzKSB7XG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGhpcztcbiAgICBjb25zdCBvcmlnaW5hbExlbmd0aCA9IHN0YWNrLmxlbmd0aDtcbiAgICBjb25zdCByZXN1bHQgPSBvcmlnaW5hbFVzZS5hcHBseSh0aGlzLCB1c2VBcmdzKTtcblxuICAgIC8vIElmIHdlIGp1c3QgYWRkZWQgYW55dGhpbmcgdG8gdGhlIHN0YWNrLCB3cmFwIGVhY2ggbmV3IGVudHJ5LmhhbmRsZVxuICAgIC8vIHdpdGggYSBmdW5jdGlvbiB0aGF0IGNhbGxzIFByb21pc2UuYXN5bmNBcHBseSB0byBlbnN1cmUgdGhlXG4gICAgLy8gb3JpZ2luYWwgaGFuZGxlciBydW5zIGluIGEgRmliZXIuXG4gICAgZm9yIChsZXQgaSA9IG9yaWdpbmFsTGVuZ3RoOyBpIDwgc3RhY2subGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IGVudHJ5ID0gc3RhY2tbaV07XG4gICAgICBjb25zdCBvcmlnaW5hbEhhbmRsZSA9IGVudHJ5LmhhbmRsZTtcblxuICAgICAgaWYgKG9yaWdpbmFsSGFuZGxlLmxlbmd0aCA+PSA0KSB7XG4gICAgICAgIC8vIElmIHRoZSBvcmlnaW5hbCBoYW5kbGUgaGFkIGZvdXIgKG9yIG1vcmUpIHBhcmFtZXRlcnMsIHRoZVxuICAgICAgICAvLyB3cmFwcGVyIG11c3QgYWxzbyBoYXZlIGZvdXIgcGFyYW1ldGVycywgc2luY2UgY29ubmVjdCB1c2VzXG4gICAgICAgIC8vIGhhbmRsZS5sZW5ndGggdG8gZGVybWluZSB3aGV0aGVyIHRvIHBhc3MgdGhlIGVycm9yIGFzIHRoZSBmaXJzdFxuICAgICAgICAvLyBhcmd1bWVudCB0byB0aGUgaGFuZGxlIGZ1bmN0aW9uLlxuICAgICAgICBlbnRyeS5oYW5kbGUgPSBmdW5jdGlvbiBoYW5kbGUoZXJyLCByZXEsIHJlcywgbmV4dCkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLmFzeW5jQXBwbHkob3JpZ2luYWxIYW5kbGUsIHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbnRyeS5oYW5kbGUgPSBmdW5jdGlvbiBoYW5kbGUocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hc3luY0FwcGx5KG9yaWdpbmFsSGFuZGxlLCB0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgcmV0dXJuIGhhbmRsZXJzO1xufVxuIiwiaW1wb3J0IHsgc3RhdFN5bmMsIHVubGlua1N5bmMsIGV4aXN0c1N5bmMgfSBmcm9tICdmcyc7XG5cbi8vIFNpbmNlIGEgbmV3IHNvY2tldCBmaWxlIHdpbGwgYmUgY3JlYXRlZCB3aGVuIHRoZSBIVFRQIHNlcnZlclxuLy8gc3RhcnRzIHVwLCBpZiBmb3VuZCByZW1vdmUgdGhlIGV4aXN0aW5nIGZpbGUuXG4vL1xuLy8gV0FSTklORzpcbi8vIFRoaXMgd2lsbCByZW1vdmUgdGhlIGNvbmZpZ3VyZWQgc29ja2V0IGZpbGUgd2l0aG91dCB3YXJuaW5nLiBJZlxuLy8gdGhlIGNvbmZpZ3VyZWQgc29ja2V0IGZpbGUgaXMgYWxyZWFkeSBpbiB1c2UgYnkgYW5vdGhlciBhcHBsaWNhdGlvbixcbi8vIGl0IHdpbGwgc3RpbGwgYmUgcmVtb3ZlZC4gTm9kZSBkb2VzIG5vdCBwcm92aWRlIGEgcmVsaWFibGUgd2F5IHRvXG4vLyBkaWZmZXJlbnRpYXRlIGJldHdlZW4gYSBzb2NrZXQgZmlsZSB0aGF0IGlzIGFscmVhZHkgaW4gdXNlIGJ5XG4vLyBhbm90aGVyIGFwcGxpY2F0aW9uIG9yIGEgc3RhbGUgc29ja2V0IGZpbGUgdGhhdCBoYXMgYmVlblxuLy8gbGVmdCBvdmVyIGFmdGVyIGEgU0lHS0lMTC4gU2luY2Ugd2UgaGF2ZSBubyByZWxpYWJsZSB3YXkgdG9cbi8vIGRpZmZlcmVudGlhdGUgYmV0d2VlbiB0aGVzZSB0d28gc2NlbmFyaW9zLCB0aGUgYmVzdCBjb3Vyc2Ugb2Zcbi8vIGFjdGlvbiBkdXJpbmcgc3RhcnR1cCBpcyB0byByZW1vdmUgYW55IGV4aXN0aW5nIHNvY2tldCBmaWxlLiBUaGlzXG4vLyBpcyBub3QgdGhlIHNhZmVzdCBjb3Vyc2Ugb2YgYWN0aW9uIGFzIHJlbW92aW5nIHRoZSBleGlzdGluZyBzb2NrZXRcbi8vIGZpbGUgY291bGQgaW1wYWN0IGFuIGFwcGxpY2F0aW9uIHVzaW5nIGl0LCBidXQgdGhpcyBhcHByb2FjaCBoZWxwc1xuLy8gZW5zdXJlIHRoZSBIVFRQIHNlcnZlciBjYW4gc3RhcnR1cCB3aXRob3V0IG1hbnVhbFxuLy8gaW50ZXJ2ZW50aW9uIChlLmcuIGFza2luZyBmb3IgdGhlIHZlcmlmaWNhdGlvbiBhbmQgY2xlYW51cCBvZiBzb2NrZXRcbi8vIGZpbGVzIGJlZm9yZSBhbGxvd2luZyB0aGUgSFRUUCBzZXJ2ZXIgdG8gYmUgc3RhcnRlZCkuXG4vL1xuLy8gVGhlIGFib3ZlIGJlaW5nIHNhaWQsIGFzIGxvbmcgYXMgdGhlIHNvY2tldCBmaWxlIHBhdGggaXNcbi8vIGNvbmZpZ3VyZWQgY2FyZWZ1bGx5IHdoZW4gdGhlIGFwcGxpY2F0aW9uIGlzIGRlcGxveWVkIChhbmQgZXh0cmFcbi8vIGNhcmUgaXMgdGFrZW4gdG8gbWFrZSBzdXJlIHRoZSBjb25maWd1cmVkIHBhdGggaXMgdW5pcXVlIGFuZCBkb2Vzbid0XG4vLyBjb25mbGljdCB3aXRoIGFub3RoZXIgc29ja2V0IGZpbGUgcGF0aCksIHRoZW4gdGhlcmUgc2hvdWxkIG5vdCBiZVxuLy8gYW55IGlzc3VlcyB3aXRoIHRoaXMgYXBwcm9hY2guXG5leHBvcnQgY29uc3QgcmVtb3ZlRXhpc3RpbmdTb2NrZXRGaWxlID0gKHNvY2tldFBhdGgpID0+IHtcbiAgdHJ5IHtcbiAgICBpZiAoc3RhdFN5bmMoc29ja2V0UGF0aCkuaXNTb2NrZXQoKSkge1xuICAgICAgLy8gU2luY2UgYSBuZXcgc29ja2V0IGZpbGUgd2lsbCBiZSBjcmVhdGVkLCByZW1vdmUgdGhlIGV4aXN0aW5nXG4gICAgICAvLyBmaWxlLlxuICAgICAgdW5saW5rU3luYyhzb2NrZXRQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgQW4gZXhpc3RpbmcgZmlsZSB3YXMgZm91bmQgYXQgXCIke3NvY2tldFBhdGh9XCIgYW5kIGl0IGlzIG5vdCBgICtcbiAgICAgICAgJ2Egc29ja2V0IGZpbGUuIFBsZWFzZSBjb25maXJtIFBPUlQgaXMgcG9pbnRpbmcgdG8gdmFsaWQgYW5kICcgK1xuICAgICAgICAndW4tdXNlZCBzb2NrZXQgZmlsZSBwYXRoLidcbiAgICAgICk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIElmIHRoZXJlIGlzIG5vIGV4aXN0aW5nIHNvY2tldCBmaWxlIHRvIGNsZWFudXAsIGdyZWF0LCB3ZSdsbFxuICAgIC8vIGNvbnRpbnVlIG5vcm1hbGx5LiBJZiB0aGUgY2F1Z2h0IGV4Y2VwdGlvbiByZXByZXNlbnRzIGFueSBvdGhlclxuICAgIC8vIGlzc3VlLCByZS10aHJvdy5cbiAgICBpZiAoZXJyb3IuY29kZSAhPT0gJ0VOT0VOVCcpIHtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxufTtcblxuLy8gUmVtb3ZlIHRoZSBzb2NrZXQgZmlsZSB3aGVuIGRvbmUgdG8gYXZvaWQgbGVhdmluZyBiZWhpbmQgYSBzdGFsZSBvbmUuXG4vLyBOb3RlIC0gYSBzdGFsZSBzb2NrZXQgZmlsZSBpcyBzdGlsbCBsZWZ0IGJlaGluZCBpZiB0aGUgcnVubmluZyBub2RlXG4vLyBwcm9jZXNzIGlzIGtpbGxlZCB2aWEgc2lnbmFsIDkgLSBTSUdLSUxMLlxuZXhwb3J0IGNvbnN0IHJlZ2lzdGVyU29ja2V0RmlsZUNsZWFudXAgPVxuICAoc29ja2V0UGF0aCwgZXZlbnRFbWl0dGVyID0gcHJvY2VzcykgPT4ge1xuICAgIFsnZXhpdCcsICdTSUdJTlQnLCAnU0lHSFVQJywgJ1NJR1RFUk0nXS5mb3JFYWNoKHNpZ25hbCA9PiB7XG4gICAgICBldmVudEVtaXR0ZXIub24oc2lnbmFsLCBNZXRlb3IuYmluZEVudmlyb25tZW50KCgpID0+IHtcbiAgICAgICAgaWYgKGV4aXN0c1N5bmMoc29ja2V0UGF0aCkpIHtcbiAgICAgICAgICB1bmxpbmtTeW5jKHNvY2tldFBhdGgpO1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgfSk7XG4gIH07XG4iXX0=
