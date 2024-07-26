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
import { connectStorageEmulator } from "firebase/storage";
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

    }
    getAllcategory();
  };

  const handledelete = (id) => {
    let findid = getmeal.find((item) => item.id === id);
     // find the corresponding image path
    let imagepath = findid.ImageUrl;

  deletedoc(id,imagepath)
 
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
    let findid = getmeal.find((item) => item.id === id);
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
       <div className="row justify-content-center ">
        <div className="col-lg-8">

          <div className="row ">
            <div className="col-lg-4">
            <CCol xs>
            <CFormInput type="file" id="formFile" onChange={handleFileChange} />
          </CCol>
            </div>
            <div className="col-lg-4">
            <CCol xs>
            <CFormInput
              name="category"
              placeholder="Enter Meal Name"
              aria-label="Meal Name"
              onChange={(e) => setcategory(e.target.value)}
            />
          </CCol>
            </div>
            <div className="col-lg-4">
            <CButton className="w-100" color="primary" onClick={handlesubmit}>
            Add Meal
          </CButton>
            </div>
          </div>
        </div>




       </div>
   <div className="row justify-content-center">
   <div className="category_list mt-lg-5 col-lg-8">
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

                <CTableDataCell className="categoryImage ps-4 ">
                  <img src={item.ImageUrl} alt="meal image" />
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  {item.Name}
                </CTableDataCell>
                <CTableDataCell className="text-end pe-4">
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
                    Category
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
   </div>
    </section>
  );
}
