import $axios from '../utils/axios';

// 登录
export const login = params => $axios('/admin/login', params, 'POST');
// 退出登录
export const signOut = params => $axios('/admin/signout', params, 'POST');
// 验证码
export const getCaptcha = () => $axios('/v1/captcha');

// 获取所有管理员列表
export const getAdminList = params => $axios('/admin/getalladmin', params, 'GET');
// 获取当前管理员全部信息
export const getAdminInfo = () => $axios('/admin/getadmininfo');

// 当日用户注册量
export const userCount = date => $axios('/apis/userCount', {date}, 'GET');
// 当日订单数量
export const orderCount = date => $axios('/apis/orderCount', {date}, 'GET');
// 当日注册管理员人数
export const adminCount = date => $axios('/apis/adminCount', {date}, 'GET');


// 总的用户注册数
export const getUserCount = () => $axios('/v2/user/getUserCount');
// 总的订单数量
export const getOrdersCount = () => $axios('/v1/getOrdersCount');
// 总的注册管理员
export const getAdminCount = () => $axios('/admin/getAdminCount');


// 用户列表
export const getUserList = params => $axios('/v2/user/getUserList', params, 'GET');

// 获取定位城市
export const guessCity = () => $axios('/v1/cities', {type: 'guess'}, 'GET');
// 获取餐馆列表
export const getRestaurants = params => $axios('/shopping/getRestaurants', params, 'GET');
// 获取餐馆总数
export const getRestaurantsCount = params => $axios('/shopping/getShopCount', params, 'GET');
// 获取搜索地址
export const searchPlace = params => $axios('/v1/position', params, 'GET');
// category 种类列表
export const foodCategory = params => $axios('/shopping/getCategories', params, 'GET');
