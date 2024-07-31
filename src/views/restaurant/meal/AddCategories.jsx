import { useState, useContext, useEffect } from "react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import "../products/Product.css";
import "./category.css";
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
  CCol,
  CFormSelect,
  CPagination,
  CPaginationItem,
} from "@coreui/react";
import camera from "../../../assets/images/camera.png";

export default function Addproduct() {
  const {
    getmeal,
    updatesubcatdata,
    getAllcategory,
    savecategories,
    deletesubdoc,
    allcategorie,alert,setAlert
  } = useContext(OnlineContext);

  const [visible, setVisible] = useState(false);
  const [id, setid] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default to English
  const [editLanguage, setEditLanguage] = useState("en"); // Language for editing

  const [edit, setedit] = useState({
    id: "",
    // Name: { en: "", ru: "", he: "" },
    Name: "",
    meals: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(allcategorie.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allcategorie.slice(indexOfFirstItem, indexOfLastItem);

  const [formData, setFormData] = useState({
    Name: { en: "", ru: "", he: "" },
    meal: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("categoryname_")) {
      const lang = name.split("_")[1];
      setFormData((prevState) => ({
        ...prevState,
        Name: { ...prevState.Name, [lang]: value },
      }));
      setedit((prevState) => ({
        ...prevState,
        Name: { ...prevState.Name, [lang]: value },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setedit((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    await savecategories(formData);
  };

  const handleupdate = async () => {
    setVisible(false);
    await updatesubcatdata(id, edit);
  };

  const handledelete = async (id) => {
    await deletesubdoc(id);
  };

  const handleedit = (id) => {
    setVisible(true);
    let findid = subcategories.find((item) => item.id === id);
    console.log(findid);
    setedit({
      id: id,
      Name: findid.Name,
      meals: findid.Category,
    });
    console.log(findid);
    setid(id);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }
    setCurrentPage(pageNumber);
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
      <div className="row max_height justify-content-center ">
        <div className="col-lg-4 mt-3">
          <div>
            <h3 className="text-center mb-2">Add Category</h3>
          </div>

          <div className="">
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
          </div>

          <div className="row mt-3">
            <div className="col-lg-6">
              <div>
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
                    {getmeal.map((item) => (
                      <option key={item.id} value={item.Name}>
                        {item.Name}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="">
                <CCol xs>
                  <label className="mb-2" htmlFor="categoryName">
                    Category Name
                  </label>
                  <CFormInput
                    placeholder={`Category Name (${selectedLanguage})`}
                    name={`categoryname_${selectedLanguage}`}
                    value={formData.Name[selectedLanguage]}
                    onChange={handleChange}
                  />
                </CCol>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-end">
              <CButton className="w-100" color="primary" onClick={handleSubmit}>
                Add Category
              </CButton>
            </div>
          </div>
        </div>

        <div className="col-lg-8 allcategories">
          <h3 className="text-center mt-3 mb-3">All Categories</h3>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col " className="ps-4">
                  Meal
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-center">
                  Category
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" className="text-end pe-4">
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentItems.map((item) => (
                <CTableRow key={item.id}>
                  <CTableDataCell className="ps-4">
                    {item.Category}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    {item.Name}
                  </CTableDataCell>
                  <CTableDataCell className="text-end">
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
              Edit Category
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="gap-2">
              <div className="row">
                <div className="col-lg-6">
                  <label className="mb-2" htmlFor="mealName">
                    Select The Meal
                  </label>
                  <div>
                    <CFormSelect
                      name="meals"
                      value={edit.meals}
                      onChange={handleChange}
                    >
                      <option value="">Choose Meal</option>
                      {getmeal.map((item) => (
                        <option key={item.id} value={item.Name}>
                          {item.Name}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </div>
                <div className="col-lg-6">
                  <CCol xs>
                    <label className="mb-2" htmlFor="editLanguageSelect">
                      Select Language
                    </label>
                    <CFormSelect
                      id="editLanguageSelect"
                      value={editLanguage}
                      onChange={(e) => setEditLanguage(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="ru">Russian</option>
                      <option value="he">Hebrew</option>
                    </CFormSelect>
                  </CCol>
                  <CCol xs>
                    <label htmlFor="categoryName" className="mb-2">
                      Category
                    </label>
                    <CFormInput
                      name="Name"
                      // name={`${editLanguage}`}
                      placeholder={`Enter Category Name (${editLanguage})`}
                      // value={edit.Name[editLanguage]}
                      value={edit.Name}
                      onChange={handleChange}
                    />
                  </CCol>
                </div>
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

      <div className="fixed_pagination">
        <CPagination aria-label="Page navigation example" align="end">
          <CPaginationItem
            aria-label="Previous"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </CPaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <CPaginationItem
              key={index}
              onClick={() => handlePageChange(index + 1)}
              active={currentPage === index + 1}
            >
              {index + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem
            aria-label="Next"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </CPaginationItem>
        </CPagination>
      </div>
    </>
  );
}
