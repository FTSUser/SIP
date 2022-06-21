import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/v1`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const questionService = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value },
    update,
    delete: _delete,
    getAllQuestion,
    createQuestion,
    getAllQuestionSet,
    deleteQuestionSet,
    createQuestionSet,
    updateQuestionSet,
    getQuestionSetByID,
    getQuestionSetByAID,
    getQuestionBySubmenu,
    getSubmenuByMenu,
    payment,
    paymentConform,
    addRsponse,
    getMailByID,
    getResult,
    getNotification,
    clearAll

};


function addRsponse(data) {
    return fetchWrapper.post(`${baseUrl}/Response/addResponse`, data);
}

function payment(data) {
    return fetchWrapper.post(`${baseUrl}/payment/pay`, data);
}
function paymentConform(data) {
    return fetchWrapper.post(`${baseUrl}/payment/confirmPayment`, data);
}

function createQuestion(data) {
    return fetchWrapper.post(`${baseUrl}/question/addQuestion`, data);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/question/updateQuestion/${id}`, params);
}

function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/question/deleteQuestion/${id}`);
}

function getAllQuestion(id) {
    return fetchWrapper.get(`${baseUrl}/question/getquestion/${id}`);
}
function getNotification(id) {
    return fetchWrapper.get(`${baseUrl}/notification/getNotification?id=${id}`);
}
function clearAll(id) {
    return fetchWrapper.delete(`${baseUrl}/notification/deleteNotification?id=${id}`);
}


function getAllQuestionSet() {
    return fetchWrapper.get(`${baseUrl}/QuestionSet/getQuestionSet`);
}
function deleteQuestionSet(id) {
    return fetchWrapper.delete(`${baseUrl}/QuestionSet/deleteQuestionSet/${id}`);
}
function createQuestionSet(data) {
    return fetchWrapper.post(`${baseUrl}/QuestionSet/addQuestionSet`, data);
}
function updateQuestionSet(id, params) {
    return fetchWrapper.put(`${baseUrl}/QuestionSet/updateQuestionSet/${id}`, params);
}
function getQuestionSetByID(id, params) {
    return fetchWrapper.get(`${baseUrl}/QuestionSet/getQuestionSetById/${id}`, params);
}
function getResult(email, params) {
    return fetchWrapper.get(`${baseUrl}/admin/getUserDetails?email=${email}`, params);
}
function getMailByID(id, params) {
    return fetchWrapper.get(`${baseUrl}/admin/getUserDetails?id=${id}`, params);
}
function getQuestionSetByAID(id, params) {
    return fetchWrapper.get(`${baseUrl}/QuestionSet/getQuestionSetByAid/${id}`, params);
}
function getQuestionBySubmenu(data) {
    return fetchWrapper.post(`${baseUrl}/question/getQuestionBySubmenu`, data);
}
function getSubmenuByMenu(data) {
    return fetchWrapper.post(`${baseUrl}/submenu/getSubmenuByMenu`, data);
}



