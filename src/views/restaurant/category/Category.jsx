import React, { useContext, useState, useEffect } from "react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import './category.css'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';

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

export default function Category() {
  const [visible, setVisible] = useState(false);
  const [category, setcategory] = useState("");
  const[id,setid] = useState("");
  const [edit, setedit] = useState({
    id: '',
    category: ''
  });

  const { Addcategory, getcategory, getAllcategory, deletedoc, updatedata } = useContext(OnlineContext);

  const handlesubmit = () => {
    Addcategory(category);
    getAllcategory();
  };

  const handledelete = (id) => {
    deletedoc(id);
    getAllcategory();
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setedit((prev) => {
      return { ...prev,[name]: value };
    });
    console.log(edit)
  };

  const handleupdate = () => {
   console.log(id);
    
    setVisible(false);
    getAllcategory();
    const{category} = edit;
    console.log(category);
    updatedata(id, category);
  };

  const handleedit = (id) => {
    setVisible(true);
    let findid = getcategory.find((item) => item.id === id);
    setedit({category: findid.Name});
    setid(id);
 
  };

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

        <div className="d-flex gap-2">
          <CCol xs>
            <CFormInput
              name="category"
              placeholder="Enter Category Name"
              aria-label="Category Name"
              onChange={(e) => setcategory(e.target.value)}
            />
          </CCol>
          <CButton color="primary" onClick={handlesubmit}>
            Add Category
          </CButton>
        </div>
      </CForm>
      <div className="category_list mt-lg-5">
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Category Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {getcategory.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{item.Id}</CTableDataCell>
                <CTableDataCell>{item.Name}</CTableDataCell>
                <CTableDataCell>
                  <CButton onClick={() => handleedit(item.id)}> <ModeEditIcon/> </CButton>
                  <CButton onClick={() => handledelete(item.id)}><DeleteIcon style={{color:'#dd0000'}}/></CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <div className="popup">
          <CModal className="custom_modal"
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
            <CModalBody >
              <div className="d-flex gap-2">
                <CCol xs>
                  <CFormInput
                    name="category"
                    placeholder="Enter Category Name"
                    aria-label="Category Name"
                    value={edit.category}
                    onChange={handlechange}
                  />
                </CCol>
                <CButton color="primary" onClick={handleupdate}>
                  Update
                </CButton>
              </div>
            </CModalBody>
          </CModal>
        </div>
      </div>
    </section>
  );
}
