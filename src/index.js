import 'https://cdn.skypack.dev/element-internals-polyfill';
import ReorderableList from './ReorderableList.js';
import ReorderableItem from './ReorderableItem.js';

[ReorderableList, ReorderableItem].forEach(
  el => customElements.define(el.tagName, el)
)
