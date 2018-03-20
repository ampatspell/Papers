# #9 – Ember Data

* ember-data is an addon, installed by default
* it implements persistent models
* works out of the box with [JSON API](http://jsonapi.org/) and REST endpoints


* **Store**
* **Model**
* **Adapters**, **Serializers**

## Store

* it is a service
* Model identity
* find, query, peek records

``` js
// app/services/store.js
import Store from 'ember-data/store';

export default Store.extend({
});
```

## Adapter

* JSON API adapter
* REST adapter

* Namespace
* Host
* Headers
* Path for resource

Adapter provides the name of default serializer

``` js
// app/adapters/application.js
import JSONAPIAdapter from 'ember-data/adapters/json-api';

export default JSONAPIAdapter.extend({
  namespace: '/api'
});
```

## Model

Represents a resource

``` js
// app/models/something.js
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  quotes: hasMany('quote'),
  category: belongsTo('category')
});
```

## Create Quote and Author models

We can use model generator for that

``` bash
$ ember g model author
$ ember g model quote
```

``` js
// app/models/author.js
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  name: attr('string')
});
```

``` js
// app/models/quote.js
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  text: attr('string')
});
```

## Console Time

* make `store` service available on window
* create `author` and `quote` models and make them available on window as well

``` js
// app/instance-initializers/quotes-dev.js
export default {
  name: 'quotes:dev',
  initialize(app) {
    let store = app.lookup('service:store');

    let author = store.createRecord('author', {
      name: 'Kurt Vonnegut'
    });

    let quote = store.createRecord('quote', {
      text: "To whom it may concern: It is springtime. It is late afternoon."
    });

    setGlobal({ store, author, quote });
  }
}
```

``` js
// console

author.get('name')
// "Kurt Vonnegut"

author.getProperties('name');
// {name: "Kurt Vonnegut"}

author.get('isNew')
// true
```

## Add relationships between Author and Quote

``` js
// app/models/author.js
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  quotes: hasMany('quote')
});
```

``` js
// app/models/quote.js
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  text: attr('string'),
  author: belongsTo('author')
});
```

``` js
// app/instance-initializers/quotes-dev.js
let quote = store.createRecord('quote', {
  text: "To whom it may concern: It is springtime. It is late afternoon.",
  author
});
```

## Promise Object & Promise Many Array

* Asynchronous relationship loading

``` js
quote.get('author')+""
"<DS.PromiseObject:ember415>"

author.get('quotes')+""
"<DS.PromiseManyArray:ember420>"
```

* `promise`
* `then()`
* `isFullfilled`, …
* Proxies forwards property access and change notifications

``` js
quote.get('author').then(author => console.log(author+''));
// Promise { ... }
// <quotes@model:author::ember228:null>
```

``` js
await quote.get('author') + ''
// "<quotes@model:author::ember228:null>"
```

``` js
quote.get('author.isNew')
// true
```

* `ObjectProxy` and `ArrayProxy`
* `toStringExtension`

## 404

``` js
author.save()
```

## ember-cli-mirage

Fake API server that runs in the browser.

* Development
* Acceptance testing
* Sharing a functional prototype

### Install addon

``` bash
$ ember install ember-cli-mirage
```

### Configure authors and quotes

``` bash
$ ember g mirage-model author
$ ember g mirage-model quote
```

``` js
// mirage/models/author.js
import { Model, hasMany } from 'ember-cli-mirage';
export default Model.extend({
  quotes: hasMany('quote')
});
```

``` js
// mirage/models/quote.js
import { Model, belongsTo } from 'ember-cli-mirage';
export default Model.extend({
  author: belongsTo('author')
});
```

### Provide initial data

``` bash
$ ember g mirage-fixture authors
$ ember g mirage-fixture quotes
```

``` js
// mirage/fixtures/authors.js
export default [
  { id: 1, name: 'Kurt Vonnegut', quoteIds: [ 1, 2 ] },
  { id: 2, name: 'Garry Winogrand', quoteIds: [ ] }
];
```

``` js
// mirage/fixtures/quotes.js
export default [
  {
    id: 1,
    text: 'To whom it may concern: It is springtime. It is late afternoon.',
    authorId: 1
  },
  {
    id: 2,
    text: 'The universe is a big place, perhaps the biggest',
    authorId: 1
  }
];
```

``` js
// mirage/scenarios/default.js
export default function(server) {
  server.loadFixtures();
}
```

### Expose authors and quotes api calls

``` js
// mirage/config.js
export default function() {

  this.namespace = '/api';

  this.get('/authors');
  this.get('/quotes');
  this.get('/quotes/:id');
  this.patch('/quotes/:id');

}
```

## Load all authors

* `query`
* `include`
* mirage logged response

``` js
// app/instance-initializers/quotes-dev.js
export default {
  name: 'quotes:dev',
  async initialize(app) {
    let store = app.lookup('service:store');
    setGlobal({ store });

    let authors = await store.findAll('author', { include: 'quotes' });
    setGlobal({ authors });

    console.log(authors.mapBy('name'));
    console.log(authors.get('firstObject.quotes').mapBy('text'));
  }
}
```

``` js
// console
["Kurt Vonnegut"]
["To whom it may concern: It is springtime. It is late afternoon.",
  "The universe is a big place, perhaps the biggest"]
```

* `lastObject`, `firstObject`
* `objectAt(idx)`
* `pushObject(object)` and `removeObject(object)`

``` js
// console
authors.get('firstObject.isNew')
// false
```

![09/01.png]

So, we’ve seen how to load models from remote api endpoint, now we can work on the ui to display this data.

## Declare routes

* nested routes
* route parameters

``` js
// app/router.js
this.route('quotes', function() {
  this.route('quote', { path: '/:quote_id' }, function() {
    this.route('edit');
    this.route('delete');
  });
  this.route('new');
});
```

![09/02.png]

``` hbs
// app/templates/quotes.hbs
<p>quotes.hbs</p>
{{outlet}}
```

``` hbs
// app/templates/quotes/index.hbs
<p>quotes/index.hbs</p>
```

![09/03.png]

## Quotes index

``` bash
$ ember g component ui-route/quotes/index --pod
```

``` js
// app/components/ui-route/quotes/index/component.js
import Component from '@ember/component';

export default Component.extend({
  classNames: [ 'ui-route-quotes-index' ],
});
```

``` hbs
// app/components/ui-route/quotes/index/template.hbs
{{this}}
```

Options when we can load data:

* load in route and optionally provide loading substrate
* load in a component

Depends on UX.

``` bash
$ ember g route quotes/index
? Overwrite app/templates/quotes/index.hbs? No, skip
```

``` js
// app/routes/quotes/index.js
import Route from '@ember/routing/route';
export default Route.extend({

  model() {
    return this.get('store').findAll('quote', { include: 'author' });
  }

});
```

``` hbs
// app/templates/quotes/index.hbs
{{ui-route/quotes/index quotes=model}}
```

``` hbs
// app/components/ui-route/quotes/index/template.hbs
{{this}} with {{quotes}}
```

``` js
// mirage/config.js
this.timing = 5000;
```

``` hbs
// app/templates/quotes/index-loading.hbs
Loading quotes…
```

![09/04.png]

### set-global template helper

It's very useful to have `{{set-global}}` template helper with the same semantics as we have in instance-initializer:

``` hbs
// template.hbs
{{set-global component=this quotes=quotes}}
```

Let's quickly create that

``` bash
$ ember g helper set-global
```

``` js
// app/helpers/set-global.js
import { helper } from '@ember/component/helper';
import _setGlobal from '../lib/set-global';

export function setGlobal(params, hash) {
  // TODO: this leaks
  // needs `delete window[key] when helper is recalculated and destroyed
  _setGlobal(hash);
}

export default helper(setGlobal);
```

``` hbs
// app/components/ui-route/quots/index/template.hbs
{{set-global component=this quotes=quotes}}
```

![09/05.png]

### Render quotes

``` hbs
// app/components/ui-route/quotes/index/template.hbs
{{#ui-block/rows as |rows|}}
  {{#each quotes as |quote|}}
    {{#rows.row}}
      {{ui-block/quote/row quote=quote}}
    {{/rows.row}}
  {{else}}
    {{rows.row 'No quotes added yet'}} // needs row component update
  {{/each}}
{{/ui-block/rows}}

{{set-global component=this quotes=quotes}}
```

### Create quote row component

``` bash
$ ember g component ui-block/quote/row --pod
```

``` js
// app/components/ui-block/quote/row/component.js
import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-quote-row' ]
});
```

![09/06.png]

> Use `classNameBindings` in components. Nearly always you need `action:has-action:no-action` bindings or something along those lines for css.

> Specific components always must to have a specific class name (`ui-block-quote-row` in this case and separate scss file). Use scss mixins, inheritance.

> Component composition over inheritance. — `quote/row` is nested component inside basic row

``` scss
// app/styles/_ui-block-quote-row.scss
.ui-block-quote-row {
  padding: 10px 0;
  > .text {
    font-size: 21px;
    position: relative;
    &:before {
      content: "“";
    }
    &:after {
      content: "”";
    }
  }
  > .author {
    margin-left: 8px;
    font-weight: 500;
    font-size: 13px;
    &:hover {
      text-decoration: underline;
    }
    &:before {
      content: "– ";
    }
  }
}
```

``` js
import Component from '@ember/component';
export default Component.extend({
  classNameBindings: [ ':ui-block-quote-row' ]
});
````

``` hbs
// app/components/ui-block/quote/row/template.hbs
<div class="text">{{quote.text}}</div>
<div class="author" {{action selectAuthor bubbles=false}}>{{quote.author.name}}</div>
```

> `bubbles=false` for event handler allows us to have an action for selecting quote altogether and select just an author.

### Add optional click handler for ui-rows/row

``` js
// app/components/ui-rows/row/component.js
import Component from '@ember/component';
export default Component.extend({
  classNameBindings: [ ':row', ':base', 'action:has-action' ],

  click() {
    let action = this.get('action');
    action && action();
  }

}).reopenClass({
  positionalParams: [ 'value' ]
});
```

``` hbs
// app/components/ui-rows/row/template.hbs
{{#if hasBlock}}
  {{yield}}
{{else}}
  {{value}}
{{/if}}
```

> We’re now styling `.row.has-action` differently

``` scss
// app/styles/_ui-block-rows.scss
.ui-block-rows {
  > .row {
    // -- this is new --
    &.base {
      &.has-action {
        position: relative;
        cursor: pointer;
        &:after {
          content: "";
          position: absolute;
          top: 0;
          left: -20px;
          right: -20px;
          bottom: 0;
          opacity: 0;
          background: fade-out(#000, 0.98);
          border-top: 1px solid fade-out(#000, 0.96);
          border-bottom: 1px solid fade-out(#000, 0.96);
          z-index: -1;
        }
        &:hover {
          &:after {
            opacity: 1;
          }
        }
      }
    }
    // -- this is new --
  }
}
```

### Wire up select actions

``` hbs
// app/components/ui-route/quoutes/index/template.hbs
{{#ui-block/rows as |rows|}}
  {{#each quotes as |quote|}}
    {{#rows.row action=(action 'selectQuote' quote)}}
      {{ui-block/quote/row
          quote=quote
          selectAuthor=(action 'selectAuthor' quote.author)
      }}
    {{/rows.row}}
  {{else}}
    {{rows.row 'No quotes added yet'}}
  {{/each}}
{{/ui-block/rows}}

{{set-global component=this quotes=quotes}}
```

``` js
// app/component/ui-route/quotes/index/component.js
import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-quotes-index' ],

  actions: {
    selectQuote(quote) {
      console.log('select quote', quote+'');
    },
    async selectAuthor(proxy) {
      let author = await proxy.get('promise');
      console.log('select author', author+'');
    }
  }
});
```

* `quote.author` is a proxy which is resolved as we loaded quotes including authors
* if proxy is not yet resolved, it will still have an `id` property, proxies automatically loads content on property access
* distinguish between proxy and model (especially when doing equality comparisons)

![09/07.png]

### Transition to quotes.quote route

Here we are handling click event and not using `{{link-to}}` so we’ll use router service directly to transition between current and `quotes.quote.index` route.

* Route: `this.transitionTo`
* Controller: `this.transitionToRoute`
* Component: none

* It makes a lot of sense to follow some kind of in-app guidelines where you do transitions. In this app, transitions happens **only** in `ui-route` components which are rendered by route template (and navigation bar*****).
* Nested component does transition, parent hasn't saved something yet and so on.

``` js
// app/component/ui-route/quotes/index/component.js
import Component from '@ember/component';
import { inject as service} from '@ember/service';

export default Component.extend({
  classNameBindings: [ ':ui-route-quotes-index' ],

  router: service(),

  actions: {
    selectQuote(quote) {
      this.get('router').transitionTo('quotes.quote', quote);
    },
    async selectAuthor(proxy) {
      let author = await proxy.get('promise');
      console.log('select author', author+'');
    }
  }
});
```

* Always absolute route name
* params
* serialize & deserialize params
* transition with model vs with id and default behavior for id

## Single quote index

Dynamic segment is set for `quotes.quote`, so we should load a model there just for clarity.

* `this.paramsFor`
* `this.modelFor`
* `this.controllerFor`

``` js
// app/routes/quotes/quote.js
import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    console.log(params); // {quote_id: "1"}
  }
});
```

### Load quote including author

``` js
// app/routes/quotes/quote.js
import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    let id = params.quote_id;
    return this.get('store').findRecord('quote', id, { include: 'author' });
  }
});
```

> quotes.quote.index route will automatically receive parent route's model if there is no route with model hook defined

### Create route component for quote

``` bash
$ ember g component ui-route/quotes/quote/index --pod
```

``` hbs
// app/templates/quotes/quote/index.hbs
{{ui-route/quotes/quote/index quote=model}}
```

``` hbs
// app/templates/quotes/quote-loading.hbs
{{#ui-block/rows as |rows|}}
  {{rows.row 'Loading quote…'}}
{{/ui-block/rows}}
```

> `quote-loading` is rendered while quotes.quote route loads so it will be visible while any nested route loads (index, edit, …)

``` js
// app/components/ui-route/quotes/quote/index/component.js
import Component from '@ember/component';
export default Component.extend({
  classNameBindings: [ ':ui-route-quotes-quote-index' ],

  actions: {
    editQuote(quote) {
      this.get('router').transitionTo('quotes.quote.edit', quote);
    },
    selectAuthor(proxy) {
      console.log('selectAuthor', proxy+'');
    }
  }
});
```

``` hbs
// app/components/ui-route/quotes/quote/index/template.hbs
{{#ui-block/rows as |rows|}}
  {{#rows.row}}
    {{ui-block/quote/row
        quote=quote
        selectAuthor=(action 'selectAuthor' quote.author)
    }}
  {{/rows.row}}
  {{rows.button 'Edit' action=(action 'editQuote' quote)}}
{{/ui-block/rows}}
```

### Injecting router way too many times

``` js
// app/instance-initializers/quotes-injections.js
export default {
  name: 'quotes:injections',
  async initialize(app) {
    app.inject('component', 'router', 'service:router');
  }
}
```

> Inject `service:router` into all components as `router` property

![09/08.png]

## Edit quote

* `quotes.quote` route loads
* then `quotes.quote.edit` loads

``` js
// app/routes/quotes/quote/edit.js
import Route from '@ember/routing/route';
import { hash } from 'rsvp';
export default Route.extend({
  model() {
    return hash({
      quote: this.modelFor('quotes.quote'),
      authors: this.get('store').findAll('author', { reload: true })
    });
  }
});
```

> RSVP hash

> findAll with reload & other options

``` hbs
// app/templates/quotes/quote/edit.hbs
{{ui-route/quotes/quote/edit
    quote=model.quote
    authors=model.authors
}}
```

``` bash
$ ember g component ui-route/quotes/quote/edit --pod
```

``` js
// app/components/ui-route/quotes/quote/edit/component.js
import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-quotes-quote-edit' ],

  actions: {
    selectAuthor(quote, author) {
      quote.set('author', author);
    },
    updateText(quote, text) {
      quote.set('text', text);
    },
    async save(quote) {
      await quote.save();
      this.get('router').transitionTo('quotes.quote', quote);
    }
  }
});
```

``` hbs
// app/components/ui-route/quotes/quote/edit/template.hbs
<h1>Edit Quote</h1>

{{#ui-block/rows as |rows|}}

  {{rows.input 'Quote' quote.text (action 'updateText' quote)}}

  {{!--
  {{#rows.select
      'Author'
      authors quote.author
      (action 'selectAuthor' quote) as |author|}}
    {{author.name}}
  {{/rows.select}}
  --}}

  {{rows.key-value 'hasDirtyAttributes' quote.hasDirtyAttributes}}

  {{rows.button 'Save' action=(action 'save' quote)}}

{{/ui-block/rows}}
```

### Create rows.select component

``` bash
ember g component ui-block/rows/row/select --pod
ember g component ui-block/rows/row/select/item --pod
```

``` hbs
// app/components/ui-block/rows/template.hbs
{{yield (hash
  ...
  select=(component 'ui-block/rows/row/select')
)}}
```

``` js
// app/components/ui-block/rows/row/select/component.js
import Component from '../component';

export default Component.extend({
  classNameBindings: [ ':select' ],

  actions: {
    select(model) {
      let select = this.get('select');
      select(model);
    }
  }

}).reopenClass({
  positionalParams: [ 'key', 'array', 'selected', 'select' ]
});
```

``` hbs
// app/components/ui-block/rows/row/select/template.hbs
<div class="key">{{key}}</div>
<div class="items">
  {{#each array as |model|}}
    {{#ui-block/rows/row/select/item
        array=array
        model=model
        selected=selected
        select=(action 'select' model)
    }}
      {{yield model}}
    {{/ui-block/rows/row/select/item}}
  {{/each}}
</div>
```

> “wrapping” an action

> multiple yields

``` js
// app/components/ui-block/rows/row/select/item/component.js
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':item', 'isSelected:selected' ],

  isSelected: computed('selected', 'model', function() {
    let { selected, model } = this.getProperties('selected', 'model');
    if(!selected) {
      return false;
    }
    return selected.get('id') === model.get('id');
  }),

  click() {
    if(this.get('isSelected')) {
      return;
    }
    let select = this.get('select');
    select();
  }
});
```

> Model comparison

> `selected.get('content')`

``` hbs
// app/components/ui-block/rows/row/select/item/template.hbs
{{yield}}
```

``` scss
// app/styles/_ui-block-rows.scss
.ui-block-rows {
  ...

  > .row {
    ...

    &.select {
      > .items {
        > .item {
          &.selected {
            font-weight: 600;
          }
        }
      }
    }
  }
}
```

### Mirage

``` js
// mirage/fixtures/authors.js
export default [
  { id: 1, name: 'Kurt Vonnegut', quoteIds: [ 1, 2 ] },
  { id: 2, name: 'Garry Winogrand', quoteIds: [ ] }
];
```

``` js
// mirage/config.js

...
this.patch('/quotes/:id');
```

![09/09.png]
