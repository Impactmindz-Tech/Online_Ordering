import React, { createContext, useEffect, useState } from 'react'
import { app } from '../config/Firebase'
import {
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  setDoc,
  doc,
  getDoc,
  getFirestore,deleteDoc,updateDoc
} from 'firebase/firestore'

export const OnlineContext = createContext(null)
export const OnlineContextProvider = (props) => {
  const [getcategory, setcategory] = useState([])
  const db = getFirestore(app)
  //function to add Category
  const Addcategory = async (category) => {
    // Reference to the 'OnlineOrder' collection
    const onlineOrderRef = collection(db, 'Categories')

    // Query to get the document with the highest Id
    const q = query(onlineOrderRef, orderBy('Id', 'desc'), limit(1))
    const querySnapshot = await getDocs(q)

    // Determine the current highest Id
    let currentId = 0
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      currentId = doc.data().Id
    }

    // Generate a new document ID within the 'OnlineOrder' collection
    const newDocRef = doc(onlineOrderRef)

    // Update the document with new data
    await setDoc(newDocRef, {
      Name: category,
      Id: currentId + 1,
    })

    console.log('Category added successfully')
  }

  //function to get all category

  const getAllcategory = async () => {
    const q = query(collection(db, 'Categories'), orderBy('Id', 'asc'))

    const querySnapshots = await getDocs(q);
    const categories = querySnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));


    setcategory(categories);
    console.log(categories);
  }


  const deletedoc = async(id)=>{
    await deleteDoc(doc(db, "Categories", `${id}`));
    console.log(id);

  }

  const updatedata = async(id,data)=>{

    const docref = doc(db,"Categories",id);
    await updateDoc(docref,{
      Name:data
    })
  
}

  useEffect(() => {
    getAllcategory();
  }, [])

  const contextValue = { Addcategory, getcategory, getAllcategory, deletedoc, updatedata}

  return <OnlineContext.Provider value={contextValue}>{props.children}</OnlineContext.Provider>
}
