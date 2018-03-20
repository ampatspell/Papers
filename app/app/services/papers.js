import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import { fetchJSON } from '../lib/fetch';
import { all } from 'rsvp';
import { A } from '@ember/array';

export default Service.extend({

  identity: computed(function() {
    return {
      all: A(),
      ids: Object.create(null)
    }
  }).readOnly(),

  createPaper(identifier) {
    let Paper = getOwner(this).factoryFor('model:paper');
    return Paper.create({ identifier });
  },

  paper(identifier) {
    let identity = this.get('identity');
    let paper = identity.ids[identifier];
    if(!paper) {
      paper = this.createPaper(identifier);
      identity.ids[identifier] = paper;
      identity.all.pushObject(paper);
    }
    return paper;
  },

  async _load() {
    let json = await fetchJSON('/content/index.json');
    await all(json.papers.map(identifier => this.paper(identifier).loadIndex()));
    this.set('title', json.title);
  },

  async load() {
    let promise = this.get('promise');
    if(!promise) {
      promise = this._load().then(() => this);
      this.set('promise', promise);
    }
    return promise;
  }

});