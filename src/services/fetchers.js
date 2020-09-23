import fetch from 'unfetch';

export default (url) => fetch(url).then((res) => res.json());
