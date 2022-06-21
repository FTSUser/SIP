import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { alertService, questionService } from "services";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import router, { useRouter } from "next/router";

const AddQuestion = ({ onClose, getData, id }) => {
  const [inputs, setInputs] = useState({ Qname: "", type: "" });
  const [open, setOpen] = useState(true);
  const [isAddMode, setIsAddMode] = useState(true);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const updateFormValue = ({ target: { name, value } }) =>
    setInputs((inputObj) => ({ ...inputObj, [name]: value }));

  useEffect(() => {
    if (id) {
      if (id.type === "mcq") {
        setMcqCheck(true);
      } else if (id.type == "checkbox") {
        setCheckBoxCheck(true);
      }
      setOption(id.Option);
    }
    setIsAddMode(id ? true : false);
  }, [id]);
  // form validation rules
  const validationSchema = Yup.object().shape({
    // Qname: Yup.string().required(" Name is required"),
    Qname: Yup.string().strict(true).required(" Name is required").matches(/^\S.*$/gm, '* This field cannot contain only blankspaces'),
    type: Yup.string().required(" Type is required"),
  });
  const editvalidationSchema = Yup.object().shape({
    // Qname: Yup.string().required(" Name is required"),
    Qname: Yup.string().strict(true).required(" Name is required").matches(/^\S.*$/gm, '* This field cannot contain only blankspaces'),
    type: Yup.string().required(" Type is required"),
  });
  const formOptions = {
    resolver: isAddMode
      ? yupResolver(editvalidationSchema)
      : yupResolver(validationSchema),
  };

  // set default form values if in edit mode
  if (isAddMode) {
    formOptions.defaultValues = id;
  }
  const { query } = useRouter();
  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(data) {
    return !isAddMode ? createUser(data) : updateUser(id?._id, data);
  }

  function createUser(data) {
    data = {
      Sid: query.id,
      Qname: data.Qname,
      type: data.type,
      Option: option,
    };
    let filter = option.filter((e) => e.istrue === true);
    if (filter.length) {
      return questionService
        .createQuestion(data)
        .then(() => {
          alertService.success(data.message, { keepAfterRouteChange: true });
          setOpen(false);
          getData();
        })
        .catch(alertService.error);
    } else {
      alertService.error(`Please select any one ${data.type}`);
    }
  }

  function updateUser(id, data) {
    data = {
      Sid: query.id,
      Qname: data.Qname,
      type: data.type,
      Option: option,
    };
    let filter = option.filter((e) => e.istrue === true);
    if (filter.length) {
      return questionService
        .update(id, data)
        .then((response) => {
          alertService.success(response.message, {
            keepAfterRouteChange: true,
          });
          setOpen(false);
          getData();
        })
        .catch(alertService.error);
    } else {
      alertService.error(`Please select any one ${data.type}`);
    }
  }
  const [mcqCheck, setMcqCheck] = useState(false);
  const [checkBoxCheck, setCheckBoxCheck] = useState(false);

  function typeChanges(e) {
    if (e.target.value == "mcq") {
      setMcqCheck(true);
      setCheckBoxCheck(false);
    } else {
      setCheckBoxCheck(true);
      setMcqCheck(false);
    }
  }

  const [option, setOption] = useState([
    {
      no: "1",
      name: "",
      istrue: false,
    },
    {
      no: "2",
      name: "",
      istrue: false,
    },
    {
      no: "3",
      name: "",
      istrue: false,
    },
    {
      no: "4",
      name: "",
      istrue: false,
    },
  ]);
  const handleQuestion = (data, index) => {
    let list = [...option];
    let i = index;
    let type = data.target.type;
    let value;
    if (type === "radio") {
      value = data.target.value === "on" ? true : false;
    } else {
      value = data.target.value;
    }
    if (i === 0) {
      if (type === "radio") {
        list[i].istrue = value;
        list.map((item, index) => {
          if (index !== i) {
            list[index].istrue = !value;
          }
        });
      } else if (type === "text") {
        list[index].name = value;
      }
    } else if (i === 1) {
      if (type === "radio") {
        list[i].istrue = value;
        list.map((item, index) => {
          if (index !== i) {
            list[index].istrue = !value;
          }
        });
      } else if (type === "text") {
        list[i].name = value;
      }
    } else if (i === 2) {
      if (type === "radio") {
        list[i].istrue = value;
        list.map((item, index) => {
          if (index !== i) {
            list[index].istrue = !value;
          }
        });
      } else if (type === "text") {
        list[i].name = value;
      }
    } else if (i === 3) {
      if (type === "radio") {
        list[i].istrue = value;
        list.map((item, index) => {
          if (index !== i) {
            list[index].istrue = !value;
          }
        });
      } else if (type === "text") {
        list[i].name = value;
      }
    } else {
      setOption(option);
    }
    setOption(list);
  };
  const handleQuestionCheckBox = (data, index) => {
    let list = [...option];
    let i = index + 1;
    let type = data.target.type;

    let value;
    if (type === "checkbox") {
      value = data.target.value === "on" ? true : false;
    } else {
      value = data.target.value;
    }

    if (i === 1) {
      if (type === "checkbox") {
        list[i - 1].istrue = !list[i - 1].istrue;
      } else if (type === "text") {
        list[i - 1].name = value;
      }
    } else if (i === 2) {
      if (type === "checkbox") {
        list[i - 1].istrue = !list[i - 1].istrue;
      } else if (type === "text") {
        list[i - 1].name = value;
      }
    } else if (i === 3) {
      if (type === "checkbox") {
        list[i - 1].istrue = !list[i - 1].istrue;
      } else if (type === "text") {
        list[i - 1].name = value;
      }
    } else if (i === 4) {
      if (type === "checkbox") {
        list[i - 1].istrue = !list[i - 1].istrue;
      } else if (type === "text") {
        list[i - 1].name = value;
      }
    } else {
      setOption(option);
    }
    setOption(list);
  };
  return (
    <>
      <Modal show={open} onHide={onClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          {!isAddMode ? (
            <Modal.Title>Add Question</Modal.Title>
          ) : (
            <Modal.Title>Edit Question</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body id="add-contact-modal">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="">
              <div className="form-group ">
                <label> Name</label>
                <input
                  name="Qname"
                  type="text"
                  {...register("Qname")}
                  className={`form-control ${errors.Qname ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.Qname?.message}</div>
              </div>
              <div className="form-group ">
                <label> Type</label>
                <select
                  name="type"
                  type="text"
                  {...register("type")}
                  className={`form-control ${errors.type ? "is-invalid" : ""}`}
                  onChange={(e) => typeChanges(e)}
                >
                  <option selected disabled value="">
                    Type
                  </option>
                  <option value="mcq">MCQ</option>
                  <option value="checkbox">Check Box</option>
                </select>

                <div className="invalid-feedback">{errors.type?.message}</div>
              </div>
              <div>
                {mcqCheck && (
                  <>
                    {isAddMode
                      ? option.map((data, index) => {
                          return (
                            <div
                              className="form-group d-flex align-items-center"
                              key={index}
                            >
                              <input
                                className={`mr-3 ${
                                  errors.type ? "is-invalid" : ""
                                }`}
                                type="radio"
                                name="radio"
                                id="radio"
                                defaultChecked={data.istrue}
                                onChange={(e) => handleQuestion(e, index)}
                              />
                              <input
                                className="form-control"
                                type="text"
                                value={data.name}
                                onChange={(e) => handleQuestion(e, index)}
                                required
                              />
                            </div>
                          );
                        })
                      : [0, 1, 2, 3].map((data, index) => {
                          return (
                            <div
                              className="form-group d-flex align-items-center"
                              key={index}
                            >
                              <input
                                className="mr-3"
                                type="radio"
                                name="radio"
                                id="radio"
                                checked={data.istrue}
                                // defaultChecked={data.istrue}
                                onChange={(e) => handleQuestion(e, index)}
                              />
                              <input
                                className="form-control"
                                type="text"
                                onChange={(e) => handleQuestion(e, index)}
                                required
                              />
                            </div>
                          );
                        })}
                  </>
                )}

                {checkBoxCheck && (
                  <>
                    {isAddMode
                      ? option.map((data, index) => {
                          return (
                            <div
                              className="form-group d-flex align-items-center"
                              key={index}
                            >
                              <input
                                className="mr-3"
                                type="checkbox"
                                defaultChecked={data.istrue}
                                onChange={(e) =>
                                  handleQuestionCheckBox(e, index)
                                }
                              />
                              <input
                                className="form-control"
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                  handleQuestionCheckBox(e, index)
                                }
                                required
                              />
                            </div>
                          );
                        })
                      : [0, 1, 2, 3].map((data, index) => {
                          return (
                            <div
                              className="form-group d-flex align-items-center"
                              key={index}
                            >
                              <input
                                className="mr-3"
                                type="checkbox"
                                onChange={(e) =>
                                  handleQuestionCheckBox(e, index)
                                }
                              />
                              <input
                                className="form-control"
                                type="text"
                                onChange={(e) =>
                                  handleQuestionCheckBox(e, index)
                                }
                                required
                              />
                            </div>
                          );
                        })}
                  </>
                )}
              </div>
            </div>

            <div className="form-group">
              <button
                type="submit"
                disabled={formState.isSubmitting}
                className="btn btn-primary mr-2"
              >
                {formState.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Save
              </button>

              <button
                onClick={onClose}
                type="button"
                disabled={formState.isSubmitting}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddQuestion;
