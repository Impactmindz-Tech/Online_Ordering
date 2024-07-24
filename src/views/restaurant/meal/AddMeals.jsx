import React, { useContext, useState, useEffect } from "react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import "./category.css";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "react-modal";

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
  CRow,
  CCol,
} from "@coreui/react";
Modal.setAppElement("#root");
export default function Category() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const openModal = (imageUrl) => {
    console.log("hello");
    setCurrentImage(imageUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentImage("");
  };
  const [visible, setVisible] = useState(false);
  const [category, setcategory] = useState("");
  const [file, setFile] = useState(null);

  const [previousImage, setPreviousImage] = useState(""); // Add state for previous image URL
  const [id, setid] = useState("");
  const [edit, setedit] = useState({
    id: "",
    category: "",
  });

  const {
    Addcategory,
    getmeal,
    getAllcategory,
    deletedoc,
    updatedata,
    storecateImage,
    updateImage,
  } = useContext(OnlineContext);

  const handlesubmit = () => {
    if (!file || !category) {
      console.log("please fill the meal name and select the image");
    } else {
      storecateImage(file, category);
      getAllcategory();
    }
  };

  const handledelete = (id) => {
    deletedoc(id);
    getAllcategory();
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setedit((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleupdate = () => {
    setVisible(false);
    const { category } = edit;

    if (file) {
      updateImage(id, category, file);
    } else {
      updateImage(id, category, previousImage); // Use previous image if no new file is selected
    }
    getAllcategory();
  };

  const handleedit = (id) => {
    setVisible(true);
    let findid = getcategory.find((item) => item.id === id);
    setedit({ category: findid.Name });
    setPreviousImage(findid.ImageUrl); // Set previous image URL
    setid(id);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    const fileUrl = URL.createObjectURL(selectedFile);
    setFile(fileUrl);
  };

  useEffect(() => {
    getAllcategory();
  }, []);

  return (
    <section>
      <CForm className="d-flex justify-content-between">
        <div className="d-flex">
          <CFormInput
            type="search"
            className="me-2 w-100"
            placeholder="Search"
          />
          <CButton color="primary">Search</CButton>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <CCol xs>
            <CFormInput type="file" id="formFile" onChange={handleFileChange} />
          </CCol>
          <CCol xs>
            <CFormInput
              name="category"
              placeholder="Enter Meal Name"
              aria-label="Category Name"
              onChange={(e) => setcategory(e.target.value)}
            />
          </CCol>
          <CButton color="primary" onClick={handlesubmit}>
            Add Meal
          </CButton>
        </div>
      </CForm>
      <div className="category_list mt-lg-5">
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col" className="text-center">
                Image
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" className="text-center">
                Name
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" className="text-center">
                Action
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {getmeal.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{item.Id}</CTableDataCell>
                <CTableDataCell className="categoryImage text-center">
                  <img src={item.ImageUrl} alt="meal image" />
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  {item.Name}
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CButton onClick={() => handleedit(item.id)}>
                    <ModeEditIcon />
                  </CButton>
                  <CButton onClick={() => handledelete(item.id)}>
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
              <div className=" gap-2">
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
                  <label htmlFor="" className="mb-2">
                    {" "}
                    Meal
                  </label>
                  <CFormInput
                    name="category"
                    placeholder="Enter Meal Name"
                    aria-label="Category Name"
                    value={edit.category}
                    onChange={handlechange}
                  />
                </CCol>
                <div className="text-center">
                  <CButton
                    color="primary"
                    className="mt-3"
                    onClick={handleupdate}
                  >
                    Update
                  </CButton>
                </div>
              </div>
            </CModalBody>
          </CModal>
        </div>
      </div>
    </section>
  );
}
