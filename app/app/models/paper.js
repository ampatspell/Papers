import EmberObject from '@ember/object';
import { equal, or } from '@ember/object/computed';
import { lookup } from '../lib/computed';
import { Promise, resolve } from 'rsvp';
import { next } from '@ember/runloop';

const model = key => lookup(`model:paper/${key}`, (Model, paper) => Model.create({ paper }));
const loader = () => model('loader');
const parser = () => model('parser');

const join = array => array.reduce((r, item) => {
  r.push(item);
  return r;
}, []).join('\n');

export default EmberObject.extend({

  loader: loader(),
  parser: parser(),

  state: 'none',
  error: null,

  isParsed: equal('state', 'parsed'),
  isDone:   equal('state', 'done'),
  isError:  equal('state', 'error'),

  titleOrIdentifier: or('index.title', 'identifier'),

  index: null,
  content: null,

  async onState(state, error=null) {
    return new Promise(resolve => {
      next(() => this.setProperties({ state, error }));
      resolve();
    });
  },

  addSectionIdentifiers(parsed) {
    let children = parsed.children;

    let toIdentifier = heading => {
      let text = heading.children.filter(child => child.type === 'text' || child.type === 'html').map(child => child.value).join('-');
      return text.replace(/[^\w\s]/gi, '').replace(/ +/g, '-').toLowerCase();
    };

    let first;
    let heading;

    children.forEach(child => {
      if(child.type !== 'heading' || child.depth > 2) {
        return;
      }

      let identifier = toIdentifier(child);
      if(child.depth === 1) {
        heading = child;
        first = first || child;
      } else if(heading) {
        identifier = `${heading.identifier}-${identifier}`;
      }
      child.identifier = identifier;
    });

    return first && first.identifier;
  },

  async __load() {
    let { loader, parser } = this.getProperties('loader', 'parser');

    await this.onState('loading');

    let data;
    try {
      data = await loader.load();
    } catch(err) {
      await this.onState('error', err);
      throw err;
    }

    let string = join(data.sections);

    await this.onState('parsing');

    let parsed;
    try {
      parsed = await parser.parse(string);
    } catch(err) {
      await this.onState('error', err);
      throw err;
    }

    let selected = this.addSectionIdentifiers(parsed);

    await this.onState('parsed');

    this.setProperties({
      index: data.index,
      content: parsed,
    });

    if(!this.get('selected')) {
      this.set('selected', selected);
    }

    await this.onState('done');

    return this;
  },

  _load() {
    let promise = resolve().then(() => this.__load());
    this.set('promise', promise);
    return promise;
  },

  async loadIndex() {
    let index = this.get('index');
    if(!index) {
      let loaded = await this.get('loader').loadIndex();
      this.set('index', loaded);
    }
    return this;
  },

  load(reload=false) {
    let promise = this.get('promise');
    if(promise) {
      if(reload) {
        promise = this._load();
      }
      return promise;
    }
    return this._load();
  },

  select(identifier) {
    if(this.get('selected') === identifier) {
      return;
    }
    this.set('selected', identifier);
  },

  toStringExtension() {
    let identifier = this.get('identifier');
    return `${identifier}`;
  }

});