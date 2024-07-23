import React from "react";
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
import { DocsExample } from "src/components";

const Product = () => {
  return (
    <>
      <div className="category_list mt-lg-5">
        <CTable>
          <CTableHead>
            <CTableRow>
             
              <CTableHeaderCell scope="col">Image</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Category</CTableHeaderCell>
              <CTableHeaderCell scope="col">Description</CTableHeaderCell>
              <CTableHeaderCell scope="col">Price</CTableHeaderCell>
              <CTableHeaderCell scope="col">is_available</CTableHeaderCell>

            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow>
     
              <CTableDataCell>Mark</CTableDataCell>
              <CTableDataCell>Otto</CTableDataCell>
              <CTableDataCell>@mdo</CTableDataCell>
            </CTableRow>
     
          </CTableBody>
        </CTable>
      </div>
    </>
  );
};

export default Product;
