import { configure, addDecorator } from '@storybook/vue';

import VueInfoAddon from 'storybook-addon-vue-info'

import Vue from 'vue';

// Import your custom components.
import MkplaceVue from '@/index';

// Install this library
Vue.use(MkplaceVue);

// Load stories
const req = require.context("../stories", true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(VueInfoAddon)

configure(loadStories, module);
