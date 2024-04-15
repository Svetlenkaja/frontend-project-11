import { schema } from "./utils.js";

import { watch } from "./view.js";

const state = {
  stateForm: 'valid',
  errors: {},
  feeds: []
};

const watchedState = watch(state);

const form = document.querySelector('#rss-form');

export default () => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const url = data.get('url');

    schema.validate(url)
    .then((data) => state.stateForm = 'valid')
    .catch((error) => { 
      watchedState.stateForm = 'invalid';
      state.errors = error.message;
      console.log(error.message);
    });
  })
};
