import React, { useContext, useEffect, useState } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CRow,
  CCol,
  CFormSelect,
  CFormTextarea,
} from "@coreui/react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import './Product.css';

const Product = () => {
  const { foodprod, getAllproducts, updateProducts, getmeal, allcategorie, getAllcategory, getcategory, deleteProduct } = useContext(OnlineContext);
  const [visible, setVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [mealid, setMealid] = useState();
  const [cateid, setCateid] = useState('');
 const[umealId,setumealId] = useState('');
 const[ucateId,setcateId] = useState('');
 const[uproductId,setproductId] = useState('');


  const [formData, setFormData] = useState({
    dishName: "",
    
    category: "",
    
    isAvailable: "",
    dietaryInfo: "",
    description: "",
    meal: "",
  });
  const [currentProduct, setCurrentProduct] = useState(null);

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
    // Save product details with both category name and ID
    await updateProducts(file, formData,uproductId);
    setVisible(false); // Close the modal after saving
    await refreshProducts(); // Re-fetch the updated product list
  };

  const refreshProducts = async () => {
    await getAllproducts();
  };

  const handleDelete = async (productId) => {
    
    let findid = foodprod.find((item) => item.id === productId);
    // find the corresponding image path
   let imagepath = findid.ImageUrl;



    await deleteProduct(productId,imagepath);
    await refreshProducts(); // Re-fetch the updated product list after deleting
  };

  const handleEdit = (product) => {
    // Set the form data and image for the current product
    setFormData({
      dishName: product.Name,
    
      category: product.Category,
    
      isAvailable: product.isAvailable,
      dietaryInfo: product.DietaryInfo,
      description: product.Description,
      meal: product.mealId,

    });
    console.log(formData,'formdata');

    setFile(product.ImageUrl); // Set the current image

    setVisible(true); // Open the modal

    setproductId(product.id);
  };

  const filterecate = allcategorie.filter((item)=>{
    return item.Category===formData.meal;
  });

  

  useEffect(() => {
    getAllcategory();
    getAllproducts();
  }, []);



  return (
    <>
      <div className=" mt-lg-5">
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Image</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Category</CTableHeaderCell>
              <CTableHeaderCell scope="col">Description</CTableHeaderCell>
              <CTableHeaderCell scope="col">Dietary Info</CTableHeaderCell>
           
              <CTableHeaderCell scope="col">is_available</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {foodprod.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell className="productImage">
                  <img src={item.ImageUrl} alt="productImage" />
                </CTableDataCell>
                <CTableDataCell>{item.Name}</CTableDataCell>
                <CTableDataCell>{item.category}</CTableDataCell>
                <CTableDataCell>{item.Description}</CTableDataCell>
                <CTableDataCell>{item.DietaryInfo}</CTableDataCell>
             
                <CTableDataCell>{item.isAvailable}</CTableDataCell>
                <CTableDataCell>
                  <CButton onClick={() => handleEdit(item)}>
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
      </div>
      <div>
        <CModal
        alignment="center"
          backdrop="static"
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">Edit Product</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="row justify-content-center mt-5">
              <div className="col-lg-5">
                <div className="mb-3 text-center ">
                  <div className="w-25 ms-auto me-auto">
                  {file && <img src={file} alt="Selected" className="mb-3" style={{ width: '100%', marginTop: '10px' }} />}
                  </div>
                 
                  <CFormInput
                    type="file"
                    id="formFile"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <CRow>
                  <CCol xs>
                    <label className="mb-2" htmlFor="dishName">
                      Dish Name
                    </label>
                    <CFormInput
                      placeholder="Dish Name"
                      name="dishName"
                      value={formData.dishName}
                      onChange={handleChange}
                    />
                  </CCol>
      
                </CRow>
                <CRow className="mt-3">
                  <div className="col-lg-6">
                    <div className="row">
                      <div className="col-lg-6">
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
                      </div>
                      <div className="col-lg-6">
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
                            {filterecate.map((item) => (
                              <option key={item.id} value={item.Name} >
                                {item.Name}
                              </option>
                            ))}
                          </CFormSelect>
                        </CCol>
                      </div>
                    </div>
                  </div>
                  <CCol xs>
                    <label className="mb-2" htmlFor="isAvailable">
                      Is Available
                    </label>
                    <CFormSelect
                      name="isAvailable"
                      value={formData.isAvailable}
                      onChange={handleChange}
                    >
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
                <CButton className="w-50 mt-4" color="primary" onClick={handleSubmit}>
                  Save Changes
                </CButton>
              </div>
            </div>
          </CModalBody>
        </CModal>
      </div>
    </>
  );
};

export default Product;
