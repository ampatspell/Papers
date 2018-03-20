import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly, and } from '@ember/object/computed';
import { next, cancel } from '@ember/runloop';

export default Component.extend({
  classNameBindings: [ ':ui-block-paper' ],

  paper: null,

  selected: readOnly('paper.selected'),
  content: readOnly('paper.content'),

  render: false,
  isDone: and('paper.isDone', 'render'),

  options: computed('paper.identifier', function() {
    let identifier = this.get('paper.identifier');
    let content = 'content';
    let assets = 'assets';
    return { identifier, content, assets };
  }),

  didInsertElement() {
    this._super(...arguments);
    this.get('paper').load();
    this._cancel = next(() => this.set('render', true));
  },

  actions: {
    registration(renderer) {
      this.set('paperRenderer', renderer);
      return () => this.set('paperRenderer', null);
    },
    select(identifier, scroll) {
      this.get('paper').select(identifier);
      if(scroll === false) {
        return;
      }
      this.get('paperRenderer').scrollTo(identifier);
    }
  },

  willDestroy() {
    this._super(...arguments);
    cancel(this._cancel);
  }

});
