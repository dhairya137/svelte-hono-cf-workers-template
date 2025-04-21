import './app.css';
import App from './App.svelte';
import { mount } from 'svelte';

console.log('Svelte app initializing...');

const target = document.getElementById('app');

if (!target) {
  console.error('Could not find #app element to mount the Svelte app');
  throw new Error('Could not find #app element to mount the Svelte app');
}

console.log('Target element found, mounting Svelte app...');

// In Svelte 5, we use the mount function instead of 'new'
const app = mount(App, {
  target,
  props: {}
});

console.log('Svelte app mounted successfully!');

export default app; 