import EmberObject from '@ember/object';
import { resolve } from 'rsvp';

import unified from 'npm:unified';
import parse from 'npm:remark-parse';
import frontmatter from 'npm:remark-frontmatter';
import highlight from 'npm:remark-highlight.js';
import jsyaml from 'npm:js-yaml';

let Compiler = function(tree) {
  this.tree = tree;
}

Compiler.prototype.compile = function() {
  let tree = this.tree;
  let children = tree.children;
  if(!children) {
    return;
  }
  let first = children[0];
  if(first && first.type === 'yaml') {
    first.value = jsyaml.safeLoad(first.value);
  }
  return tree;
}

const compiler = function() {
  this.Compiler = Compiler;
}

const processor = unified()
  .use(parse)
  .use(frontmatter, [ 'yaml' ])
  .use(highlight)
  .use(compiler);

export default EmberObject.extend({

  paper: null,

  async _parse(string) {
    let file = await processor.process(string);
    return file.contents;
  },

  parse(string) {
    return resolve().then(() => this._parse(string));
  }

});