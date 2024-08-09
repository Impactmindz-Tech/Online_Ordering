import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { CContainer, CRow, CCol, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import { OnlineContext } from '../../../Provider/OrderProvider';
import './orders.css';

export default function Order() {

  const { getAllOrder,orderDetail,location,summary,Schedule ,orders} = useContext(OnlineContext);

 

console.log(orders);

  return (
<div className='table_layout'>
      <h1 className='text-center'>Orders List</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className='table_container'>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
              
                <th>City/Name</th>
                <th>State</th>
                <th>Country</th>
                <th>Pincode</th>
                <th>Placename</th>
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
                  <td>{order.location?.location?.city|| order.location?.Name}</td>
                  <td>{order.location?.location?.state || '-'}</td>
                  <td>{order.location?.location?.country || '-'}</td>
                  <td>{order.location?.location?.pincode
                    || '-'}</td>
                  <td>{order.location?.location?.placename || '-'}</td>
                  <td>
                    All My Staying: {order.schedule?.Staying ? (<b>Yes</b>) : (<b>No</b>)}<br />
                    Tomorrow: {order.schedule?.Tomorrow ? (<b>Yes</b>) : (<b>No</b>)}<br />
                    The Rest of this Week: {order.schedule?.Week ? (<b>Yes</b>) : (<b>No</b>)}
                  </td>
                  <td>
                    {order.summary?.breakfast?.map((item, index) => (
                      <div key={index}>
                        <p><strong>Category: </strong>{item.category}</p>
                        <p><strong>Name: </strong>{item.Name}</p>
                      </div>
                    ))}
                  </td>
                  <td>
                    {order.summary?.lunch?.map((item, index) => (
                      <div key={index}>
                        <p><strong>Category: </strong>{item.category}</p>
                        <p><strong>Name: </strong>{item.Name}</p>
                      </div>
                    ))}
                  </td>
                  <td>
                    {order.summary?.dinner?.map((item, index) => (
                      <div key={index}>
                        <p><strong>Category: </strong>{item.category}</p>
                        <p><strong>Name: </strong>{item.Name}</p>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
