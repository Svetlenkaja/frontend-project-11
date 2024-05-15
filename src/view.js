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
    console.log(elements.form);
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
  if (posts.length > 0) {
    const container = document.querySelector('.posts');
    container.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('card-body');
    const h4 = document.createElement('h4');
    h4.textContent = 'Посты';
    div.append(h4);
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    posts.forEach(element => {
      console.log(element);
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const a = document.createElement('a');
      a.setAttribute('href', element.link);
      a.classList.add('fw-bold');
      a.innerHTML = element.title;
      li.append(a);
      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('type', 'button');
      // button.setAttribute('data-bs-toogle', 'modal');
      // button.setAttribute('data-bs-target', '#modal');
      button.dataset.bsToogle = 'modal';
      button.dataset.bsTarget = '#modal';
      button.dataset.id = element.id;
      button.innerHTML = 'Просмотр';
      li.append(button);
      ul.append(li);
    });
    div.append(ul);
    container.append(div);
  }
}

export { watch };