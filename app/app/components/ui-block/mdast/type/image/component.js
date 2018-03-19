import Component from '../base/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  tagName: 'img',
  classNameBindings: [ ':image' ],
  attributeBindings: [ 'src', 'alt', 'title' ],

  src:   readOnly('data.url'),
  alt:   readOnly('data.alt'),
  title: readOnly('data.title')

});
