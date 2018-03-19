import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { scheduleOnce } from '@ember/runloop';

const getWindow = () => {
  if(typeof window === 'undefined') {
    return;
  }
  return window;
}

export default Service.extend(Evented, {

  state: null,

  init() {
    this._super(...arguments);
    if(this.start()) {
      this.update();
    }
  },

  start() {
    let window = getWindow();
    if(!window) {
      return;
    }
    this.___onScroll = this.__onScroll.bind(this);
    window.addEventListener('scroll', this.___onScroll);
    return true;
  },

  onScroll() {
    this.trigger('scroll');
  },

  update() {
    let y = window.scrollY;
    let x = window.scrollX;
    this.set('state', { x, y });
  },

  _onScroll() {
    this.update();
    this.onScroll();
  },

  __onScroll() {
    scheduleOnce('afterRender', this, this._onScroll);
  }

});