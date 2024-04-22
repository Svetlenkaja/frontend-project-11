import onChange from 'on-change';


const watch = (state) => {
  const watchedState = onChange(state, (path, curValue) => {
    if(path === 'stateForm') {
      render(state, curValue);
    }
    if(path === 'feed') {
      //render feed
    }
  });
  return watchedState;
};

const render = (state, stateForm) => {
  const { elements } = state;
  if (stateForm === 'invalid') {
    elements.input.classList.add('is-invalid');
  } else {
    elements.input.classList.remove('is-invalid');
    elements.form.reset();
    elements.input.focus();
  }
  elements.feedback.innerHTML = state.errors;
}

export { watch };