import onChange from 'on-change';


const watch = (state) => {
  const watchedState = onChange(state, (path, curValue) => {
    if(path === 'stateForm') {
      render(curValue);
    }
  });
  return watchedState;
};

const render = (stateForm) => {
  const input = document.querySelector('#url-input');
  if (stateForm === 'invalid') {
    input.classList.add('is-invalid');
  } else {
    const form = document.querySelector('#rss-form');
    form.reset();
  }
}

export { watch };