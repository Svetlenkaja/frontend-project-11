import * as yup from 'yup';

yup.setLocale({
  string: {
    required: {
      key: 'emptyUrl',
      message: 'Required field',
    },
    url: {
      key: 'invalidUrl',
      message: 'Invalid URL',
    },
  },
  mixed: {
    notOneOf: {
      key: 'duplicateUrl',
      message: 'Duplicate value',
    },
  },
});

const schema = yup.string().required().url();

export default schema;
