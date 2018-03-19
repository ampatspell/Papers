import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':item', 'isSelected:selected', 'item.children.length::no-content' ],

  isSelected: computed('selected.heading.identifier', 'item.heading.identifier', function() {
    let selected = this.get('selected');
    let identifier = this.get('item.heading.identifier');
    return selected === identifier;
  }),

  actions: {
    select(item) {
      let select = this.get('select');
      select && select(item);
    }
  }

});
