import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export const object = () => computed(function() {
  return Object.create(null);
}).readOnly();

export const array = () => computed(function() {
  return A();
}).readOnly();

export const lookup = (factoryName, callback) => computed(function() {
  let factory = getOwner(this).factoryFor(factoryName);
  return callback(factory, this);
}).readOnly();
