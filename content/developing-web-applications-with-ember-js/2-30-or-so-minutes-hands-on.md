# #2 – 30 or so minutes hands-on

Let's start with a 30 minute crash course in Ember.js where we will:

* remove the hamster
* add **/index** and **/about** pages
* create a **navigation-bar** component to switch between those pages

For CSS styling we will use **ember-cli-sass** which is an Ember.js addon.

![02/01.png]

## First need to briefly talk about **Routes** and **View Tree**

* Routes — URL to **Route** + **Controller** + **Template**
* Routes are nestable
* Templates can include **Components**
* View Tree — application, welcome-page, index
* Generated controller, route

## Remove the hamster

``` hbs
// app/templates/application.hbs
{{!-- The following component displays Ember's default welcome message. --}}
{{welcome-page}}
{{!-- Feel free to remove this! --}}
{{outlet}}
```

``` hbs
// app/templates/application.hbs
{{outlet}}
```

## Create **index** template

``` hbs
// app/templates/index.hbs
<div class="high-five"></div>
```

``` scss
// app/styles/app.css
.high-five {
  font-size: 96px;
}
  .high-five:after {
    content: "👍";
  }
```

![02/02.png]

## Install **ember-cli-sass**

``` bash
$ Ctrl+c
$ ember install ember-cli-sass
```

``` scss
// app/styles/_body.scss

@import url('https://fonts.googleapis.com/css?family=Raleway:100,200,300,400,500,600,700,800,900&subset=latin-ext');

$font-family: 'Raleway', sans-serif;

@mixin font($size: 16px) {
  font-family: $font-family;
  font-size: $size;
  font-weight: 300;
}

html, body {
  margin: 0;
  padding: 0;
}

body {
  @include font;
  cursor: default;
}

a {
  color: #000;
}

* {
  box-sizing: border-box;
}

@mixin base-input() {
  @include font(14px);
  -webkit-appearance: none;
  outline: none;
  border: 1px solid fade-out(#000, 0.90);
  display: inline-block;
  border-radius: 3px;
}

input[type=text],
input[type=password] {
  @include base-input;
  padding: 5px;
  width: 100%;
}

input[type=submit],
input[type=button],
button {
  @include base-input;
  padding: 5px 10px;
  transition:
    border-color 0.2s ease-in-out,
    background-color 0.2s ease-in-out;
  &:hover {
    border-color: fade-out(#000, 0.93);
    background-color: fade-out(#000, 0.97);
  }
  &:active {
    background-color: fade-out(#000, 0.75);
  }
  &:disabled {
    background-color: #fff;
  }
}
```

``` scss
// app/styles/app.scss
@import "body";

.high-five {
  font-size: 96px;
  &:after {
    content: "👍";
  }
}
```

``` bash
$ ember serve
```

## Create **about** route and template

``` js
// app/router.js
Router.map(function() {
  this.route('about');
});
```

``` html
// app/templates/about.hbs
<h1>about</h1>
<p>this is app. this is ember app. this is about page in an ember app.</p>
```

![02/03.png]

## Create **navigation-bar** component

Components in Ember are used to split complex UI into smaller, reusable pieces to make it easier to reason about each piece separately.

Each component is isolated, can receive data and action handlers from outside.

They consist of two parts (files) — javascript class and a template. While Javascript is responsible for preparing data (for example sorting) and behavior (for example mouse clicks), template provides the necessary HTML markup.

Template can include other, nested components.

### Generate component

``` bash
$ ember generate component ui-block/navigation-bar --pod

installing component
  create app/components/ui-block/navigation-bar/component.js
  create app/components/ui-block/navigation-bar/template.hbs
installing component-test
  create tests/integration/components/ui-block/navigation-bar/component-test.js
```

### Add some content

``` hbs
{{!-- app/coomponents/ui-block/navigation-bar/template.hbs --}}
navigation bar
```

### Render the component

``` hbs
// app/templates/application.hbs
{{ui-block/navigation-bar}}
{{outlet}}
```

![02/04.png]

### Application name

* Receive application name
* Render it

``` hbs
// app/templates/application.hbs
{{ui-block/navigation-bar applicationName='Quotes'}}
{{outlet}}
```

``` hbs
// app/coomponents/ui-block/navigation-bar/template.hbs
<div class="name">{{applicationName}}</div>
```

![02/05.png]

### Copy-paste time

``` scss
// app/styles/_ui-block-navigation-bar.scss
.ui-block-navigation-bar {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  padding: 20px; // remove it later
  > .name {
    font-weight: 400;
    margin-right: 10px;
  }
  > .items {
    flex: 1;
    font-size: 13px;
    > .item {
      font-weight: 600;
      text-decoration: none;
      margin-right: 5px;
      &.active,
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
```

``` scss
// app/styles/app.scss
@import "body";
@import "ui-block-navigation-bar";
...
```

### Give the component a class name

``` js
// app/coomponents/ui-block/navigation-bar/component.js
import Component from '@ember/component';

export default Component.extend({
  classNames: [ 'ui-block-navigation-bar' ]
});
```

![02/06.png]

### Add navigation bar items

``` js
// app/coomponents/ui-block/navigation-bar/component.js
import Component from '@ember/component';

const items = [
  { title: 'Index', route: 'index' },
  { title: 'About', route: 'about' }
];

export default Component.extend({
  classNames: [ 'ui-block-navigation-bar' ],
  items
});
```

### Accessing properties in template

``` hbs
// app/coomponents/ui-block/navigation-bar/template.hbs
<div class="name">{{applicationName}}</div>
{{items}}
{{log items}}
```

![02/07.png]

### Each helper

``` hbs
// app/coomponents/ui-block/navigation-bar/template.hbs
<div class="name">{{applicationName}}</div>

{{#each items as |item|}}
  {{log item}}
{{/each}}
```

![02/08.png]

### Rendering links

``` hbs
// app/coomponents/ui-block/navigation-bar/template.hbs
<div class="name">{{applicationName}}</div>
<div class="items">
  {{#each items as |item|}}
    {{link-to item.title item.route class="item"}}
  {{/each}}
</div>
```

* link-to component
* positional parameters
* class parameter

## Wrapping-up the layout

``` hbs
// app/templates/application.hbs
<div class="ui-block-application">
  <div class="header">
    {{ui-block/navigation-bar applicationName="Quotes"}}
  </div>
  <div class="content">
    {{outlet}}
  </div>
</div>
```

``` scss
// app/styles/_ui-block-application.scss
.ui-block-application {
  > .header {
    padding: 20px;
  }
  > .content {
    padding: 0 20px;
  }
}
```

``` scss
// app/styles/app.scss
@import "ui-block-application";
```

![02/09.png]

And we're done. High-five.

## Recap

* Router
* Route, Controller, Template
* View tree
* Addons
