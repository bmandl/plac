import fetch from 'unfetch';

const xhr = (url) => fetch(url).then((res) => res.json());

export default xhr;
