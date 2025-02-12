'use strict';
const map = require('broccoli-stew').map; // eslint-disable-line ember-suave/prefer-destructuring, node/no-extraneous-require
const path = require('path');
const Funnel = require('broccoli-funnel'); // eslint-disable-line node/no-extraneous-require
const MergeTrees = require('broccoli-merge-trees'); // eslint-disable-line node/no-extraneous-require

module.exports = {
  name: require('./package').name,

  treeForVendor(defaultTree) {
    let trees = [];
    let swiperPath = path.join(path.dirname(require.resolve('swiper')), '..');
    let browserVendorLib = new Funnel(swiperPath, {
      destDir: 'swiper',
      include: ['js/swiper.js', 'css/swiper.css']
    });

    browserVendorLib = map(browserVendorLib, (content, relativePath) => {
      if (relativePath.indexOf('css') !== -1) {
        return content;
      }
      return `if (typeof FastBoot === 'undefined') { ${content} }`;
    });

    if (defaultTree !== undefined) {
      trees.push(defaultTree);
    }

    trees.push(browserVendorLib);

    return new MergeTrees(trees);
  },

  included(/* app */) {
    this._super.included.apply(this, arguments);
    this.import('vendor/swiper/js/swiper.js');
    this.import('vendor/swiper/css/swiper.css');
  }
};
