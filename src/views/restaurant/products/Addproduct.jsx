import { useState, useContext, useEffect } from "react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import "./Product.css";
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
  const { getmeal, saveproduct, getcategory, allcategorie, getAllcategory ,alert ,setAlert} = useContext(OnlineContext);
  const [file, setFile] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const [formData, setFormData] = useState({
    dishName: { en: "", ru: "", he: "" },
    category: "",
    isAvailable: "",
    dietaryInfo: "",
    description: "",
    meal: "",
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const fileUrl = URL.createObjectURL(selectedFile);
    setFile(fileUrl);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('dishName_')) {
      const lang = name.split('_')[1];
      setFormData((prevState) => ({
        ...prevState,
        dishName: { ...prevState.dishName, [lang]: value },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const filteredCategories = allcategorie.filter((item) => item.Category === formData.meal);

  const handleSubmit = async () => {
    await saveproduct(file, formData);
    console.log(formData);
  };


  return (
    <>
          <div className="row justify-content-center">
        <div className="col-lg-4">
          {alert.show && alert.visible && (
            <CAlert color={alert.type} className="d-flex align-items-center ">
              <CIcon
                icon={alert.type === "success" ? cilCheckCircle : cilWarning}
                className="flex-shrink-0 me-2"
                width={24}
                height={24}
              />
              <div>{alert.message}</div>
              <CCloseButton
                className="ms-auto"
                onClick={() => setAlert({ ...alert, visible: false })}
              />
            </CAlert>
          )}
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-2">
          <div className="image_preview">
            {file ? (
              <img src={file} alt="Image Preview" />
            ) : (
              <img src={camera} alt="Image Preview" className="" />
            )}
          </div>
        </div>
      </div>
      <div className="row justify-content-center mt-5">
        <div className="col-lg-3">
          <div className="mb-3">
            <CFormInput type="file" id="formFile" onChange={handleFileChange} />
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <CRow>
            <CCol xs>
              <label className="mb-2" htmlFor="languageSelect">
                Select Language
              </label>
              <CFormSelect
                id="languageSelect"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="ru">Russian</option>
                <option value="he">Hebrew</option>
              </CFormSelect>
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor={`dishName_${selectedLanguage}`}>
                Dish Name ({selectedLanguage.toUpperCase()})
              </label>
              <CFormInput
                placeholder={`Dish Name (${selectedLanguage.toUpperCase()})`}
                name={`dishName_${selectedLanguage}`}
                value={formData.dishName[selectedLanguage]}
                onChange={handleChange}
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs>
              <label className="mb-2" htmlFor="meal">
                Choose Meal
              </label>
              <CFormSelect
                name="meal"
                value={formData.meal}
                onChange={handleChange}
              >
                <option value="">Choose Meal</option>
                {getmeal.map((item) => (
                  <option key={item.id} value={item.Name}>
                    {item.Name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="category">
                Choose Category
              </label>
              <CFormSelect
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Choose Category</option>
                {filteredCategories.map((item) => (
                  <option key={item.id} value={item.Name}>
                    {item.Name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="isAvailable">
                Is Available
              </label>
              <CFormSelect
                name="isAvailable"
                value={formData.isAvailable}
                onChange={handleChange}
              >
                <option value="">Choose One</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs>
              <label className="mb-2" htmlFor="dietaryInfo">
                Dietary Info
              </label>
              <CFormTextarea
                id="dietaryInfo"
                rows={3}
                name="dietaryInfo"
                value={formData.dietaryInfo}
                onChange={handleChange}
              ></CFormTextarea>
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="description">
                Description
              </label>
              <CFormTextarea
                id="description"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></CFormTextarea>
            </CCol>
          </CRow>
        </div>
        <div className="text-center">
          <CButton className="ps-4 pe-4 mt-4" color="primary" onClick={handleSubmit}>
            Add Product
          </CButton>
        </div>
      </div>
    </>
  );
}
