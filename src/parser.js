/* eslint-disable no-undef */
export default (data) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'text/html');
  const rss = dom.querySelector('rss');
  if (rss === null) {
    const error = new Error();
    error.name = 'InvalidRSS';
    throw error;
  }
  const feed = {
    title: dom.querySelector('channel > title').innerHTML,
    description: dom.querySelector('channel > description').innerHTML,
  };
  const items = dom.querySelectorAll('channel > item');
  const posts = Array.from(items).map((item) => (
    {
      title: item.querySelector('title').innerHTML,
      description: item.querySelector('description').innerHTML,
      link: item.querySelector('link').nextSibling.data,
      guid: item.querySelector('guid').textContent,
    }));
  return { feed, posts };
};
