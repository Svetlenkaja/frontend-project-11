import onChange from 'on-change';


const watch = (state) => {
  const watchedState = onChange(state, (path, curValue) => {
    if(path === 'stateForm') {
      render(state, curValue);
    }
    if(path === 'feeds') {
      console.log('watched feeds');
      renderFeeds(curValue);
    }
    if(path === 'posts') {
      console.log('watched post');
      renderPosts(curValue);
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

const renderFeeds = (feeds) => {
  const container = document.querySelector('.feeds');
  const div = document.createElement('div');
  div.classList.add('card-body');
  const h4 = document.createElement('h4');
  h4.textContent = 'Фиды';
  div.append(h4);
  container.append(div);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');
  const h3 = document.createElement('h3');
  h3.classList.add('h6', 'm-0');
  h3.textContent = feeds[0].title;
  li.append(h3);
  const p = document.createElement('p');
  p.classList.add('m-0', 'small', 'text-black-50');
  p.textContent = feeds[0].description;
  li.append(p);
  ul.append(li);
  div.append(ul);
};

const renderPosts = (posts) => {
  const container = document.querySelector('.posts');
  const div = document.createElement('div');
  div.classList.add('card-body');
  const h4 = document.createElement('h4');
  h4.textContent = 'Посты';
  div.append(h4);
  container.append(div);
}

export { watch };