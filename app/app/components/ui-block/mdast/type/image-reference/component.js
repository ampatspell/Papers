import Component from '../base/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  tagName: 'img',
  classNameBindings: [ ':image', ':image-reference' ],
  attributeBindings: [ 'src', 'alt' ],

  identifier: readOnly('data.identifier'),
  alt:        readOnly('identifier'),
  options:    readOnly('root.options'),

  src: computed('identifier', 'options', function() {
    let { identifier, options } = this.getProperties('identifier', 'options');
    if(identifier.startsWith('/')) {
      return `/${options.content}/${options.assets}${identifier}`;
    }
    return `/${options.content}/${options.identifier}/${options.assets}/${identifier}`;
  }),

});
