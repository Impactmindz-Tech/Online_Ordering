import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { CContainer, CRow, CCol, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import { OnlineContext } from '../../../Provider/OrderProvider';

export default function Order() {
  const [orders, setOrders] = useState([]);
  const { getAllOrder } = useContext(OnlineContext);

 


    // const lunchOrders = orders.filter(order => order.schedule === 'lunch');
    // const dinnerOrders = orders.filter(order => order.schedule === 'dinner');
  
 
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllOrder();
      setOrders(data);
    };

    fetchData();
  }, [getAllOrder]);

 

  return (
    <CContainer fluid>
      <CRow>
        <CCol md="4">
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">State</CTableHeaderCell>
                <CTableHeaderCell scope="col">Postcode</CTableHeaderCell>
                <CTableHeaderCell scope="col">town</CTableHeaderCell>
                <CTableHeaderCell scope="col">Country</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {orders.map((order, index) => (
                <CTableRow key={index}>
                  <CTableDataCell> {order.location.state}</CTableDataCell>
                  <CTableDataCell>{order.location.postcode}</CTableDataCell>
                  <CTableDataCell> {order.location.town}</CTableDataCell>
                  <CTableDataCell> {order.location.country}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCol>
        <CCol md="8">
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Orders</CTableHeaderCell>
                <CTableHeaderCell scope="col">Breakfast</CTableHeaderCell>
                <CTableHeaderCell scope="col">Lunch</CTableHeaderCell>
                <CTableHeaderCell scope="col">Dinner</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
    
           
             
            
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
    </CContainer>
  );
}
