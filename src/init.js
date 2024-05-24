/* eslint-disable no-undef */
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import schema from './utils.js';
import parser from './parser.js';
import watch from './view.js';
import resources from './locales/index.js';

const buildErrorMessage = (error, i18n) => {
  switch (error.name) {
    case 'ValidationError':
      return error.errors.map((err) => i18n.t(`errors.${err.key}`));
    case 'AxiosError':
      return i18n.t('errors.networkError');
    case 'InvalidRSS':
      return i18n.t('errors.invalidRss');
    default:
      return error.message;
  }
};

const checkIsUnique = (existPosts, parsePosts) => (
  parsePosts
    .filter((newPost) => !existPosts.map(({ guid }) => guid).includes(newPost.guid))
    .map((item) => {
      item.id = _.uniqueId();
      return item;
    })
);

const buildUrl = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);
  return proxyUrl.toString();
};

const loadPosts = (watchedState, i18n) => {
  watchedState.form.errors = null;
  watchedState.updateData = 'loading';
  const { feeds } = watchedState;
  const promises = feeds.map(({ url }) => axios.get(buildUrl(url)));

  Promise.all(promises)
    .then((responses) => {
      responses.map((response) => {
        const { posts } = parser(response.data.contents);
        const newPosts = checkIsUnique(watchedState.posts, posts);
        watchedState.posts.unshift(...newPosts);
        return watchedState.posts;
      });
      if (watchedState.posts.length > 0) {
        watchedState.updateData = 'loaded';
      }
    })
    .catch((err) => {
      watchedState.form.errors = buildErrorMessage(err, i18n);
      watchedState.updateData = 'failed';
    })
    .finally(() => setTimeout(() => loadPosts(watchedState, i18n), 5000));
};

const app = () => {
  const state = {
    form: { state: 'initial', errors: null },
    modal: { postId: null },
    updateData: 'empty',
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

      const validate = (url, urls) => schema.notOneOf(urls).validate(url);

      state.elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        state.form.state = 'initial';
        const formData = new FormData(event.target);
        const url = formData.get('url');
        const urls = watchedState.feeds.map((f) => f.url);

        validate(url, urls)
          .then((validUrl) => {
            state.form.errors = null;
            watchedState.form.state = 'valid';
            return axios.get(buildUrl(validUrl));
          })
          .then((response) => {
            const { feed, posts } = parser(response.data.contents);
            watchedState.feeds.unshift({ id: _.uniqueId, url, ...feed });
            const postsWithId = posts.map((post) => { post.id = _.uniqueId(); return post; });
            watchedState.posts.push(...postsWithId);
            watchedState.updateData = 'loaded';
          })
          .catch((err) => {
            console.log(err);
            state.form.errors = buildErrorMessage(err, i18n);
            if (err.name === 'ValidationError' || err.name === 'InvalidRSS' || err.name === 'ParsingError') {
              watchedState.form.state = 'invalid';
            } else {
              watchedState.updateData = 'failed';
            }
          });
      });

      state.elements.postsContainer.addEventListener(('click'), (event) => {
        const { id } = event.target.dataset;
        if (id) {
          watchedState.modal.postId = id;
          watchedState.viewedPosts.add(id);
        }
      });
      loadPosts(watchedState, i18n);
    });
};

export default app;
