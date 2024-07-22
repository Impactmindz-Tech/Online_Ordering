import React from 'react'
import { useContext, useState,useEffect } from 'react'
import { OnlineContext } from '../../../Provider/OrderProvider'
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
} from '@coreui/react'
export default function Category() {
  const [visible, setVisible] = useState(false)
  const [category, setcategory] = useState('')
  const { Addcategory, getcategory ,getAllcategory} = useContext(OnlineContext)
  const handlesubmit = () => {
    Addcategory(category)
    getAllcategory();
  }

  return (
    <section>
      <CForm className="d-flex justify-content-between">
        <div className="d-flex">
          <CFormInput type="search" className="me-2 w-100" placeholder="Search" />

          <CButton color="primary">search</CButton>
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
            {getcategory.map((item) => {
              return (
                <>
                  <CTableRow>
                    <CTableDataCell>{item.Id}</CTableDataCell>
                    <CTableDataCell>{item.Name}</CTableDataCell>
                    <CTableDataCell>Delete Edit</CTableDataCell>
                  </CTableRow>
                </>
              )
            })}
          </CTableBody>
        </CTable>
      </div>

      {/* <div className="popup">
        <CModal
          alignment="center"
          backdrop="static"
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">Add Category</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs>
                <CFormInput placeholder="Last name" aria-label="Last name" />
              </CCol>
            </CRow>
          </CModalBody>
        </CModal>
      </div> */}
    </section>
  )
}
