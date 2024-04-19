import { schema } from "./utils.js";
import { watch } from "./view.js";
import resources from './locales/index.js';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';

const state = {
  stateForm: 'valid',
  errors: '',
  feeds: [],
  posts: [],
  lng: 'ru',
};

state.elements = { 
  form: document.querySelector('#rss-form'), 
  input: document.querySelector('#url-input'), 
  feedback: document.querySelector('.feedback'),
};

const watchedState = watch(state);

const validate = (url) => schema.notOneOf(state.feeds).validate(url);

const loadPosts = (state) => {
  state.feeds.map((feed) => {
    const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feed.url)}`;

    axios.get(proxyUrl)
    .then((response) => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(response.data.contents, 'text/html');
      console.log(dom);
      const title = dom.querySelector('channel > title');
      console.log(title.textContent);
      const description = dom.querySelector('channel > description');
      console.log(description.textContent);
    });
  })
  
}

const app = () => {

  const i18n = i18next.createInstance();
  i18n.init({
  lng: state.lng,
  debug: false,
  resources,
  })
  .then(() => {
    state.elements.form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = formData.get('url');

      validate(data)
      .then((url) => {
        state.errors = '';
        watchedState.stateForm = 'valid';
        state.feeds.push({ id: _.uniqueId, url });
        console.log(state.feeds);
      })
      .catch((err) => { 
        state.errors =  err.errors.map((err) => i18n.t(`errors.${err.key}`));
        watchedState.stateForm = 'invalid';
      });
    });
  })
  .then(() => {
    setInterval(() => loadPosts(state), 10000);
  });
};

export default app;
