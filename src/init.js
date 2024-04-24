import { schema } from "./utils.js";
import { watch } from "./view.js";
import resources from './locales/index.js';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';

const proxyUrl = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
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
  console.log(dom);
  const feed = {
    title: dom.querySelector('channel > title').innerHTML,
    description: dom.querySelector('channel > description').innerHTML,
  }
  const items = dom.querySelectorAll('channel > item');
  const posts = Array.from(items).map((item) => ({ 
      title: item.querySelector('title').innerHTML, 
      description: item.querySelector('description').innerHTML,
      link: item.querySelector('link').innerHTML,  
      id: _.uniqueId,        
  }));
  return { feed, posts };
};

const getData = (url) => {
  return axios.get(`${proxyUrl}${encodeURIComponent(url)}`)
  .then((response) => {
    const data = parser(response.data.contents);
    return data;
  })
  .catch(err => console.log(err));
};

const loadPosts = (state) => {
  const promises = state.feeds.map((item) => axios.get(`${proxyUrl}${encodeURIComponent(item.url)}`)
  .then((response) => {
    console.log(response);
    const { posts } =  parser(response.data.contents);
    console.log(posts);
    watchedState.posts.push(...posts);
  }));

  Promise.all(promises)
  .then(() => {
    setTimeout(() => loadPosts(state), 10000);
  });
};

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
      const url = formData.get('url');

      validate(url)
      .then((validUrl) => {
        state.errors = '';
        watchedState.stateForm = 'valid';
        return getData(validUrl);
      })
      .then((data) => {
        const { feed, posts } = data;
        watchedState.feeds.push({ id: _.uniqueId, url, ...feed });
      })
      .catch((err) => {
        console.log(err);
        state.errors =  err.errors.map((err) => i18n.t(`errors.${err.key}`));
        watchedState.stateForm = 'invalid';
      });
    });
  })
  .then(() => {
    setTimeout(() => loadPosts(state), 10000);
  });
};

export default app;
