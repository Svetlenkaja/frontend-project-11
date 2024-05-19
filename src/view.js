/* eslint-disable no-undef */
import onChange from 'on-change';

const watch = (state, i18n) => {
  const renderForm = (formState) => {
    const { elements } = state;
    if (formState === 'invalid') {
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
    } else {
      elements.input.classList.remove('is-invalid');
      elements.form.reset();
      elements.input.focus();
    }
    elements.feedback.innerHTML = state.form.errors;
  };

  const renderState = (updateState) => {
    const { elements } = state;
    if (updateState === 'loaded') {
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.innerHTML = i18n.t('loaded');
    } else {
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      elements.feedback.innerHTML = state.form.errors;
    }
  };

  const renderFeeds = () => {
    const { feeds } = state;
    const { feedsContainer } = state.elements;

    feedsContainer.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('card-body');
    feedsContainer.append(div);

    const h4 = document.createElement('h4');
    h4.textContent = i18n.t('titles.feeds');

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');

    div.append(h4, ul);

    feeds.forEach((element) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'border-0', 'border-end-0');

      ul.append(li);

      const h3 = document.createElement('h3');
      h3.classList.add('h6', 'm-0');
      h3.textContent = element.title;

      const p = document.createElement('p');
      p.classList.add('m-0', 'small', 'text-black-50');
      p.textContent = element.description;

      li.append(h3, p);
    });
  };

  const renderPosts = () => {
    const { posts, viewedPosts } = state;
    if (posts.length > 0) {
      const { postsContainer } = state.elements;
      postsContainer.innerHTML = '';

      const div = document.createElement('div');
      div.classList.add('card-body');

      const h4 = document.createElement('h4');
      h4.textContent = i18n.t('titles.posts');

      const ul = document.createElement('ul');
      ul.classList.add('list-group', 'border-0', 'rounded-0');

      div.append(h4, ul);

      posts.forEach((element) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

        const a = document.createElement('a');
        a.setAttribute('href', element.link);
        a.innerHTML = element.title;

        if (viewedPosts.has(element.id)) {
          a.classList.add('fw-normal', 'link-secondary');
        } else {
          a.classList.add('fw-bold');
        }

        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
        btn.setAttribute('type', 'button');
        btn.dataset.bsToggle = 'modal';
        btn.dataset.bsTarget = '#modal';
        btn.dataset.id = element.id;
        btn.innerHTML = 'Просмотр';

        li.append(a, btn);
        ul.append(li);
      });

      postsContainer.append(div);
    }
  };

  const renderModal = (postId) => {
    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    const modalLink = document.querySelector('a.full-article');
    const post = state.posts.find((item) => item.id === postId);
    modalTitle.textContent = post.title;
    modalBody.textContent = post.description;
    modalLink.setAttribute('href', post.link);
  };

  const watchedState = onChange(state, (path, curValue) => {
    switch (path) {
      case 'form.state':
        renderForm(curValue);
        break;
      case 'updateData':
        renderState(curValue);
        break;
      case 'feeds':
        renderFeeds();
        break;
      case 'posts':
      case 'viewedPosts':
        renderPosts();
        break;
      case 'modal.postId':
        renderModal(curValue);
        break;
      default:
        throw new Error('Unknown state');
    }
  });
  return watchedState;
};

export default watch;
