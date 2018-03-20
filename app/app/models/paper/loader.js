import EmberObject from '@ember/object';
import { all } from 'rsvp';
import { readOnly } from '@ember/object/computed';
import { fetchJSON, fetchText } from '../../lib/fetch';

export default EmberObject.extend({

  paper: null,
  identifier: readOnly('paper.identifier'),

  urlFor(filename) {
    let identifier = this.get('identifier');
    return `/content/${identifier}/${filename}`;
  },

  async loadIndex() {
    let url = this.urlFor('paper.json');
    try {
      return await fetchJSON(url);
    } catch(err) {
      if(err.status === 404) {
        let identifier = this.get('identifier');
        throw new Error(`Paper "${identifier}" was not found`);
      }
    }
  },

  async loadSection(section) {
    let url = this.urlFor(`${section}.md`);
    return await fetchText(url);
  },

  async load() {
    let index = await this.loadIndex();
    let sections = await all(index.sections.map(section => this.loadSection(section)));
    return { index, sections };
  }

});