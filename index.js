/* eslint-env node */
'use strict';
var map = require('broccoli-stew').map;
var path = require('path');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-cli-swiper',

  treeForVendor: function(defaultTree) {
    var trees = [];
    var swiperPath = path.join(path.dirname(require.resolve('swiper')), '..');
    var browserVendorLib = new Funnel(swiperPath, {
      destDir: 'swiper',
      include: ['js/swiper.min.js', 'css/swiper.min.css']
    });

    browserVendorLib = map(browserVendorLib, (content, relativePath) => {
      if (relativePath.indexOf('css') !== -1) {
        return content;
      }
      return `if (typeof FastBoot === 'undefined') { ${content} }`
    });

    if (defaultTree !== undefined) {
      trees.push(defaultTree);
    }

    trees.push(browserVendorLib);

    return new mergeTrees(trees);
  },

  included: function(app) {
    this._super.included.apply(this, arguments);
    
   // If the addon has the _findHost() method (in ember-cli >= 2.7.0), we'll just
   // use that.
   if (typeof this._findHost === 'function') {
     app = this._findHost();
   } else {
     // Otherwise, we'll use this implementation borrowed from the _findHost()
     // method in ember-cli.
     var current = this;
     do {
       app = current.app || app;
     } while (current.parent.parent && (current = current.parent));
   }

    this.app.import('vendor/swiper/js/swiper.min.js');
    this.app.import('vendor/swiper/css/swiper.min.css');
  }

};
