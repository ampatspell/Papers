# #1 – Developing Web Applications with Ember.js Training Course

![/nobleprog.png]

> Arnis Vuskans

> ampatspell@gmail.com

> http://www.amateurinmotion.com

## Introduction

* Ember.js — makes it easier and faster to build single page web applications
* addons — reusable libraries built to be used with Ember.js
* ember-cli — build pipeline for Ember.js apps
* Ember Inspector — browser plugin to inspect and debug Ember.js app

* convention over configuration
* same structure for each project

* http://www.emberweekly.com/
* https://us4.campaign-archive.com/?u=ac25c8565ec37f9299ac75ca0&id=ef85ec19c5

## We need to have ember-cli installed

* node.js 8.x (LTS)
* npm

``` bash
$ node --version
v8.9.4
```

``` bash
$ npm --version
5.6.0
```

### Install ember-cli

``` bash
$ npm install ember-cli -g
```

``` bash
$ ember --version
ember-cli: 3.0.0
node: 8.9.4
os: darwin x64
```

## We also need Ember Inspector

Install it from [Google Chrome Web Store](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi?hl=en).

## Ready, let’s create an app

We’ll be making an app to collect quotes by various authors.

``` bash
$ ember new quotes
```

``` bash
$ cd quotes
$ ember serve
```

Now the app is running at http://127.0.0.1:4200.

![01/01.png]
