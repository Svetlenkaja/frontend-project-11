import { schema } from "./utils.js";
import { watch } from "./view.js";
import resources from './locales/index.js';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';

const proxyUrl = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

const parser = (data) => {
  console.log(data);
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'text/html');
  console.log(dom);
  const rss = dom.querySelector('rss');
  if (rss === null) {
    throw new Error('errors.invalidRss');
  }
  const feed = {
    title: dom.querySelector('channel > title').innerHTML,
    description: dom.querySelector('channel > description').innerHTML,
  }
  const items = dom.querySelectorAll('channel > item');
  const posts = Array.from(items).map((item) => {
    console.log(item);
    return { 
      title: item.querySelector('title').innerHTML, 
      description: item.querySelector('description').innerHTML,
      link: item.querySelector('link').nextSibling.data,   
      guid: item.querySelector('guid').textContent,      
  }});
  return { feed, posts };
};

const getData = (url) => {
  return axios.get(`${proxyUrl}${encodeURIComponent(url)}`)
  .then((response) => {
    const data = parser(response.data.contents);
    return data;
  })
  .catch(err => {
    console.log(err);
    throw err;
});
};

const checkIsUnique = (existPosts, parsePosts) => {
  return parsePosts
  .filter((newPost) => !existPosts.map(({ guid }) => guid).includes(newPost.guid))
  .map((item) => {
    item.id =_.uniqueId();
    return item; 
 });
}

const loadPosts = (watchedState) => {
  const { feeds } = watchedState;
  const promises = feeds.map((item) => axios.get(`${proxyUrl}${encodeURIComponent(item.url)}`)
  .then((response) => {
    const { posts } =  parser(response.data.contents);
    const newPosts = checkIsUnique(watchedState.posts, posts);
    watchedState.posts.unshift(...newPosts);
  }));

  Promise.all(promises)
  .then(() => { })
  .catch(err => {
    console.log(err);
    // throw new Error(err.name);
  })
  .finally(() => setTimeout(() => loadPosts(watchedState), 55000));
};

const app = () => {
  const state = {
    form: { state:'empty', errors: null },
    modal: { postId: null },
    feeds: [],
    posts: [],
    viewedPosts: new Set(),
    lng: 'ru',
  };
  
  state.elements = { 
    form: document.querySelector('#rss-form'), 
    input: document.querySelector('#url-input'), 
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modal: document.querySelector('#modal'),
  };

  const i18n = i18next.createInstance();
  i18n.init({
  lng: state.lng,
  debug: false,
  resources,
  })
  .then(() => {

    const watchedState = watch(state, i18n);

    const validate = (url) => schema.notOneOf(state.feeds).validate(url);

    state.elements.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const url = formData.get('url');

      validate(url)
      .then((validUrl) => {
        state.form.errors = null;
        watchedState.form.state = 'valid';
        return getData(validUrl);
      })
      .then((data) => {
        const { feed, posts } = data;
        watchedState.feeds.unshift({ id: _.uniqueId, url, ...feed });
        const postsWithId = posts.map((post) => { post.id = _.uniqueId(); return post;});
        watchedState.posts.push(...postsWithId);
      })
      .catch((err) => {
        console.log(err);
        state.form.errors = err.errors ? err.errors.map((err) => i18n.t(`errors.${err.key}`)) : i18n.t(`${err.message}`);
        watchedState.form.state = 'invalid';
      });
    });

    state.elements.postsContainer.addEventListener(('click'), (event) => {
      const { id } = event.target.dataset;
      if (id) {
        watchedState.modal.postId = id;
        watchedState.viewedPosts.add(id);
      }
    });
    loadPosts(watchedState);
  });
};

export default app;
