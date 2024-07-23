import { useState, useContext } from "react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import '../products/Product.css'
import {
  CFormInput,
  CButton,
  CRow,
  CCol,
  CFormSelect,
  CFormTextarea,
} from "@coreui/react";
import camera from "../../../assets/images/camera.png";

export default function Addproduct() {
  const { getcategory, storeImage } = useContext(OnlineContext);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    dishName: "",
    price: "",
    category: "",
    isAvailable: "",
    dietaryInfo: "",
    description: "",
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    const fileUrl = URL.createObjectURL(selectedFile);

    setFile(fileUrl);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    storeImage(file, formData);
  };

  return (
    <>
   
      <div className="row ">
        <div className="col-lg-4  ">
        <div className="image_preview me-auto ms-auto">
            {file ? (
              <img src={file} alt="Image Preview" />
            ) : (
              <img src={camera} alt="Image Preview" className="" />
            )}
          </div>
          <div className="mb-3 mt-5">
            <CFormInput type="file" id="formFile" onChange={handleFileChange} />
          </div>
        </div>
      </div>
   
    </>
  );
}
