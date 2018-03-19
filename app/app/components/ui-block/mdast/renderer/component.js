import Component from '@ember/component';
import WindowScrollMixin from 'papers/lib/window-scroll-mixin';
import RegistrationMixin from 'papers/lib/registration-mixin';
import { array } from 'papers/lib/computed';
import { next, scheduleOnce } from '@ember/runloop';
import Velocity from 'npm:velocity-animate';

const animateToComponent = (owner, component) => {
  let wy = owner.get('window.state').y;
  let ey = component.get('element').getBoundingClientRect().y;
  let offset = wy + ey - 50;

  let distance = Math.abs(wy - offset);
  let max = document.body.getBoundingClientRect().height;
  let duration = Math.max(Math.min(15000 * (distance / max), 1000), 300);

  owner.incrementProperty('isAnimating');

  Velocity(document.body, 'scroll', { offset, duration, easing: 'ease-in-out' }).then(() => {
    next(() => owner.decrementProperty('isAnimating'));
  });
};

export default Component.extend(WindowScrollMixin, RegistrationMixin, {
  classNameBindings: [ ':ui-block-mdast-renderer' ],

  data: null,
  headings: array(),

  isAnimating: 0,

  scrollTo(identifier) {
    let component = this.get('headings').findBy('data.identifier', identifier);
    if(!component) {
      return;
    }
    animateToComponent(this, component);
  },

  calculateSelected() {
    let headings = this.get('headings');
    let heading = headings.find(heading => {
      let element = heading.get('element');
      let rect = element.getBoundingClientRect();
      return rect.y > 0;
    });
    if(!heading) {
      return;
    }
    return heading.get('data.identifier');
  },

  updateSelection() {
    if(this.get('isAnimating') > 0) {
      return;
    }
    let select = this.get('select');
    if(!select) {
      return;
    }
    let selected = this.calculateSelected();
    if(!selected) {
      return;
    }
    select(selected, false);
  },

  onWindowScroll() {
    scheduleOnce('afterRender', this, this.updateSelection);
  },

  register(type, component) {
    if(type === 'heading') {
      if(component.get('data.depth') > 2) {
        return;
      }
      this.get('headings').pushObject(component);
    }
  },

  unregister(type, component) {
    if(type === 'heading') {
      this.get('headings').removeObject(component);
    }
  }

});
