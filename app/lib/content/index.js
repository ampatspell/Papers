/* eslint-env node */
'use strict';

const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'content',
  isDevelopingAddon() {
    return true;
  },
  treeForPublic() {
    return new Funnel('../content', { destDir: 'content' });
  }
};
