# #3 – Object Model

To kick off the discussion about Classes in Ember, let's create a `playground` route with `ui-route/playground` component.

## Playground

``` js
$ ember g route playground
$ ember g component ui-route/playground --pod
```

``` hbs
// app/templates/playground.hbs
{{ui-route/playground}}
```

``` js
// app/components/ui-route/playground/playground.js
console.log('playground');
```

``` js
// app/components/ui-route/playground/component.js
import Component from '@ember/component';
import './playground';

export default Component.extend({
  classNames: [ 'ui-route-playground' ],
});
```

``` hbs
// app/components/ui-route/playground/template.hbs
<h1>Playground</h1>
```

``` js
// app/components/ui-block/navigation-bar/component.js
const items = [
  ...
  { title: 'Playground', route: 'playground' }
];
```

![03/01.png]

## playground.js

Let's start with just a console

### Person

``` js
// app/components/ui-route/playground/playground.js
import EmberObject from '@ember/object';

const Person = EmberObject.extend({
});

window.Person = Person;
```

### Empty instance

``` js
// console
person = Person.create();

dir(person)
// ...

Person.detectInstance(person);
// true
```

### Person with name

``` js
// console
person = Person.create({ name: 'zeeba' });

dir(person);

person.get('name');
// zeeba

person.set('name', 'larry');
// larry

person.get('name');
// zeeba

person.setProperties({ name: 'croc', color: 'green' });
// { name: "croc", color: "green" }

person.getProperties('name', 'color', 'email');
// { name: "croc", color: "green", email: undefined }

let name = 'croc';
let color = 'green';
person.setProperties({ name, color });

let { name, color } = person.getProperties('name', 'color');
console.log(name);

let props = person.getProperties('name', 'color');
let name = props.name;
let color = props.color;
```

### Init

``` js
// app/components/ui-route/playground/playground.js
const Person = EmberObject.extend({

  name: 'croc',

  init() {
    this._super(...arguments);
    this.set('color', 'green');
    console.log('Person#init', this.getProperties('name', 'color'));
  }

});
```

``` js
// console
person = Person.create();
// Person#init {name: "croc", color: "green"}
```

> Prototype chain, shared properties

## Person used in component

Export

``` js
// app/components/ui-route/playground/playground.js
export const Person = ...
```

Import

``` js
// app/components/ui-route/playground/component.js
import { Person } from './playground';
```

Component Init

``` js
// app/components/ui-route/playground/component.js
import Component from '@ember/component';
import { Person } from './playground';

export default Component.extend({
  classNames: [ 'ui-route-playground' ],
  init() {
    this._super(...arguments);
    let person = Person.create();
    this.set('person', person);
    window.person = person;
  }
});
```

``` hbs
// app/components/ui-route/playground/template.hbs
<h1>Playground</h1>
<div>
  {{person}}
</div>
```

![03/02.png]

> `toString`, `toStringExtension` for debugging (but container provides `toString`)

> `window[key] = …`

## Ember object properties are observable

## Use get and set

``` js
import { get, set } from '@ember/object';

let instance = Person.create();

get(instance, key);
set(instance, key, value);

instance.get(key);
instance.set(key, value);
```

* get and set path may contain ‘.’
* `trySet`
* `getWithDefault` — default if value returned is `undefined`
* https://github.com/ember-cli/ember-rfc176-data

### Show name and color in template

``` hbs
// app/components/ui-route/playground/template.hbs
<h1>Playground</h1>

<div>
  {{person}}
</div>

<div>
  name: <b>{{person.name}}</b>
</div>

<div>
  color: <b>{{person.color}}</b>
</div>
```

### Get and Set

``` js
// console

person
// Class {_super: ƒ, __ember1520789063380: "ember282"}

person.get('name')
// croc

person.set('name', 'zeeba')
// zeeba

person.name = 'qwe';
// Assertion Failed: You must use set() to set the `name` property (of ...) to `qwe`.
```

## Computed properties

* Allows to define a property which is lazily calculated based on other, observed properties
* If `get` and `set` is always used, property consumer doesn't see any difference
* Can be read-only
* Can depend on array mutations and object properties inside array (find, filter)

``` js
import { computed } from '@ember/object';
import { alias, readOnly, equal, /* lots of other */ } from '@ember/object/computed';
```

### Full name

Canonical example: concatinate two properties

``` js
// app/components/ui-route/playground/playground.js
import EmberObject, { computed } from '@ember/object';

export const Person = EmberObject.extend({

  name: 'croc',
  color: 'green',

  fullName: computed('name', 'color', function() {
    let { name, color } = this.getProperties('name', 'color');
    return `${color} ${name}`;
  })

});
```

``` hbs
// app/components/ui-route/playground/template.hbs
<div>
  full name: <b>{{person.fullName}}</b>
</div>
```

``` js
// console
person.set('name', 'zeeba');
```

### Read-only property

By default computed properties are overridable

``` js
// console
person.set('fullName', 'not good');
```

``` js
// app/components/ui-route/playground/playground.js
fullName: computed('name', 'color', function() {
  ...
}).readOnly()
```

``` js
// console

person.set('fullName', 'not good');
// Error: Cannot set read-only property "fullName" on object [..]
```

### Read-write properties

``` js
// app/components/ui-route/playground/playground.js
fullName: computed('name', 'color', {
  get() {
    let { name, color } = this.getProperties('name', 'color');
    return `${color} ${name}`;
  },
  set(key, value) {
    let [ color, name ] = value.split(' ');
    this.setProperties({ name, color });
    return value;
  }
})
```

``` js
// console
person.set('fullName', 'yellow zeeba');
```

### Console is boring, input fields are fun

This should not be considered best practice. We will talk quite a lot more about input fields, data manipulation.

``` scss
// app/styles/_ui-block-rows.scss
.ui-block-rows {
  padding: 10px 0;
  > .row {
    padding: 5px 0;
    > label,
    > .key {
      display: block;
      font-size: 12px;
      font-weight: 600;
    }
    > .value {
      font-weight: 400;
      &:after {
        content: '\00a0';
      }
    }
    &.button {
      width: 100%;
      padding: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
```

``` hbs
// app/components/ui-route/playground/template.hbs
<h1>Playground</h1>

<div class="ui-block-rows">
  <div class="row">
    <div class="key">Person</div>
    <div class="value">{{person}}</div>
  </div>
</div>

<div class="ui-block-rows">
  <div class="row">
    <div class="key">Name</div>
    <div class="value">{{person.name}}</div>
  </div>
  <div class="row">
    <div class="key">Color</div>
    <div class="value">{{person.color}}</div>
  </div>
  <div class="row">
    <div class="key">Full Name</div>
    <div class="value">{{person.fullName}}</div>
  </div>
</div>

<div class="ui-block-rows">
  <div class="row">
    <label>Full name</label>
    {{input value=person.fullName}}
  </div>
  <div class="row">
    <label>Name</label>
    {{input value=person.name}}
  </div>
  <div class="row">
    <label>Color</label>
    {{input value=person.color}}
  </div>
</div>
```

### Computed property as a factory

Use computed properties without dependent keys to lazy create an instance.

``` js
// app/components/ui-route/playground/component.js
import Component from '@ember/component';
import { computed } from '@ember/object';
import { Person } from './playground';

export default Component.extend({
  classNames: [ 'ui-route-playground' ],

  person: computed(function() {
    return Person.create();
  }).readOnly()

});
```


### Provided computed macros
As an example:

* `equal` computed property compares value of dependent property to a static value
* `or` computed property performs a logical `or` on the original values for the provided dependent properties

``` js
// app/components/ui-route/playground/playground.js
// ...
import { equal, or } from '@ember/object/computed';

export const Person = EmberObject.extend({

  isColorGreen: equal('color', 'green'),
  isNameCroc:   equal('name', 'croc'),

  isCroc: or('isColorGreen', 'isNameCroc'),

  // ...

});
```

``` hbs
// app/components/ui-route/playground/template.hbs
<h1>Playground</h1>

<div class="ui-block-rows">
  <div class="row">
    <div class="key">isCroc</div>
    <div class="value">{{if person.isCroc 'Yes, a croc!' 'Ahh, not a croc'}}</div>
  </div>
</div>
```

* If condition shotrthand `{{if condition truthy falsey}}`

### Writing own computed property helpers

Computed property which returns fallback value if dependent property not a string or blank:

``` hbs
// app/components/ui-route/playground/template.hbs
<div class="row">
  <div class="key">Name</div>
  <div class="value">{{person.nameOrUnnamed}}</div>
</div>
<div class="row">
  <div class="key">Color</div>
  <div class="value">{{person.colorOrColorless}}</div>
</div>
```

Let's say we want the API to be:

``` js
export const Person = EmberObject.extend({

  nameOrUnnamed:    fallback('name', 'unnamed'),
  colorOrColorless: fallback('color', 'colorless'),

});
```

``` js
// app/components/ui-route/playground/playground.js
import { computed } from '@ember/object';

const fallback = (key, fallbackValue) => computed(key, function() {
  let value = this.get(key);
  if(typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  return fallbackValue;
}).readOnly();
```

### Recap what we have been doing so far

``` js
// app/components/ui-route/playground/playground.js
import EmberObject, { computed } from '@ember/object';
import { equal, or } from '@ember/object/computed';

const fallback = (key, fallbackValue) => computed(key, function() {
  let value = this.get(key);
  if(typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  return fallbackValue;
}).readOnly();

export const Person = EmberObject.extend({

  name:  'croc',
  color: 'green',

  nameOrUnnamed:    fallback('name', 'unnamed'),
  colorOrColorless: fallback('color', 'colorless'),

  isColorGreen: equal('color', 'green'),
  isNameCroc:   equal('name', 'croc'),
  isCroc:       or('isColorGreen', 'isNameCroc'),

  fullName: computed('name', 'color', {
    get() {
      let { name, color } = this.getProperties('name', 'color');
      return `${color} ${name}`;
    },
    set(key, value) {
      let [ color, name ] = value.split(' ');
      this.setProperties({ name, color });
      return value;
    }
  })

});
```

![03/03.png]

## Destroy

Ember Objects can be destroyed.

This removes all property change observers, object becomes unobservable and doesn't allow to set property values (as the change notifications won't be propogated anymore).

Destroy happens in two steps:

* `willDestroy` is invoked from an `actions` queue
* actual destroy process runs from `destroy` queue

``` js
export const Person = EmberObject.extend({

  willDestroy() {
    this.websocket.stop();
    this._super(..arguments);
  }
});
```

``` js
let person = Person.create();
person.destroy();
person.isDestroying // => true
..
person.isDestroyed // => true
```

## Container & Resolver

### Person is a model

..so it should reside in app/models.

``` js
// app/models/playground/person.js
...
export default EmberObject.extend({
  ...
});
```

``` js
// app/components/ui-route/playground/component.js
import Person from 'quotes/models/playground/person';
```

* convention over configuration
* easy class lookup and instance creation by using container
* ember-data does it for own models
* all route, controller, component, template,… instances are created by using container

### Container, Registry, Resolver

* container — lookup
* registry — register
* resolver — lookup rules based on ES6 module naming conventions

``` js
// app/components/ui-route/playground/component.js
import Component from '@ember/component';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';

export default Component.extend({
  classNames: [ 'ui-route-playground' ],

  person: computed(function() {
    let Person = getOwner(this).factoryFor('model:playground/person');
    return Person.create();
  }).readOnly()

});
```

* also `getOwner(this).lookup()`
* plain `Person.create()` and `getOwner(this)`
* Lookup rules (as of now)
* https://github.com/emberjs/rfcs/blob/master/text/0143-module-unification.md

## Services

Service is a singleton which can be “injected” into any (container-bound) object.

Let's have a **storage** service which will create models instead of forcing component to implement such a low level functionality. And while we’re messing with playground, let’s move person model creation to the playground route.

### Generate a service

``` bash
$ ember g service storage
```

``` js
// app/services/storage.js
import Service from '@ember/service';

export default Service.extend({
});
```

### Move model creation to the storage service

``` js
// app/services/storage.js
import Service from '@ember/service';
import { getOwner } from '@ember/application';

export default Service.extend({

  createModel(modelName, props) {
    let factory = getOwner(this).factoryFor(`model:${modelName}`);
    return factory.create(props);
  }

});
```

### Inject service in route and create model

* service is lazy created
* model hook

``` js
// app/routes/playground.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  storage: service(),

  model() {
    return this.get('storage').createModel('playground/person');
  }

});
```

### Remove person creation in component

``` js
// app/components/ui-route/playground/component.js
import Component from '@ember/component';

export default Component.extend({
  classNames: [ 'ui-route-playground' ],
  person: null
});
```

### Provide person to component

And we're completely skipping controller, again.

``` hbs
// app/templates/playground.hbs
{{ui-route/playground person=model}}
```

And now, as we’ve seen how models are looked up, instantiated by service, how route's model hook fits in whole picture.
