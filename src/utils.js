import * as yup from 'yup';

const schema = yup.string().required().url();

export { schema };