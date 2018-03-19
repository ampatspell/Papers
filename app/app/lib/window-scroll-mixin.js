import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({

  window: service(),

  didInsertElement() {
    this._super(...arguments);
    this.get('window').on('scroll', this, this._onWindowScroll);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.get('window').off('scroll', this, this._onWindowScroll);
  },

  _onWindowScroll() {
    this.onWindowScroll(...arguments);
  }

});