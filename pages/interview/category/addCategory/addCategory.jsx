import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { alertService, menuService } from "services";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import router from "next/router";
import S3 from "react-aws-s3";

const AddCategory = ({ onClose, getData, id }) => {
  const [inputs, setInputs] = useState({ name: "", price: "" });
  const [open, setOpen] = useState(true);
  const [isAddMode, setIsAddMode] = useState(true);
  const [inputValue, setinputValue] = useState({});
  const [images, setImage] = useState();
  const [addErrors, setAddErrors] = useState({});
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [roleState, setroleset] = useState();
  const updateFormValue = ({ target: { name, value } }) =>
    setInputs((inputObj) => ({ ...inputObj, [name]: value }));

  useEffect(() => {
    setinputValue(id);
    setImage(id?.image);
    setIsAddMode(id ? true : false);
  }, [id]);
  const handleOnChnage = (e) => {
    const { name, value } = e.target;
    setinputValue({ ...inputValue, [name]: value });
  };

  const handleChangeImage = (e) => {
    uploadS3bucket(e.target.files[0]);
  };
  const uploadS3bucket = async (file) => {
    showLoader();

    let config = {
      bucketName: "honda-assets",
      region: "ap-south-1",
      accessKeyId: "AKIA46FSGXXRGREKPY4J",
      secretAccessKey: "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",
    };
    config = {
      ...config,
      dirName: "Cerificate",
      ACL: "public-read",
    };
    const Reacts3Client = new S3(config);
    let urls;
    let f = file;

    let filename = "AboutImage(" + new Date().getTime() + ")";
    let data = await Reacts3Client.uploadFile(f, filename);
    setImage(data?.location);
    hideLoader();
    try {
      if (data.status === 204) {
        urls = data.location;
        return urls;
      } else {
        toast.error("Failed to upload image:", f.name);
      }
    } catch (err) {}
  };
  const validateAddForm = () => {
    let formIsValid = true;
    const formErrors = {};

    setAddErrors(formErrors);
    return formIsValid;
  };
  const handleAddQuiz = async () => {
    if (validateAddForm()) {
      showLoader();
      if (!inputValue.name) {
        alertService.error("Please enter name", {
          keepAfterRouteChange: true,
        });

        hideLoader();
        return false;
      }
      if (!images) {
        alertService.error("Please upload image", {
          keepAfterRouteChange: true,
        });

        // toast.error("Please enter courses");
        hideLoader();
        return false;
      }

      let Body = {
        image: images,
        name: inputValue.name,
      };

      if (isAddMode) {
        
        menuService
          .updateGuideCategory(id?._id,Body)
          .then((res) => {
            hideLoader();
            alertService.success(res.message, {
              keepAfterRouteChange: true,
            });
            setOpen(false);
            getData();
          })
          .catch(alertService.error);
      } else {
        menuService
          .createGuideCategory(Body)
          .then((res) => {
            hideLoader();
            alertService.success(res.message, {
              keepAfterRouteChange: true,
            });
            setOpen(false);
            getData();
          })
          .catch(alertService.error);
      }
    }
  };

  // set default form values if in edit mode

  function updateUser(id, data) {
    return menuService
      .update(id, data)
      .then((response) => {
        alertService.success(response.message, { keepAfterRouteChange: true });
        setOpen(false);
        getData();
      })
      .catch(alertService.error);
  }

  return (
    <>
      <Modal show={open} onHide={onClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          {!isAddMode ? (
            <Modal.Title>Add Category</Modal.Title>
          ) : (
            <Modal.Title>Edit Category</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body id="add-contact-modal">
          <div>
            <div className="">
              <div className="form-group ">
                <label> Name</label>
                <input
                  name="name"
                  type="text"
                  value={inputValue?.name}
                  onChange={handleOnChnage}
                  className={`form-control `}
                />
                {/* <div className="invalid-feedback">{errors.name?.message}</div> */}
              </div>
              <div className="form-group ">
                <label>Image</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => handleChangeImage(e)}
                  className={`form-control `}
                />
                {images && (
                  <>
                    <img src={images} className="img-fluid" alt="" />
                  </>
                )}
              </div>
            </div>

            <div className="form-group">
              <button
                onClick={() => {
                  handleAddQuiz();
                }}
                className="btn btn-primary mr-2"
              >
                Save
              </button>

              <button
                onClick={onClose}
                type="button"
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddCategory;
