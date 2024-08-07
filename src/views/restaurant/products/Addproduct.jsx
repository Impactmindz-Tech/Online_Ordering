import { useState, useContext, useEffect } from "react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import "./Product.css";

import CIcon from "@coreui/icons-react";
import { cilCheckCircle, cilWarning } from "@coreui/icons";
import { useTranslation } from "react-i18next";
import "../../../i18n.js";
import camera from "../../../assets/images/camera.png";
import { setInLocalStorage } from "../../../utils/LocalStorageUtills.js";
import {
  CFormInput,
  CButton,
  CRow,
  CCol,
  CFormSelect,
  CFormTextarea,
  CAlert,
  CCloseButton,
} from "@coreui/react";

export default function Addproduct() {
  const { getmeal, saveproduct, allcategorie, alert, setAlert } = useContext(OnlineContext);
  const [file, setFile] = useState(null);
  const [hebrewState, setHebrewState] = useState(false);

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage || "en");
  const [editLanguage, setEditLanguage] = useState(currentLanguage || "en");
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

  const filteredCategories = allcategorie.filter((item) => item.Category.en === formData.meal);

  const handleSubmit = async () => {
    await saveproduct(file, formData);
    console.log(formData);
  };

  useEffect(() => {
    setHebrewState(currentLanguage === 'he');
  }, [currentLanguage]);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setHebrewState(selectedLang === 'he');
    setSelectedLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
  };

  return (
    <>
      <div className={`row justify-content-center ${hebrewState ? 'rtl' : ''}`}>
        <div className="col-lg-4">
          {alert.show && alert.visible && (
            <CAlert color={alert.type} className="d-flex align-items-center">
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
      <div className={`row justify-content-center ${hebrewState ? 'rtl' : ''}`}>
        <div className="col-lg-2">
          <div className="image_preview">
            {file ? (
              <img src={file} alt="Image Preview" />
            ) : (
              <img src={camera} alt="Image Preview" />
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
      <div className={`row justify-content-center ${hebrewState ? 'rtl' : ''}`}>
        <div className="col-lg-7">
          <CRow>
            <CCol xs>
              <label className="mb-2" htmlFor="languageSelect">
                {t("selectLanguage")}
              </label>
              <CFormSelect
                id="languageSelect"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                <option value="en">English</option>
                <option value="ru">Русский</option>
                <option value="he">עברית</option>
              </CFormSelect>
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor={`dishName_${selectedLanguage}`}>
                {t("dishName")} ({selectedLanguage.toUpperCase()})
              </label>
              <CFormInput
                placeholder={`${t("dishName")} (${selectedLanguage.toUpperCase()})`}
                name={`dishName_${selectedLanguage}`}
                value={formData.dishName[selectedLanguage]}
                onChange={handleChange}
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs>
              <label className="mb-2" htmlFor="meal">
                {t("chooseMeal")}
              </label>
              <CFormSelect
                name="meal"
                value={formData.meal}
                onChange={handleChange}
              >
                <option value="">{t("chooseMeal")}</option>
                {getmeal.map((item) => (
                  <option key={item.id} value={item.Name.en}>
                    {item.Name.en}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="category">
                {t("chooseCategory")}
              </label>
              <CFormSelect
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">{t("chooseCategory")}</option>
                {filteredCategories.map((item) => (
                  <option key={item.id} value={item.Name.en}>
                    {item.Name.en}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol xs>
              <label className="mb-2" htmlFor="isAvailable">
                {t("isAvailable")}
              </label>
              <CFormSelect
                name="isAvailable"
                value={formData.isAvailable}
                onChange={handleChange}
              >
                <option value="">{t("chooseOne")}</option>
                <option value="true">{t("true")}</option>
                <option value="false">{t("false")}</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs>
              <label className="mb-2" htmlFor="dietaryInfo">
                {t("dietaryInfo")}
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
                {t("description")}
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
            {t("addProduct")}
          </CButton>
        </div>
      </div>
    </>
  );
}
