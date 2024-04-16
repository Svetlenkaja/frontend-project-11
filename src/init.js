import { schema } from "./utils.js";
import { watch } from "./view.js";
import resources from './locales/index.js';
import i18next from 'i18next';

const state = {
  stateForm: 'valid',
  errors: '',
  feeds: [],
  lng: 'ru',
};

state.elements = { 
  form: document.querySelector('#rss-form'), 
  input: document.querySelector('#url-input'), 
  feedback: document.querySelector('.feedback'),
};

const watchedState = watch(state);

const validate = (url) => schema.notOneOf(state.feeds).validate(url);

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
      .then((data) => {
        state.errors = '';
        watchedState.stateForm = 'valid';
        state.feeds.push(data);
      })
      .catch((err) => { 
        state.errors =  err.errors.map((err) => i18n.t(`errors.${err.key}`));
        watchedState.stateForm = 'invalid';
      });
    });
  });
};

export default app;
