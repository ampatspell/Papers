import Component from '../base/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  tagName: 'a',
  classNameBindings: [ ':link' ],
  attributeBindings: [ 'href', 'target' ],

  href: readOnly('data.url'),
  target: 'top'

});
