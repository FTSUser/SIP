import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from "services";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/v1`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value },
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete,
    forget,
    checkmail,
    verifyCode,
    deleteContactusadmin,
    change,
    getadminById
};

function login(email, password) {
    return fetchWrapper.post(`${baseUrl}/admin/login`, { email, password })
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}
function change(password, newPassword) {
    return fetchWrapper.post(`${baseUrl}/admin/reset`, { password, newPassword });

}

function forget(data) {
    return fetchWrapper.post(`${baseUrl}/admin/after-forget`, data);
}
function checkmail(email) {
    return fetchWrapper.put(`${baseUrl}/admin/verify-email`, { email });
}
function verifyCode(data) {
    return fetchWrapper.put(`${baseUrl}/admin/verify-code`, data);
}


function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('..');
    alertService.success("Logout successfully", { keepAfterRouteChange: true });

}

function register(user) {
    return fetchWrapper.post(`${baseUrl}/admin/signup`, user);
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}
function getadminById(id) {
    return fetchWrapper.get(`${baseUrl}/admin/get-admin/${id}`);
}
function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/admin/updateAdmin/${id}`, params)    
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/admin/deleteAdmin/${id}`);
}

function deleteContactusadmin(id) {
    return fetchWrapper.delete(`${baseUrl}/contactus/deleteContactusadmin/${id}`);

}
