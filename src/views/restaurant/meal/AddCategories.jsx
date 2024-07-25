import { useState, useContext, useEffect } from "react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import "../products/Product.css";
import './category.css';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
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
  CFormSelect
} from "@coreui/react";
import camera from "../../../assets/images/camera.png";

export default function Addproduct() {
  const { getmeal, updatesubcateImage, getAllSubcategories, getAllcategory, storeImage, savecategories, subcategories, deletesubdoc } = useContext(OnlineContext);
  const [file, setFile] = useState(null);
  const [visible, setVisible] = useState(false);
  const [previousImage, setPreviousImage] = useState(""); // Add state for previous image URL
  const [id, setid] = useState("");
  const [edit, setedit] = useState({
    id: "",
    category: "",
    meals: ""
  });

  const [formData, setFormData] = useState({
    categoryname: "",
    meal: "",
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
    setedit((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    await savecategories(file, formData);
    await getAllSubcategories();
  };

  const handleupdate = async () => {
    setVisible(false);

    if (file) {
      await updatesubcateImage(id, edit, file);
    } else {
      await updatesubcateImage(id, edit, previousImage); // Use previous image if no new file is selected
    }
    await getAllSubcategories();
  };

  const handledelete = async (id) => {
    await deletesubdoc(id);
    await getAllSubcategories();
  };

  const handleedit = (id) => {
    setVisible(true);
    let findid = subcategories.find((item) => item.id === id);
    console.log(findid);
    setedit({
      id: id,
      category: findid.Name,
      meals: findid.Category
    });

    setPreviousImage(findid.Thumbnail); // Set previous image URL
    setid(id);
  };

  useEffect(() => {
    getAllcategory();
    getAllSubcategories();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-lg-4">
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
          <div className="row">
            <div className="col-lg-6">
              <label className="mb-2" htmlFor="mealName">
                Select The Category
              </label>
              <div>
                <CFormSelect
                  name="meal"
                  value={formData.meal}
                  onChange={handleChange}
                >
                  <option value="">Choose Category</option>
                  {getmeal.map((item) => {
                    return (
                      <option key={item.id} value={item.Name}>
                        {item.Name}
                      </option>
                    );
                  })}
                </CFormSelect>
              </div>
            </div>
            <div className="col-lg-6">
              <CCol xs>
                <label className="mb-2" htmlFor="dishName">
                  SubcategoryName
                </label>
                <CFormInput
                  placeholder="subCategory Name"
                  name="categoryname"
                  value={formData.categoryname}
                  onChange={handleChange}
                />
              </CCol>
            </div>
          </div>
          <div className="text-center">
            <CButton className="w-50 mt-4" color="primary" onClick={handleSubmit}>
              Add Category
            </CButton>
          </div>
        </div>
        <div className="col-lg-8">
          <h3 className="text-center mt-3 mb-3">All Categories</h3>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Thumbnails</CTableHeaderCell>
                <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {subcategories.map((item) => {
                return (
                  <CTableRow key={item.id}>
                    <CTableDataCell className="categoryImage"><img src={item.Thumbnail} alt="thumbnail" /></CTableDataCell>
                    <CTableDataCell>{item.Name}</CTableDataCell>
                    <CTableDataCell>
                      <CButton onClick={() => handleedit(item.id)}>
                        <ModeEditIcon />
                      </CButton>
                      <CButton onClick={() => handledelete(item.id)}>
                        <DeleteIcon style={{ color: "#dd0000" }} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>
        </div>
      </div>
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
                {file ? (
                  <img src={file} alt="Selected" style={{ width: '40%', marginTop: '10px' }} />
                ) : (
                  previousImage && <img src={previousImage} alt="Selected" style={{ width: '40%', marginTop: '10px' }} />
                )}
              </CCol>
              <div className="col-lg-6">
                <label className="mb-2" htmlFor="mealName">
                  Select The Category
                </label>
                <div>
                  <CFormSelect
                    name="meals"
                    value={edit.meals}
                    onChange={handleChange}
                  >
                    <option value="">Choose Category</option>
                    {getmeal.map((item) => {
                      return (
                        <option key={item.id} value={item.Name}>
                          {item.Name}
                        </option>
                      );
                    })}
                  </CFormSelect>
                </div>
              </div>
              <div className="col-lg-6">
                <CCol xs className="mt-3">
                  <label htmlFor="" className="mb-2">
                    Category
                  </label>
                  <CFormInput
                    name="category"
                    placeholder="Enter Category Name"
                    aria-label="Category Name"
                    value={edit.category}
                    onChange={handleChange}
                  />
                </CCol>
              </div>
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
    </>
  );
}
