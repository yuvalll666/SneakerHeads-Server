import React, { useState } from "react";
import Dropzone from "react-dropzone";
import http from "../../services/httpService";
import { useToasts } from "react-toast-notifications";
import { localUrl, apiUrl } from "../../config.json";

/**
 * Component - FileUpload
 * @component
 * @param {Object} props - containes oldImages and updateImages
 */
function FileUpload(props) {
  const { addToast } = useToasts();
  const [images, setImages] = useState([]);
  let oldImages = props.oldImages;

  /**
   * Send request to server to add image file to /public/uploads dir
   * @param {Array.<Object>} files - Array of one image information
   */
  const onDrop = async (files) => {
    const formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    // Add the file to formData
    formData.append("file", files[0]);

    try {
      const { data } = await http.post(
        `${apiUrl}/products/uploadImage`,
        formData,
        config
      );
      // Add image from server to existing images
      setImages([...images, data.image]);
      // Pass images to father component
      props.updateImages([...images, data.image]);
    } catch (error) {
      if (error.response) {
        addToast("Faild to save the Image in the server", {
          appearance: "error",
        });
      }
    }
  };

  /**
   * Delete file on click (create product)
   * @param {String} image - Image File path
   */
  const handleDelete = (image) => {
    const currentIndex = images.indexOf(image);

    let newImages = [...images];
    // Remove image file from newImages Array
    newImages.splice(currentIndex, 1);
    setImages(newImages);

    // Pass images to father component
    props.updateImages(newImages);
  };

  /**
   * Delete file on click (update product)
   * @param {String} image - Image file path
   */
  const oldImageshandleDelete = (image) => {
    const currentIndex = images.indexOf(image);

    let newImages = [...oldImages];
    // Remove image file from newImages Array
    newImages.splice(currentIndex, 1);

    oldImages = newImages;
    props.updateImages(newImages);
  };

  return (
    <div className="container d-lg-flex justify-content-center">
      <div className="row justify-content-center">
        <div className="mr-4 mb-2 ">
          <Dropzone onDrop={onDrop} multiple={false} maxSize={800000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgrey",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <i className="fas fa-plus" style={{ fontSize: "4rem" }}></i>
              </div>
            )}
          </Dropzone>
        </div>

        <div
          className="ml-4"
          style={{
            display: "flex",
            width: "351px",
            height: "241px",
            overflowX: "auto",
            overflowY: "hidden",
            border: "1px solid lightgrey",
          }}
        >
          {images.map((image, index) => (
            <div onClick={() => handleDelete(image)} key={index}>
              <img
                style={{ minWidth: "300px", width: "300px", height: "240px" }}
                src={`${localUrl}/${image}`}
                alt={`productImg-${index}`}
              />
            </div>
          ))}

          {props.oldImages &&
            props.oldImages.map((image, index) => (
              <div onClick={() => oldImageshandleDelete(image)} key={index}>
                <img
                  style={{ minWidth: "300px", width: "300px", height: "240px" }}
                  src={`${localUrl}/${image}`}
                  alt={`productImg-${index}`}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
