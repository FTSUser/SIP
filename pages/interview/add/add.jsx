import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { alertService, menuService } from "services";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import useFullPageLoader from "components/hooks/useFullPageLoader";
import router, { useRouter } from "next/router";
import S3 from "react-aws-s3";

const Add = ({ onClose, getData, id }) => {
  const [isAddMode, setIsAddMode] = useState(true);
  useEffect(() => {
    setIsAddMode(id ? true : false);
  }, [id]);

  const myCourses = [
    {
      name: "",

      description: [
        {
          description: "",
        },
      ],
    },
  ];

  const [courses, setCourses] = useState(id ? id?.guide : [...myCourses]);

  const [open, setOpen] = useState(true);
  const { query } = useRouter();
  const [sDate, setSDate] = useState(new Date());
  const [eDate, setEDate] = useState(new Date());
  const [inputValue, setinputValue] = useState({});
  const [images, setImage] = useState(isAddMode ? id?.image : "");
  const [selectedDate, handleDateChange] = useState(new Date());
  // const [points, setPoints] = useState(0);
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const [addErrors, setAddErrors] = useState({});
 

 
  const addCourse = () => {
    setCourses((prevState) => {
      const initialCourse = {
        name: "",

        description: [
          {
            description: "",
          },
        ],
      };

      return [...prevState, initialCourse];
    });
  };

  const addVideo = (courseId) => {
    if (courseId !== -1) {
      courses[courseId].description.push({
        description: "",
      });
      setCourses([...courses]);
    }
  };

  const handleCourseChange = (courseId, value, name) => {
    setCourses((prevState) => {
      const course = prevState[courseId];
      course[name] = value;

      return [...prevState];
    });
  };

  const handleVideo = (videoId, courseId, value, name) => {
    setCourses((prevState) => {
      const course = prevState[courseId];
      const video = course.description[videoId];
      video[name] = value;
      return [...prevState];
    });
  };

  const removeVideos = (videoId, courseId) => {
   

    setCourses((prevState) => {
      const course = prevState[courseId];
      const videos = course.description.filter((video, i) => i != videoId);
      course.description = videos;
      return [...prevState];
    });
  };

  const removeCourse = (courseId) => {
    setCourses((prevState) => {
      const newCourses = prevState.filter((course, i) => i != courseId);
      return [...newCourses];
    });
  };

  const handleOnChnage = (e) => {
    const { name, value } = e.target;
    setinputValue({ ...inputValue, [name]: value });
  };

  const validateAddForm = () => {
    let formIsValid = true;
    const formErrors = {};
    if (courses.length === 0) {
      hideLoader();
      formIsValid = false;
      alertService.error("*Please Enter at least one guide here!", {
        keepAfterRouteChange: true,
      });
      // formErrors["courses"] = "*Please Enter at least one quiz here!";
    }
    setAddErrors(formErrors);
    return formIsValid;
  };

  //for edit quiz validation
  const validateForm = () => {
    let formIsValid = true;
    const formErrors = {};
    if (editQuiz.length === 0) {
      formIsValid = false;
      formErrors["editQuiz"] = "*Please Enter at least one quiz here!";
      showLoader();
    }
    setErrors(formErrors);
    return formIsValid;
  };
  const handleChangeImage = (e) => {
    if (e.target.files[0]) {
      uploadS3bucket(e.target.files[0]);
    } else {
      alertService.error("Please upload image", {
        keepAfterRouteChange: true,
      });
    }
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
  const handleAddQuiz = async () => {
    if (validateAddForm()) {
      showLoader();

      if (!inputValue) {
        alertService.success("Please enter inputValue", {
          keepAfterRouteChange: true,
        });

        hideLoader();
        return false;
      }

      for (let i = 0; i < courses.length; i++) {
        if (!images) {
          alertService.error("Please upload image", {
            keepAfterRouteChange: true,
          });

          // toast.error("Please enter courses");
          hideLoader();
          return false;
        }
        if (!courses[i].name) {
          alertService.error("Please enter name", {
            keepAfterRouteChange: true,
          });

          // toast.error("Please enter courses");
          hideLoader();
          return false;
        } else if (courses[i].description.length === 0) {
          alertService.error("description can not be null", {
            keepAfterRouteChange: true,
          });

          // toast.error("description can not be null");
          hideLoader();
          return false;
        }

        for (let j = 0; j < courses[i].description.length; j++) {
          if (!courses[i].description[j].description) {
            alertService.error("Please enter description", {
              keepAfterRouteChange: true,
            });

            // toast.error("");
            hideLoader();
            return false;
          }
        }
      }

      let Body = {
        image: images,
        guide: courses,
        icid: query?.id,
      };

      if (id) {
        menuService
          .updateGuide(id?._id, Body)
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
          .createGuide(Body)
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

  return (
    <Modal
      show={open}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      className="test-model"
    >
      <div className="paddin">
      <Modal.Header closeButton>
        {!isAddMode ? (
          <Modal.Title>Add Guide</Modal.Title>
        ) : (
          <Modal.Title>Edit Guide</Modal.Title>
        )}
      </Modal.Header>
      </div>
      <Modal.Body id="add-contact-modal">
        {loader}
        <div className="raw App title-text-style">
          <div className="button-text-alignment">
            <label>Image:</label>
            <div className="input-grid-items">
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
                  <img src={images} className="img-fluid pt5" alt="" />
                </>
              )}
            </div>
            <button className="btn btn-primary m-3" onClick={addCourse}>
              +
            </button>
          </div>

          {courses.map((course, i) => {
            return (
              <RenderCourse
                course={course}
                key={i}
                handleCourseChange={handleCourseChange}
                addVideo={addVideo}
                handleVideo={handleVideo}
                removeVideos={removeVideos}
                removeCourse={removeCourse}
                courseId={i}
              />
            );
          })}
        </div>

        <button
          onClick={() => {
            handleAddQuiz();
          }}
          className="btn btn-primary m-3"
        >
          <span>{isAddMode ? "Update Guide" : "Add Guide"}</span>
        </button>
      </Modal.Body>
    </Modal>
  );
};

const RenderCourse = ({
  course,
  courseId,
  addVideo,
  handleCourseChange,
  handleVideo,
  removeVideos,
  removeCourse,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    handleCourseChange(courseId, value, name);
  };

  return (
    <>
      <div className="card-des">
        <div
          className="input-grid"
          style={{ display: "flex", alignItems: "end" }}
        >
          <div className="input-grid-items">
            <label htmlFor="">Enter Title</label>
            <input
              className="form-control"
              name="name"
              placeholder="Enter title"
              value={course.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-grid-items">
            <button
              className="btn btn-primary m-2"
              style={{ width: "max-content" }}
              onClick={() => removeCourse(courseId)}
            >
              Remove
            </button>
          </div>
          {/* <div className="btn-box"> */}

          {/* </div> */}

          <div className="add-option-button">
            <button
              className="btn btn-primary m-2"
              style={{ width: "max-content" }}
              onClick={() => addVideo(courseId)}
            >
              Add Option
            </button>
          </div>
        </div>
        <div>
          {course.description &&
            course.description.map((video, i) => {
              return (
                <Video
                  video={video}
                  key={i}
                  videoId={i}
                  addVideo={addVideo}
                  courseId={courseId}
                  handleVideo={handleVideo}
                  removeVideos={removeVideos}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

const Video = ({
  video,
  videoId,
  addVideo,
  courseId,
  handleVideo,
  removeVideos,
}) => {
  const handleChange = async (e) => {
    const { value, name } = e.target;

    handleVideo(videoId, courseId, value, name);
  };

  return (
    <div className="input-grid1">
      <div className="input-grid-items">
        <label htmlFor="">Enter Description</label>
        <textarea
          name="description"
          className="form-control"
          placeholder="Enter description"
          value={video.description}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="input-grid-items">
        <div
          className="close-des"
          onClick={() => removeVideos(videoId, courseId)}
        >
          X
        </div>
      </div>
    </div>
  );
};

export default Add;
