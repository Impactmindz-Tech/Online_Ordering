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
  const { getmeal, foodprod,saveproduct, getcategory, allcategorie ,getAllcategory} = useContext(OnlineContext);
  const [file, setFile] = useState(null);
  const [mealid, setMealid] = useState();
  const [cateid, setCateid] = useState('');

  const [formData, setFormData] = useState({
    dishName: "",
    price: "",
    category: "",
    categoryId: "",
    isAvailable: "",
    dietaryInfo: "",
    description: "",
    meal: ""
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

    if (name === "meal") {
      setMealid(value);
      getcategory(value);
    }
  };

  const handleCategoryChange = (e) => {
    const { value, selectedIndex } = e.target;
    const selectedCategoryId = e.target.options[selectedIndex].getAttribute('data-id');

    setFormData((prevState) => ({
      ...prevState,
      category: value,
      categoryId: selectedCategoryId,
    }));
    setCateid(selectedCategoryId);
  };

  const handleSubmit = async () => {
    // Save product details with both category name and ID
    await saveproduct(file, formData);
  
  };
  useEffect(()=>{
    getAllcategory();
    getcategory();
  },[])

  return (
    <>
    {foodprod.map((item)=>{
      console.log(item.Name);
    })}
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
        <div className="col-lg-5">
          <div className="mb-3">
            <CFormInput type="file" id="formFile" onChange={handleFileChange} />
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
            <CCol xs>
              <label className="mb-2" htmlFor="price">
                Price
              </label>
              <CFormInput
                placeholder="Price"
                name="price"
                value={formData.price}
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
                      {getmeal.map((item) => 
                    
                        (
                          <option key={item.id} value={item.id}>
                            {item.Name}
                          </option>
                        )
                       
                      )}
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
                      onChange={handleCategoryChange}
                    >
                      <option value="">Choose Category</option>
                      {allcategorie.map((item) =>
                       (
                          <option key={item.id} value={item.Name} data-id={item.id}>
                          {item.Name}
                        </option>
                        )
                      
                        
                      )}
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
            Add Product
          </CButton>
        </div>
      </div>
    </>
  );
}
