module.exports = function (grunt) {
    'use strict';

    grunt.registerMultiTask("jasmine_node", "Runs jasmine-node.", function() {
      var jasmine = require('jasmine-node');

      // Merge task-specific options with these defaults.
      var options = this.options({
        projectRoot: '.',
        source: 'src',
        specNameMatcher: 'spec',
        teamcity: false,
        useRequireJs: false,
        extensions: 'js',
        match: '.',
        matchall: false,
        autotest: false,
        useHelpers: false,
        forceExit: false,
        isVerbose: true,
        showColors: true,
        jUnit: {
          report: false,
          savePath : "./reports/",
          useDotNotation: true,
          consolidate: true
        }
      });

      // Tell grunt this task is asynchronous.
      var done = this.async();

      grunt.verbose.writeln("Options: " + options.projectRoot);
      var regExpSpec = new RegExp(options.match + (options.matchall ? "" : options.specNameMatcher + "\\.") + "(" + options.extensions + ")$", 'i');

      var onComplete = function(runner, log) {
        var exitCode;
        grunt.log.error("\n");
        if (runner.results().failedCount === 0) {
          exitCode = 0;
        } else {
          exitCode = 1;

          if (options.forceExit) {
            process.exit(exitCode);
          }
        }

        done();
      };

      var options2 = {
        specFolder:   options.projectRoot,
        onComplete:   onComplete,
        isVerbose:    options.isVerbose,
        showColors:   options.showColors,
        teamcity:     options.teamcity,
        useRequireJs: options.useRequireJs,
        regExpSpec:   regExpSpec,
        junitreport:  options.jUnit
      };

      // order is preserved in node.js
      var legacyArguments = Object.keys(options2).map(function(key) {
        return options[key];
      });

      try {
        // for jasmine-node@1.0.27 individual arguments need to be passed
        jasmine.executeSpecsInFolder.apply(this, legacyArguments);
      }
      catch (e) {
        try {
          // since jasmine-node@1.0.28 an options object need to be passed
          jasmine.executeSpecsInFolder(options2);
        } catch (e) {
          console.log('Failed to execute "jasmine.executeSpecsInFolder": ' + e.stack);
        }
      }
    });
};
