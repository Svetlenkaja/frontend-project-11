/* eslint-disable no-undef */
export default (data) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'application/xml');
  const parseError = xml.querySelector('parsererror');
  if (parseError) {
    const error = new Error(parseError.textContent);
    error.name = 'ParsingError';
    throw error;
  }
  const rss = xml.querySelector('rss');
  if (rss === null) {
    const error = new Error();
    error.name = 'InvalidRSS';
    throw error;
  }
  const feed = {
    title: xml.querySelector('channel > title').textContent,
    description: xml.querySelector('channel > description').textContent,
  };
  const items = xml.querySelectorAll('channel > item');
  const posts = Array.from(items).map((item) => (
    {
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
      guid: item.querySelector('guid').textContent,
    }));
  return { feed, posts };
};
