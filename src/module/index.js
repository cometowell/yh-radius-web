import axios from "axios"
import router from '../router'
axios.defaults.baseURL = $apiUrl;
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use(function(config) {
    config.headers[AUTUORIZATION] = getAuthorization();
    return config;
}, function(error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    // 对响应错误做点什么
    if (error.response.status === 401) {
        router.push({path:"/", query:{reason: "登陆超时!"}});
        localStorage.removeItem("rad_access_token");
    }
    if (error.response.status === 403) {
        alert("权限不足不允许操作!");
    }
    return Promise.reject(error);
  });

function getAuthorization() {
    return localStorage.getItem(AUTUORIZATION);
}

export default axios;