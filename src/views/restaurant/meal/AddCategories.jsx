import { useState, useContext } from "react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import "../products/Product.css";
import {
  CForm,
  CFormInput,
  CButton,
  CTable,
  CFormSelect,
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
import camera from "../../../assets/images/camera.png";

export default function Addproduct() {
  const { getmeal, storeImage,savecategories } = useContext(OnlineContext);
  const [file, setFile] = useState(null);
  const [category, setcategory] = useState("");

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
  };

  const handleSubmit = async () => {
    savecategories(file, formData);
    console.log(file,formData);
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
          <div className="row">
            <div className="col-lg-6">
            <label className="mb-2" htmlFor="mealName">
              Select The Meal
              </label>
            <div>
    <CFormSelect
                name="meal"
                value={formData.meal}
                onChange={handleChange}
              >
                <option value="">Choose Meal</option>
                {getmeal.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
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
                Category Name
              </label>
              <CFormInput
                placeholder="Category Name"
                name="categoryname"
                value={formData.categoryname}
                onChange={handleChange}
              />
            </CCol>
            </div>
          </div>
          <div className="text-center">
          <CButton className="w-50 mt-4" color="primary" onClick={handleSubmit}>
            Add Product
          </CButton>
        </div>
        </div>
        <div className="col-lg-8">
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Class</CTableHeaderCell>
                <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell scope="row">1</CTableHeaderCell>
                <CTableDataCell>Mark</CTableDataCell>
                <CTableDataCell>Otto</CTableDataCell>
                <CTableDataCell>@mdo</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row">2</CTableHeaderCell>
                <CTableDataCell>Jacob</CTableDataCell>
                <CTableDataCell>Thornton</CTableDataCell>
                <CTableDataCell>@fat</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row">3</CTableHeaderCell>
                <CTableDataCell colSpan={2}>Larry the Bird</CTableDataCell>
                <CTableDataCell>@twitter</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </div>
      </div>
    </>
  );
}
