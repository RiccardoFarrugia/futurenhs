const path = require('path')
const fs = require('fs')
const slackService = require('./util/SlackReporter')
const genericPage = require('./pageObjects/genericPage');
const axe = require('./util/axe');
global.downloadDir = path.join(__dirname, 'tempDownloads');
global.axeResults = path.join(__dirname, 'axeResults');
global.lhr = path.join(__dirname, 'lighthouseReports');
global.pageWeightStatistic = [{'Page Weights': 'Statistics'}];
//These are the global variables needed for specific test case execution.
global.testCase = "";
global.environmentSpecificWaitTimes = {};
global.postedComment = "";
global.phaseBannerErrors = [];
global.supportBannerErrors = [];
var pagesVisited = [];
global.currentPage = 'data:,'
// var webhookURL = 'WEBHOOKURL'
exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
    // on a remote machine).
    runner: 'local',
    //This is to specify and enable the debugging parameters to fully debug your tests.
    debug: true,
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //
    specs: [
        './features/**/*.feature'
    ],
    suites: {
        fullRegression: [
            './features/**/platformAdmin.feature',
            './features/**/userAccess.feature',
            './features/**/search.feature',
            './features/**/groupNavigation.feature',
            './features/**/groupMembers.feature',
            './features/**/groupManage.feature',
            './features/**/groupPublic.feature',
            './features/**/forumNavigation.feature',
            './features/**/forumSubmission.feature',
            './features/**/forumAdmin.feature',
            './features/**/foldersManagement.feature',
            './features/**/filesManagement.feature',
            './features/**/memberProfile.feature',
            './features/**/cookies.feature',
            './features/**/systemPages.feature',
            './features/**/mobileNavigation.feature'
        ],
        smokeTest: [
            './features/**/userAccess.feature',
            './features/**/groupNavigation.feature',
            './features/**/groupMembers.feature',
            './features/**/groupPrivate.feature',
            './features/**/groupPublic.feature',
            './features/**/forumNavigation.feature',
            './features/**/forumSubmission.feature',
            './features/**/forumAdmin.feature',
            './features/**/foldersManagement.feature',
            './features/**/filesManagement.feature',
            './features/**/mobileNavigation.feature'
        ],
        groups: [
            './features/**/groupNavigation.feature',
            './features/**/groupCreate.feature',
            './features/**/groupMembers.feature',
            './features/**/groupManage.feature',
            './features/**/groupPrivate.feature',
            './features/**/groupPublic.feature',
        ],
        forums: [            
            './features/**/forumNavigation.feature',
            './features/**/forumSubmission.feature',
            './features/**/forumAdmin.feature',
        ],
        files: [
            './features/**/foldersManagement.feature',
            './features/**/filesManagement.feature',
        ],        
    },
    // Patterns to exclude.
    // exclude: [
        // 'path/to/excluded/files'
    // ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 1,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    //
    capabilities: [
        // maxInstances can get overwritten per capability. So if you have an in-house Selenium
        // grid with only 5 firefox instances available you can make sure that not more than
        // 5 instances get started at a time.
    {
        // Chrome Settings
        maxInstances: 1,
        browserName: 'chrome',
        'goog:chromeOptions': {
            prefs: {
                'download.default_directory': downloadDir
            }
        }
    }
        // If outputDir is provided WebdriverIO can capture driver session logs
        // it is possible to configure which logTypes to include/exclude.
        // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
        // excludeDriverLogs: ['bugreport', 'server'],
    ],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'error',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner, @wdio/lambda-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/applitools-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    baseUrl: 'http://localhost:5000/',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,
    //
    // Default timeout in milliseconds for request
    // if Selenium Grid doesn't send response
    connectionRetryTimeout: 90000,
    //
    // Default request retries count
    connectionRetryCount: 0,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    services: ['selenium-standalone', 'devtools', 
        ['image-comparison',
        // The options
        {
            // Some options, see the docs for more
            baselineFolder: path.join(process.cwd(), 'visualRegression/visRegressionBaseline/'),
            formatImageName: '{tag}-{browserName}',
            fullPageScrollTimeout: 5000,
            screenshotPath: path.join(process.cwd(), 'visualRegression/'),
            clearRuntimeFolder: true,
            savePerInstance: false,
            autoSaveBaseline: false,
            blockOutStatusBar: false,
            blockOutToolBar: false,
            hideScrollBars: false
        }],
    ],

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'cucumber',
    // The number of times to retry the entire specfile when it fails as a whole
    specFileRetries: 0,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter.html
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allureResults',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true,
            useCucumberStepReporter: true
        }],
        ['junit', {
            outputDir: 'junitResults'
        }]
    ],
 //
    // If you are using Cucumber you need to specify the location of your step definitions.
    cucumberOpts: {
        requireModule: ['@babel/register'],
        require: ['./stepDefinitions/**/*.js'],        // <string[]> (file/dir) require files before executing features
        backtrace: false,   // <boolean> show full backtrace for errors
        requireModule: [],  // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
        dryRun: false,      // <boolean> invoke formatters without executing steps
        failFast: false,    // <boolean> abort the run on first failure
        format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
        colors: true,       // <boolean> disable colors in formatter output
        snippets: true,     // <boolean> hide step definition snippets for pending steps
        source: true,       // <boolean> hide source uris
        profile: [],        // <string[]> (name) specify the profile to use
        strict: false,      // <boolean> fail if there are any undefined or pending steps
        tagExpression: 'not @Pending',  // <string> (expression) only execute the features or scenarios with tags matching the expression
        timeout: 60000,     // <number> timeout for step definitions
        ignoreUndefinedDefinitions: false, // <boolean> Enable this config to treat undefined definitions as warnings.
    },

    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.

    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    onPrepare: function (config, capabilities) {
        if (process.argv !== undefined && process.argv.length) {
            process.argv.forEach(arg => {
                if (arg.indexOf('--baseUrl=') !== -1) {
                    process.env.baseUrl = arg.replace('--baseUrl=', '');
                }
                if (arg.indexOf('--axe') !== -1) {
                    process.env.axe = true
                }
            });
        }
        if(!fs.existsSync(downloadDir)){
            fs.mkdirSync(downloadDir);            
        }
        if(fs.existsSync(axeResults)){
            fs.rmdirSync(axeResults, {recursive: true})
        }
        if(fs.existsSync(lhr)){
            fs.rmdirSync(lhr, {recursive: true})
        }
    },

    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    // beforeSession: function (config, capabilities, specs) {
    // },

    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    before: function (capabilities) {
        require('expect-webdriverio').setOptions({wait: 2000});
        browser.addCommand('takeFullPageScreenshot', function (options = {}) {
            return browser.call(async () => {
                const puppeteer = await browser.getPuppeteer();
                const pages = await puppeteer.pages();
                return pages[0].screenshot({ ...options, fullPage: true });
            });
        });
        browser.deleteAllCookies();
    },

    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },

    /**
     * Runs before a Cucumber feature
     */
    // beforeFeature: function (uri, feature, scenarios) {
    // },
    
    /**
     * Runs before a Cucumber scenario
     */
    beforeScenario: function (uri, feature, scenario, sourceLocation) {
        browser.reloadSession();
        browser.setWindowSize(1920, 1080);
        browser.deleteAllCookies();
    },

    /**
     * Runs before a Cucumber step
     */
    beforeStep: function (uri, feature, stepData, context) {
        var foundPage = browser.getUrl();
        pagesVisited.push(foundPage);
        if(foundPage === currentPage) {return}

        // Phase Banner Passive Test 
        var result = genericPage.checkPhaseBanner();
        if(result != true){
            phaseBannerErrors.push(result);
        }

        // Support Banner Passive Test
        var result = genericPage.checkSupportBanner();
        if(result != true){
            supportBannerErrors.push(result)
        }

        // Axe Core Accessibility Page Test
        if(process.env.axe){
            var pageCount = 0
            pagesVisited.forEach(page => {
                if(foundPage === page){
                    pageCount++
                }
            });
            if(pageCount <= 1){
                axe.axeTest('all', 'passive');
            }
        }
        currentPage = foundPage
    },

    /**
     * Runs after a Cucumber step
     */
    // afterStep: function (uri, feature, { error, result, duration, passed }, stepData, context) {
    // },

    /**
     * Runs after a Cucumber scenario
     */
    afterScenario: function (test) {
        if (test.result.status === 1 || test.result.status === "PASSED") {
            return;
        } else {
            if(!fs.existsSync("errorScreenshots")){
                fs.mkdirSync("errorScreenshots");
            }
            const filepath = (`errorScreenshots/${test.pickle.name.replace(/[^a-z0-9 ]/gi, '')}.png`);
            browser.takeFullPageScreenshot({path: filepath});
            process.emit('test:screenshot', filepath);
        }
    },

    /**
     * Runs after a Cucumber feature
     */
    // afterFeature: function (uri, feature, scenarios) {
    // },

    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },

    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    after: function (result, capabilities, specs) {
        if(!fs.existsSync("passiveTestErrors")){
            fs.mkdirSync("passiveTestErrors");
        }

        // Generate document of phase banner errors
        if(phaseBannerErrors.length > 0) {
            const filepath = (`passiveTestErrors/phaseBannerErrors.txt`);
            var fileContents = phaseBannerErrors.join('\n\r');
            fs.writeFile(filepath, fileContents, err => {
                if (err){
                    console.err(err);
                    return
                }
            });
        }

        // Generate document of support banner errors
        if(supportBannerErrors.length > 0) {
            const filepath = (`passiveTestErrors/supportBannerErrors.txt`);
            var fileContents = supportBannerErrors.join('\n\r');
            fs.writeFile(filepath, fileContents, err => {
                if (err){
                    console.err(err);
                    return
                }
            });
        }
    },

    /**
     * Gets executed right after terminating the webdriver session.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },

    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    onComplete: function(exitCode, config, capabilities, results) {
        fs.rmdirSync(downloadDir, {recursive: true})
        // new slackService(webhookURL).sendPostMessage(results, config.baseUrl)
     },

    /**
    * Gets executed when a refresh happens.
    * @param {String} oldSessionId session ID of the old session
    * @param {String} newSessionId session ID of the new session
    */
    //onReload: function(oldSessionId, newSessionId) {
    //}
}