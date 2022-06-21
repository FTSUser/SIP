import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from "services";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/v1`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const adminService = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value },
    getAll,
    getById,
    update,
    getAllRole,
    delete: _delete,
    getContactUs,
    getCount,
    getAllRequest,
    approveRequest,
    rejectRequest,
    sendMail,
    getStatus,
    getAllRequests
    

};


function sendMail(data) {
    return fetchWrapper.put(`${baseUrl}/admin/sendQuestionSet`, data);
}

function getAllRequest(data) {
    return fetchWrapper.get(`${baseUrl}/admin/get-request?isAprove=${data}`);
}
function getAllRequests() {
    return fetchWrapper.get(`${baseUrl}/admin/get-all-request`);
}

function approveRequest(id,data) {
    return fetchWrapper.put(`${baseUrl}/admin/isAprove/${id}?isAprove=${data}`,);
}

function rejectRequest(data) {
    return fetchWrapper.put(`${baseUrl}/paymentrefund/createrefund`, data);
}

function getAll() {
    return fetchWrapper.get(`${baseUrl}/admin/get-admins`);
}

function getCount(email) {
    return fetchWrapper.get(`${baseUrl}/admin/count?email=${email}`);
}

function getContactUs() {
    return fetchWrapper.get(`${baseUrl}/contactus/getContactusadmin`);
}

function getAllRole() {
    return fetchWrapper.get(`${baseUrl}/role/getadmin`);
}
function getStatus(id,data) {
    return fetchWrapper.put(`${baseUrl}/admin/updateStatus/${id}`,data);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(x => {
            // update stored user if the logged in user updated their own record
            if (id === userSubject.value.id) {
                // update local storage
                const user = { ...userSubject.value, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                // publish updated user to subscribers
                userSubject.next(user);
            }
            return x;
        });
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}


