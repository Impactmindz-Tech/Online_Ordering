import React, { useContext, useState, useEffect } from "react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import "./category.css";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "react-modal";
import { CAlert } from "@coreui/react";
import { useTranslation } from "react-i18next";
import "../../../i18n.js";
import { setInLocalStorage } from "../../../utils/LocalStorageUtills.js";
import CIcon from "@coreui/icons-react";
import { cilCheckCircle, cilWarning } from "@coreui/icons";
import {
  CForm,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCol,
  CCloseButton,
  CFormSelect,
} from "@coreui/react";
Modal.setAppElement("#root");

export default function Category() {
  const [hebrewState, setHebrewState] = useState(false);
  const { t, i18n } = useTranslation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState({ en: "", he: "", ru: "" });
  const [file, setFile] = useState(null);
  const [previousImage, setPreviousImage] = useState("");
  const [id, setId] = useState("");
  const [edit, setEdit] = useState({
    id: "",
    Name: { en: "", he: "", ru: "" },
  });
  const currentLanguage = i18n.language;
  const [language, setLanguage] = useState(currentLanguage);
  const {
    getmeal,
    getAllcategory,
    deletedoc,
    storecateImage,
    updateImage,
    alert,
    setAlert,
  } = useContext(OnlineContext);

  const openModal = (imageUrl) => {
    setCurrentImage(imageUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentImage("");
  };

  const handleSubmit = () => {
    if (!file || !category.en) {
      console.log("Please fill the meal name and select the image");
    } else {
      storecateImage(file, category);
      getAllcategory();
    }
  };

  const handleDelete = (id) => {
    let findid = getmeal.find((item) => item.id === id);
    let imagepath = findid.ImageUrl;
    deletedoc(id, imagepath);
    getAllcategory();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdit((prev) => ({
      ...prev,
      Name: { ...prev.Name, [name]: value },
    }));
  };

  const handleUpdate = () => {
    setVisible(false);
    if (file) {
      updateImage(id, edit.Name, file);
    } else {
      updateImage(id, edit.Name, previousImage);
    }
    getAllcategory();
  };

  const handleEdit = (id) => {
    setVisible(true);
    let findid = getmeal.find((item) => item.id === id);
    setEdit({
      id,
      Name: { en: findid.Name.en, he: findid.Name.he, ru: findid.Name.ru },
    });
    setPreviousImage(findid.ImageUrl);
    setId(id);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const fileUrl = URL.createObjectURL(selectedFile);
    setFile(fileUrl);
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setHebrewState(selectedLang === "he");
    setLanguage(selectedLang);
    setInLocalStorage("lang", selectedLang);
    i18n.changeLanguage(selectedLang);
  };

  useEffect(() => {
    getAllcategory();
    setHebrewState(currentLanguage === "he");
  }, [getAllcategory, currentLanguage]);

  return (
    <section>
      <div className="row justify-content-center">
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

      <div className="row align-items-center">
        <div className="col-lg-4">
          <div className="mb-4">
            <h3 className={` ${hebrewState ? "rtl" : "text-center"}`}>
              {t("addMeal")}
            </h3>
          </div>

          {/* language */}
          <div>
            <CCol xs>
              <CFormInput type="file" id="formFile" onChange={handleFileChange} />
            </CCol>
          </div>

          <div className="row align-items-center mt-4">
            <div className="col-lg-6">
              <div
                className={`align-items-center gap-3 ${
                  hebrewState ? "rtl" : "text-center"
                }`}
              >
                <label htmlFor="">{t("selectLang")}</label>
                <CFormSelect
                  value={language}
                  onChange={handleLanguageChange}
                  className={`width select box mt-3 ${
                    hebrewState ? "rtl" : ""
                  }`}
                >
                  <option value="en">English</option>
                  <option value="he">עִברִית</option>
                  <option value="ru">Русский</option>
                </CFormSelect>
              </div>
            </div>

            <div className="col-lg-6 mt-4 pt-3">
              <div>
                <CCol xs>
                  <CFormInput
                    name={language}
                    placeholder={`${t("enterMealNameInput")}`}
                    aria-label="Meal Name"
                    className={`${hebrewState ? "rtl text-end" : "text-left"}`}
                    value={category[language]}
                    onChange={(e) =>
                      setCategory({ ...category, [language]: e.target.value })
                    }
                  />
                </CCol>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <CButton
              className={`w-100 ${hebrewState ? "rtl text-end" : "text-left"}`}
              color="primary"
              onClick={handleSubmit}
            >
              {t("addMealBtn")}
            </CButton>
          </div>
        </div>

        <div className="category_list mt-lg-5 col-lg-8">
          <div className={`${hebrewState ? "rtl" : "text-center"} mb-3`}>
            <h3>{t("allMealTitle")}</h3>
          </div>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" className="ps-4">
                  Image
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-center">
                  Name
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end pe-5">
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {getmeal.map((item) => (
                <CTableRow key={item.id}>
                  <CTableDataCell className="categoryImage ps-4">
                    <img src={item.ImageUrl} alt="meal image" />
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    {item.Name[language]}
                  </CTableDataCell>
                  <CTableDataCell className="text-end pe-4">
                    <CButton onClick={() => handleEdit(item.id)}>
                      <ModeEditIcon />
                    </CButton>
                    <CButton onClick={() => handleDelete(item.id)}>
                      <DeleteIcon style={{ color: "#dd0000" }} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <div className="popup">
            <CModal
              className="custom_modal"
              alignment="center"
              backdrop="static"
              visible={visible}
              onClose={() => setVisible(false)}
              aria-labelledby="StaticBackdropExampleLabel"
            >
              <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">
                  Edit Meal
                </CModalTitle>
              </CModalHeader>
              <CModalBody>
                <div className="gap-2">
                  <CCol xs>
                    <label htmlFor="" className="mb-2">
                      Image
                    </label>
                    <CFormInput
                      type="file"
                      id="formFile"
                      onChange={handleFileChange}
                    />
                    {previousImage && (
                      <img
                        src={previousImage}
                        alt="Previous"
                        className="mt-2"
                        style={{ width: "100px" }}
                      />
                    )}
                  </CCol>
                  <CCol xs className="mt-3">
                    <label htmlFor="">Choose language</label>
                    <CFormSelect
                      value={language}
                      onChange={handleLanguageChange}
                    >
                      <option value="en">English</option>
                      <option value="he">Hebrew</option>
                      <option value="ru">Russian</option>
                    </CFormSelect>
                    <label htmlFor="" className="mb-2 mt-2">
                      Meal Name
                    </label>
                    <CFormInput
                      name={language}
                      placeholder={`Enter Meal Name (${language})`}
                      aria-label="Category Name"
                      className={`${hebrewState ? "rtl text-end" : "text-left"}`}
                      value={edit.Name[language]}
                      onChange={handleChange}
                    />
                  </CCol>
                  <div className="text-center">
                    <CButton
                      color="primary"
                      className="mt-3"
                      onClick={handleUpdate}
                    >
                      Update
                    </CButton>
                  </div>
                </div>
              </CModalBody>
            </CModal>
          </div>
        </div>
      </div>
    </section>
  );
}
