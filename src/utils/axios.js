import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:7001';

let axiosFunc = {
  get (url, params, success) {
    axios
      .get (url, {
        headers: {
          token: localStorage.getItem ('token'),
        },
        params: params,
      })
      .then (res => {
        console.log (`===============${url}==================`);
        console.log (res);
        success (res);
      });
  },
  post (url, params, success) {
    axios
      .post (url, params, {
        headers: {token: localStorage.getItem ('token')},
      })
      .then (res => {
        console.log (`===============${url}==================`);
        console.log (res);
        success (res);
      });
  },
};

export default {
  install (Vue, options) {
    Vue.prototype.get = axiosFunc.get;
    Vue.prototype.post = axiosFunc.post;
  },
};
