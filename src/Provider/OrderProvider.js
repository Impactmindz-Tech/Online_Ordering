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
  onSnapshot,
} from "firebase/firestore";
const db = getFirestore(app);
export const OnlineContext = createContext(null);
export const OnlineContextProvider = (props) => {
  const [getmeal, setmeal] = useState([]);
  const [allcategorie, setcategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const[foodprod,setfoodProducts] = useState([]);

  const [cat, setCat] = useState([]);

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
      getAllcategory();
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
    const cateid = formData?.categoryId;
    console.log(formData?.category, "category");

    await setDoc(
      doc(
        db,
        `Meals/${mealid}/Categories/${cateid}/Products`,
        Date.now().toString()
      ),
      {
        Name: formData?.dishName,
        Category: formData?.category,
        isAvailable: formData?.isAvailable,
        ImageUrl: downloadUrl,
        DietaryInfo: formData?.dietaryInfo,
        Description: formData?.description,
        Price: formData?.price,
      }
    );
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
  const savecategories = async (file, formData) => {
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
  };

  const savedetails = async (formData, downloadUrl) => {
    const id = formData?.meal;
    await setDoc(doc(db, `Meals/${id}/Categories`, Date.now().toString()), {
      Name: formData?.categoryname,

      Thumbnail: downloadUrl,
    });
  };

  //get the category corresponding the meal
  const getcategory = async (mealid) => {
    const q = query(collection(db, `Meals/${mealid}/Categories`));

    const querySnapshots = await getDocs(q);
    const categories = querySnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setcategories(categories);

    console.log(categories, "mealcategories");
  };

  // const getall category
  const getAllSubcategories = async () => {
    try {
      let allSubcategories = [];

      // Get all documents in the 'Meals' collection
      const mealsCollection = collection(db, "Meals");
      const mealsSnapshot = await getDocs(mealsCollection);

      // Iterate over each document in the 'Meals' collection
      for (const mealDoc of mealsSnapshot.docs) {
        const categoriesCollection = collection(
          db,
          `Meals/${mealDoc.id}/Categories`
        );
        const categoriesSnapshot = await getDocs(categoriesCollection);

        // Collect all categories
        categoriesSnapshot.forEach((doc) => {
          allSubcategories.push({ mealId: mealDoc.id, ...doc.data() });
        });
      }
      console.log(allSubcategories);
      // Update state with all subcategories
      setSubcategories(allSubcategories);
    } catch (error) {
      setError(error.message);
      console.error("Error getting subcategories: ", error);
    }
  };



//getall products
const getAllproducts = async () => {
  try {
    let allSubcategories = [];
    let allProducts = [];

    // Get all documents in the 'Meals' collection
    const mealsCollection = collection(db, "Meals");
    const mealsSnapshot = await getDocs(mealsCollection);

    // Iterate over each document in the 'Meals' collection
    for (const mealDoc of mealsSnapshot.docs) {
      const categoriesCollection = collection(db, `Meals/${mealDoc.id}/Categories`);
      const categoriesSnapshot = await getDocs(categoriesCollection);

      // Collect all categories and their products
      for (const categoryDoc of categoriesSnapshot.docs) {
        const categoryData = { mealId: mealDoc.id, categoryId: categoryDoc.id, ...categoryDoc.data() };
        allSubcategories.push(categoryData);

        const productsCollection = collection(db, `Meals/${mealDoc.id}/Categories/${categoryDoc.id}/Products`);
        const productsSnapshot = await getDocs(productsCollection);

        productsSnapshot.forEach((productDoc) => {
          allProducts.push({ mealId: mealDoc.id, categoryId: categoryDoc.id, productId: productDoc.id, ...productDoc.data() });
        });
      }
    }


    setfoodProducts(allProducts);
  } catch (error) {
    setError(error.message);
    console.error("Error getting products: ", error);
  }
};





  useEffect(() => {
    getAllSubcategories();
    getcategory();
    getAllproducts();
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
    allcategorie,
    subcategories,
    getAllSubcategories,
    foodprod
    
  };

  return (
    <OnlineContext.Provider value={contextValue}>
      {props.children}
    </OnlineContext.Provider>
  );
};
