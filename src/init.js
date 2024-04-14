import { schema } from "./utils.js";
import onChange from 'on-change';
// import { watchedState } from "./view.js";

const object = {
  form: {
    state: 'valid',
    data: {
      url: '',
    },
    elements: {}
  },
  errors: {},
  feeds: []
};

export default () => {
  const form = document.querySelector('#rss-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const url = data.get('url');

    const promise = schema.validate(url)
    .then((data) => object.form.state = 'valid')
    .catch((error) => { 
      watchedState.form.state = 'invalid';
      object.errors = error.message;
      console.log(error.message);
    });
  })
};

const render = (state) => {
  const input = document.querySelector('#url-input');
  if (state === 'invalid') {
    input.classList.add('is-invalid');
  } else {
    const form = document.querySelector('#rss-form');
    form.reset();
  }
}

const watchedState = onChange(object, (path, curValue) => {
  if(path === 'form.state') {
    render(curValue);
  }
});
