import Component from '../base/component';
import { computed } from '@ember/object';
import { notEmpty } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':code', 'hljsClassNames' ],

  isHighlighted: notEmpty('data.data.hProperties'),

  hljsClassNames: computed('data.data.hProperties.className', function() {
    let classNames = this.get('data.data.hProperties.className');
    if(!classNames) {
      return;
    }
    return classNames.join(' ');
  }),

});
