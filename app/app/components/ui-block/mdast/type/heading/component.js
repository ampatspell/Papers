import Component from '../base/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':heading', 'depthClassName' ],

  depthClassName: computed('data.depth', function() {
    let depth = this.get('data.depth');
    return `h${depth}`;
  }),

  didInsertElement() {
    this._super(...arguments);
    let renderer = this.get('root');
    renderer.register('heading', this);
  },

  willDestroyElement() {
    this._super(...arguments);
    let renderer = this.get('root');
    renderer.unregister('heading', this);
  }

});
