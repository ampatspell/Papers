# #6 – Mixins

Mixins allows you to add properties to classes.

* default values
* computed properties
* methods

Mixins work best if they’re intended for a group of classes (models, routes, …). Uses include for example:

* a validation mixin which can be mixed-in models which needs this functionality
* route mixin which makes sure current user has access to particular route

To demostrate how mixins work, let's create a `LocalStorage` mixin which would allow us to save and load object properties in browser's `localStorage` where configuration is provided by class where mixin is mixed-in.

## Create a Mixin

To create a mixin, we use `create` not `extend`:

``` js
// app/lib/local-storage-mixin.js
import Mixin from '@ember/object/mixin';

export default Mixin.create({
});
```

## Use a Mixin

To mix-in a mixin in to the class

``` js
// app/models/playground/person.js
...
import LocalStorageMixin from '../../lib/local-storage-mixin';

export default EmberObject.extend(LocalStorageMixin, {
  ...
});
```

## Implementation wireframe

``` js
// app/lib/local-storage-mixin.js
import Mixin from '@ember/object/mixin';

export default Mixin.create({

  localStorageKey: null,
  localStorageProperties: null,

  save() {
  },

  load() {
  }

});
```

> Mixins can include other mixins

## Implementation

### Wire up playground buttons

``` js
// app/components/ui-route/playground/component.js
import Component from '@ember/component';

export default Component.extend({
  classNames: [ 'ui-route-playground' ],

  actions: {
    save(person) {
      person.save();
    },
    load(person) {
      person.load();
    }
  }

});
```

``` hbs
// app/components/ui-route/playground/template.hbs
{{#ui-block/rows as |rows|}}
  {{rows.button 'Save' action=(action 'save' person)}}
  {{rows.button 'Load' action=(action 'load' person)}}
{{/ui-block/rows}}
```

### Action target

You can also provide a target for an action and add actions object in mixin:

``` hbs
// app/components/ui-route/playground/template.hbs
{{rows.button 'Load' action=(action 'load' target=person)}}
```

``` js
// app/lib/local-storage-mixin.js
import Mixin from '@ember/object/mixin';

export default Mixin.create({

  ...

  actions: {
    save() {
      this.save();
    },
    load() {
      this.load();
    }
  }
});
```

### Implementation

``` js
// app/models/playground/person.js
import { A } from '@ember/array';
import LocalStorageMixin from '../../lib/local-storage-mixin';

const array = values => computed(function() {
  return A(values);
}).readOnly();

export default EmberObject.extend(LocalStorageMixin, {

  localStorageKey: 'person',
  localStorageProperties: array([ 'name', 'color' ]),

  ...

});
```

``` js
// app/lib/local-storage-mixin.js
import Mixin from '@ember/object/mixin';
import { A } from '@ember/array';

export default Mixin.create({

  localStorageKey: null,
  localStorageProperties: null,

  save() {
    let key = this.get('localStorageKey');
    if(!key) {
      return;
    }
    let props = A(this.get('localStorageProperties'));
    let json = this.getProperties(props);
    let string = JSON.stringify(json);
    // TODO: this needs try/catch for any real-world use
    localStorage.setItem(key, string);
  },

  load() {
    let key = this.get('localStorageKey');
    if(!key) {
      return;
    }
    let string = localStorage.getItem(key);
    if(!string) {
      return;
    }
    let json = JSON.parse(string);
    this.setProperties(json);
  }

});
```

> Psst, there is an addon for that

![](https://d2mxuefqeaa7sj.cloudfront.net/s_712FFFA8D1C3FDC1CE138A57CE1FF4925D6BFDA523F5A746B2D94F6FD7BB2C9C_1520963943918_Screen+Shot+2018-03-13+at+19.58.52.png)
