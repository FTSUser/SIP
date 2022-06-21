import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from "services";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/v1`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const menuService = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value },
    getById,
    update,
    delete: _delete,
    getAllMenu,
    createMenu,
    createSubMenu,
    getAllSubMenu,
    updateSubMenu,
    deleteSubMenu,
    contact,
    getAllMenuByID,
    getAllResponse,
    getAllResponseAdmin,
    viewResponse,
    deleteResponse,
    getAllThankyouByID,
    addThankyou,
    updatehankYou,
    deleteThankyou,
    getAllinstruction,
    deleteinstruction,
    updateinstruction,
    addinstruction,
    deleteGuide,
    updateGuide,
    createGuide,
    getAllGuide,
    getAllGuideCategory,
    deleteGuideCategory,
    updateGuideCategory,
    createGuideCategory,
    getAllSubMenuByID,
    getAllSubMenuApprove


};

function getAllThankyouByID(id) {
    return fetchWrapper.get(`${baseUrl}/thankyou/getThankByAid/${id}`);
}
function addThankyou(data) {
    return fetchWrapper.post(`${baseUrl}/thankyou/addThank`, data);
}
function updatehankYou(id, params) {
    return fetchWrapper.put(`${baseUrl}/thankyou/updateThank/${id}`, params);
}
function deleteThankyou(id) {
    return fetchWrapper.delete(`${baseUrl}/thankyou/deleteThank/${id}`);
}
function getAllinstruction(id) {
    return fetchWrapper.get(`${baseUrl}/instruction/getInstructionByAid/${id}`);
}
function addinstruction(data) {
    return fetchWrapper.post(`${baseUrl}/instruction/addInstruction`, data);
}
function updateinstruction(id, params) {
    return fetchWrapper.put(`${baseUrl}/instruction/updateInstruction/${id}`, params);
}
function deleteinstruction(id) {
    return fetchWrapper.delete(`${baseUrl}/instruction/deleteInstruction/${id}`);
}




function contact(data) {
    return fetchWrapper.post(`${baseUrl}/contactus/addContactusadmin`, data);
}
function createMenu(data) {
    return fetchWrapper.post(`${baseUrl}/menu/addMenu`, data);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/menu/updateMenu/${id}`, params);
}


function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/menu/deleteMenu/${id}`);
}
function deleteResponse(id) {
    return fetchWrapper.delete(`${baseUrl}/Response/deleteResponse/${id}`);
}


function getAllMenu() {
    return fetchWrapper.get(`${baseUrl}/menu/getMenu/`);
}
function getAllMenuByID(id) {
    return fetchWrapper.get(`${baseUrl}/menu/getMenu/?id=${id}`);
}
function getAllSubMenuByID(id) {
    return fetchWrapper.get(`${baseUrl}/submenu/getPurchaseSubmenu?id=${id}`);
}

function getAllSubMenu(id) {
    return fetchWrapper.get(`${baseUrl}/submenu/getAllSubMenu/${id}`);
}
function getAllSubMenuApprove(id) {  
    return fetchWrapper.post(`${baseUrl}/submenu/getPurchaseSubmenuByMenu?aid=${id?.id}`,{mid:id?.menuid});
}
function createSubMenu(data) {
    return fetchWrapper.post(`${baseUrl}/submenu/addSubMenu`, data);
}


function updateSubMenu(id, params) {
    return fetchWrapper.put(`${baseUrl}/submenu/updateSubMenu/${id}`, params);
}

function deleteSubMenu(id) {
    return fetchWrapper.delete(`${baseUrl}/submenu/deleteSubMenu/${id}`);
}

function getAllResponse() {
    return fetchWrapper.get(`${baseUrl}/Response/getResponse`);
}
function getAllResponseAdmin(id) {
    return fetchWrapper.get(`${baseUrl}/Response/getExamDoneUser?Aid=${id}`);
}
function viewResponse(id) {
    return fetchWrapper.get(`${baseUrl}/Response/getResponseById/${id}`);
}


function getAllGuide(id) {
    return fetchWrapper.get(`${baseUrl}/interviewGuide/get-guide-by-category/${id}`);
}
function createGuide(data) {
    return fetchWrapper.post(`${baseUrl}/interviewGuide/addinterviewGuide`, data);
}

function updateGuide(id, params) {
    return fetchWrapper.put(`${baseUrl}/interviewGuide/updateinterviewGuide/${id}`, params);
}

function deleteGuide(id) {
    return fetchWrapper.delete(`${baseUrl}/interviewGuide/deleteinterviewGuide/${id}`);
}
function getAllGuideCategory() {

    return fetchWrapper.get(`${baseUrl}/interviewCategory/getAllinterviewCategory`);
}
function createGuideCategory(data) {
    return fetchWrapper.post(`${baseUrl}/interviewCategory/addinterviewCategory`, data);
}

function updateGuideCategory(id, params) {
    return fetchWrapper.put(`${baseUrl}/interviewCategory/updateinterviewCategory/${id}`, params);
}

function deleteGuideCategory(id) {
    return fetchWrapper.delete(`${baseUrl}/interviewCategory/deleteinterviewCategory/${id}`);
}