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

const parser = (data) => {
  console.log(data);
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'text/html');
  const feed = {
    title: dom.querySelector('channel > title').textContent,
    description: dom.querySelector('channel > description').innerHTML,
  }
  const items = dom.querySelectorAll('channel > item');
  const posts = Array.from(items).map((item) => ({ 
      title: item.querySelector('title').textContent, 
      description: item.querySelector('description').innerHTML,
      link: item.querySelector('link').innerHTML,  
      id: _.uniqueId,        
  }));
  return { feed, posts };
};

const getData = (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
  return axios.get(proxyUrl)
  .then((response) => parser(response.data.contents))
  .then((res) => res)
  .catch(err => console.log(err));
};

const loadPosts = (state) => {
  // state.feeds.map((item) => {
  //   const { feed, posts } = getData(item.url);
  //   watchedState.posts.push(...posts);
  // });
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
        const { feed, posts } = getData(url);
        console.log(feed);
        watchedState.feeds.push({ id: _.uniqueId, url, ...feed });
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
