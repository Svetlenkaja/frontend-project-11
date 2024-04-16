import onChange from 'on-change';


const watch = (state) => {
  const watchedState = onChange(state, (path, curValue) => {
    if(path === 'stateForm') {
      render(state, curValue);
    }
  });
  return watchedState;
};

const render = (state, stateForm) => {
  const input = document.querySelector('#url-input');
  if (stateForm === 'invalid') {
    input.classList.add('is-invalid');
    const feedback = document.querySelector('.feedback');
    console.log(state);
    console.log(feedback);
    feedback.innerHTML = state.errors;
  } else {
    input.classList.remove('is-invalid');
    const form = document.querySelector('#rss-form');
    form.reset();
    input.focus();
  }
}

export { watch };