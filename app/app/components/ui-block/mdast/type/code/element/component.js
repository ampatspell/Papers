import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'span',
  classNameBindings: [ 'hljsClassNames' ],

  hljsClassNames: computed('data.properties.className', function() {
    let classNames = this.get('data.properties.className');
    if(!classNames) {
      return;
    }
    return classNames.join(' ');
  }),

});
