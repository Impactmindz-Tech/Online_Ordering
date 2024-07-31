import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { CContainer, CRow, CCol, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import { OnlineContext } from '../../../Provider/OrderProvider';
import './orders.css';

export default function Order() {

  const { getAllOrder,orderDetail,location,summary,Schedule ,orders} = useContext(OnlineContext);

 


console.log(location);

  return (
    <div>
    <h1>Orders List</h1>
    {orders.length === 0 ? (
      <p>No orders found.</p>
    ) : (
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>Postal Code</th>
         
          
            <th>State District</th>
     
            <th>Schedule</th>
            <th>Breakfast</th>
            <th>Lunch</th>
            <th>Dinner</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.location?.city || 'N/A'}</td>
              <td>{order.location?.state || 'N/A'}</td>
              <td>{order.location?.country || 'N/A'}</td>
              <td>{order.location?.postcode || 'N/A'}</td>
           
             
              <td>{order.location?.state_district || 'N/A'}</td>
          
              <td>
              All My Staying: {order.schedule?.Staying ?(<b>Yes</b>) : (<b>No</b>)}<br />
                Tomorrow: {order.schedule?.Tomorrow ? (<b>Yes</b>) : (<b>No</b>)}<br />
                The Rest of this Week: {order.schedule?.Week ? (<b>Yes</b>) : (<b>No</b>)}
              </td>
              <td>
                {order.summary?.breakfast?.map((item, index) => (
                  <div key={index}>
                    <p><strong>Name : </strong>{item.Name}</p>
                    <p><strong>Category : </strong>{item.category}</p>
             
             
                   
                  </div>
                ))}
              </td>
              <td>
                {order.summary?.lunch?.map((item, index) => (
                  <div key={index}>
                 <p><strong>Name : </strong>{item.Name}</p>
                 <p><strong>Category : </strong>{item.category}</p>
        
               
                  </div>
                ))}
              </td>
              <td>
                {order.summary?.dinner?.map((item, index) => (
                  <div key={index}>
                <p><strong>Name : </strong>{item.Name}</p>
                <p><strong>Category : </strong>{item.category}</p>
                  
                 
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
  );
}
