import Component from '@ember/component';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-route-papers-index' ],

  version: computed(function() {
    return getOwner(this).factoryFor('config:environment').class.papers.version;
  }).readOnly()

});
