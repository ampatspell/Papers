import Component from '@ember/component';
import { computed } from '@ember/object';
import { A } from '@ember/array';

const toText = heading => heading.children.map(item => item.value).join(' ');

const build = data => {
  let headings = A(data.children).filterBy('type', 'heading');
  let top = [];
  let curr;
  headings.forEach(heading => {
    if(heading.depth === 1) {
      let text = toText(heading);
      let item = { text, heading, children: [] };
      top.push(item);
      curr = item;
    } else if(heading.depth === 2 && curr) {
      let text = toText(heading);
      curr.children.push({ text, heading });
    }
  });
  return top;
}

export default Component.extend({
  classNameBindings: [ ':ui-block-mdast-toc' ],

  headings: computed('data', function() {
    let data = this.get('data');
    if(!data) {
      return;
    }
    return build(data);
  }),

  actions: {
    select(item) {
      let select = this.get('select');
      select && select(item.heading.identifier);
    }
  }

});
