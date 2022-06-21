import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { alertService, questionService, menuService } from "services";
import Modal from "react-bootstrap/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import router, { useRouter } from "next/router";
import Styles from "../Question/questionSet.module.scss";
import classNames from "classnames";

const Result = ({ onClose, id }) => {
  const [inputs, setInputs] = useState({ name: "", price: "" });
  const [open, setOpen] = useState(true);
  const [isCheckList, setCheckList] = useState(false);
  const [isSubMenuList, setSubMenuList] = useState(false);
  const [isQuestionList, setQuestionList] = useState(false);

  const [comments, setComments] = useState([]);
  const [getIdData, setIDData] = useState([]);

  const [subMenuData, setSubMenuDataState] = useState([]);
  const [questionData, setQuestionState] = useState([]);
  const [questionDataList, setQuestionStateList] = useState([]);

  const [isAddMode, setIsAddMode] = useState(true);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [roleState, setroleset] = useState();
  const role = JSON.parse(localStorage.getItem("user"))?.payload?.admin;
  const [localData, setRole] = useState(role);
  const updateFormValue = ({ target: { name, value } }) =>
    setInputs((inputObj) => ({ ...inputObj, [name]: value }));
  const [menuCheck, setMenucheck] = useState([]);

 

  return (
    <>
      <Modal
        show={open}
        onHide={onClose}
        backdrop="static"
        keyboard={false}
        className={
          window.location.pathname === "/question/sendMailUser" && "pathNames"
        }
      >
        <Modal.Header closeButton>
          {!isAddMode ? (
            <Modal.Title>Add Question Set</Modal.Title>
          ) : (
            <Modal.Title>View Result</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body id="add-contact-modal">
          <div className="card">
            <div className="d-flex">
              <div className="name pr-3">Name:</div>
              <div className="name">{id?.name}</div>
            </div>
            <div className="d-flex">
              <div className="name pr-3">Score:</div>
              <div className="name">{id?.Score}</div>
            </div>
            <div className="row">
              {id?.ListofQA?.map((data, key) => (
                <div className="col-md-4 mb-3">
                  <div className="d-flex">
                    <div>
                      {key + 1}
                      {`)`}
                    </div>
                    <div>{data?.Question}</div>
                  </div>
                  {data?.Option?.map((data1, key) => (
                    <>
                      <div className="d-flex">
                        <div>
                          {data?.Answer?.findIndex((e) => e === data1?.no) !==
                          -1 ? (
                            <div>
                              {data1?.istrue ? (
                                <div className={Styles.green}>
                                  {data1?.no}{`)`} {data1?.name}
                                </div>
                              ) : (
                                <div className={Styles.red}>{data1?.no}{`)`} {data1?.name}</div>
                              )}
                            </div>
                          ) : (
                            <div>{data1?.no}{`)`} {data1?.name} </div>
                          )}
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} type="button" className="btn btn-secondary">
            Cancel
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Result;
