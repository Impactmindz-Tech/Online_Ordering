import React, { createContext, useEffect, useState } from "react";
import { app, storage } from "../config/Firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  setDoc,
  doc,
  getDoc,
  getFirestore,
  deleteDoc,
  updateDoc,
  where,
} from "firebase/firestore";

export const OnlineContext = createContext(null);
export const OnlineContextProvider = (props) => {
  const [getmeal, setmeal] = useState([]);
  const[allcategories,setcategories] = useState([]);
  const db = getFirestore(app);

  const storecateImage = async (file, category) => {
    try {
      const fileName = Date.now().toString() + ".jpg";
      const response = await fetch(file);

      const blob = await response.blob();
      const imageRef = ref(storage, "meals/" + fileName);

      await uploadBytes(imageRef, blob);
      console.log("File uploaded");

      const downloadUrl = await getDownloadURL(imageRef);
      console.log(downloadUrl);

      await Addcategory(downloadUrl, category);
    } catch (error) {
      console.error("Error adding business: ", error);
      ToastAndroid.show("Failed to add new business.", ToastAndroid.LONG);
    }
  };

  //function to add Category
  const Addcategory = async (downloadUrl, category) => {
    // Reference to the 'OnlineOrder' collection
    const onlineOrderRef = collection(db, "Meals");

    // Query to get the document with the highest Id
    const q = query(onlineOrderRef, orderBy("Id", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    // Determine the current highest Id
    let currentId = 0;
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      currentId = doc.data().Id;
    }

    // Generate a new document ID within the 'OnlineOrder' collection
    const newDocRef = doc(onlineOrderRef);

    // Update the document with new data
    await setDoc(newDocRef, {
      Name: category,

      ImageUrl: downloadUrl,
    });

    console.log("Category added successfully");
  };

  //function to get all category

  const getAllcategory = async () => {
    const q = query(collection(db, "Meals"));

    const querySnapshots = await getDocs(q);
    const categories = querySnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setmeal(categories);
    console.log(categories,'categories');
  };

  const deletedoc = async (id) => {
    await deleteDoc(doc(db, "Meals", `${id}`));
    console.log(id);
    getAllcategory();
  };

  // store image into firestore

  const saveproduct = async (file, formData) => {
    try {
      const fileName = Date.now().toString() + ".jpg";
      const response = await fetch(file);
      console.log(formData, "data");
      const blob = await response.blob();
      const imageRef = ref(storage, "products/" + fileName);

      await uploadBytes(imageRef, blob);
      console.log("File uploaded");

      const downloadUrl = await getDownloadURL(imageRef);
      console.log(downloadUrl);

      await saveproductDetail(formData, downloadUrl);
    } catch (error) {
      console.error("Error adding business: ", error);
      
    }
  };

  const saveproductDetail = async (formData, downloadUrl) => {
    const mealid = formData?.meal;
    const cateid = formData?.category;
    const q = query(collection(db, `Meals/${mealid}/Categories`),where('id', '==',cateid));

    const querySnapshots = await getDocs(q);
    const categories = querySnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

  console.log(categories);

  
    await setDoc(doc(db, `Meal/${mealid}/Categories/${cateid}/Products`, Date.now().toString()), {
      Name: formData?.dishName,
      Category: formData?.category,
      isAvailable: formData?.isAvailable,
      ImageUrl: downloadUrl,
      DietaryInfo: formData?.dietaryInfo,
      Description: formData?.description,
      Price:formData?.price
    });
  };

  const updateImage = async (id, data, file) => {
    try {
      const fileName = Date.now().toString() + ".jpg";
      const response = await fetch(file);

      const blob = await response.blob();
      const imageRef = ref(storage, "categories/" + fileName);
      console.log(imageRef, "img");

      await uploadBytes(imageRef, blob);
      console.log("File uploaded");

      const downloadUrl = await getDownloadURL(imageRef);
      console.log(downloadUrl);
      console.log(id);
      updatedata(id, data, downloadUrl);
    } catch (error) {
      console.error("Error adding business: ", error);
    }
  };

  const updatedata = async (id, data, downloadUrl) => {
    const docref = doc(db, "Categories", id);
    await updateDoc(docref, {
      Name: data,
      ImageUrl: downloadUrl,
    });
    getAllcategory();
  };



  //store all the categories
  const savecategories = async(file,formData) =>{
    try {
      const fileName = Date.now().toString() + ".jpg";
      const response = await fetch(file);
      console.log(formData, "data");
      const blob = await response.blob();
      const imageRef = ref(storage, "categories/" + fileName);

      await uploadBytes(imageRef, blob);


      const downloadUrl = await getDownloadURL(imageRef);
      console.log(downloadUrl);

      await savedetails(formData, downloadUrl);
    } catch (error) {
      console.error("Error adding business: ", error);
      
    }
  }

  const savedetails = async(formData,downloadUrl,)=>{
    const id = formData?.meal;
    await setDoc(doc(db, `Meals/${id}/Categories`, Date.now().toString()), {
      Name: formData?.categoryname,
      
      Thumbnail: downloadUrl,
     
    });
  }



  //get the category corresponding the meal
  const getcategory = async(mealid)=>{
    const q = query(collection(db, `Meals/${mealid}/Categories`));

    const querySnapshots = await getDocs(q);
    const categories = querySnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setcategories(categories);
   
    console.log(categories,'mealcategories');

  };

  useEffect(() => {
    getAllcategory();
    getcategory();
  }, []);

  const contextValue = {
    Addcategory,
    getmeal,
    getAllcategory,
    deletedoc,
    updatedata,
    saveproduct,
    storecateImage,
    updateImage,
    savecategories,
    getcategory,
    allcategories
    
  };

  return (
    <OnlineContext.Provider value={contextValue}>
      {props.children}
    </OnlineContext.Provider>
  );
};
