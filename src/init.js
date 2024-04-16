import { schema } from "./utils.js";

import { watch } from "./view.js";

const state = {
  stateForm: 'valid',
  errors: '',
  feeds: []
};

const watchedState = watch(state);

const form = document.querySelector('#rss-form');

const validate = (url) => {
  let uniqSchema = schema.notOneOf(state.feeds);
  
  return uniqSchema.validate(url);
}

export default () => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');

    validate(url)
    .then((data) => {
      console.log(data);
      watchedState.stateForm = 'valid';
      state.feeds.push(data);
      state.errors = '';
      console.log('clear');
    })
    .catch((error) => { 
      state.errors = error.message;
      watchedState.stateForm = 'invalid';
    });
  })
};
