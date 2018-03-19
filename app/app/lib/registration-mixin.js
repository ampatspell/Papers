import Mixin from '@ember/object/mixin';

export default Mixin.create({

  didInsertElement() {
    this._super(...arguments);
    let registration = this.get('registration');
    if(!registration) {
      return;
    }
    let unregister = registration(this);
    this.set('__registration', unregister);
  },

  elementWillDestroy() {
    this._super(...arguments);
    let registration = this.get('__registration');
    if(!registration) {
      return;
    }
    registration();
  }

});