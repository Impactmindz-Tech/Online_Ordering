import React, { createContext, useEffect, useState } from "react";
import { app, storage } from "../config/Firebase";
import { getDownloadURL, ref, uploadBytes ,deleteObject} from "firebase/storage";

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
  onSnapshot,startAfter
} from "firebase/firestore";
import { Category } from "@mui/icons-material";
const db = getFirestore(app);
export const OnlineContext = createContext(null);
export const OnlineContextProvider = (props) => {
  const [getmeal, setmeal] = useState([]);
  const [allcategorie, setcategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const[foodprod,setfoodProducts] = useState([]);

  const [lastDoc, setLastDoc] = useState(null);
  const [cat, setCat] = useState([]);
  const[totalCategory,setlengthCate] = useState([]);

  const[totalsub,setsub]  = useState();

  const[totalpro,setlenpro] = useState();





  //store Meals
  const storecateImage = async (file, category) => {
    try {
      // Check if the category already exists
      const categoryRef = collection(db, 'Meals');
      const q = query(categoryRef, where('Name', '==', category));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Category already exists
        console.log('A category with this name already exists');
    
        return;
      }
  
      // Proceed with image upload if category does not exist
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
      console.error("Error adding category: ", error);
    
    }
  };
  

  //save the Meal details
  const Addcategory = async (downloadUrl, category) => {
    // Reference to the 'Meals' collection
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
  
    // Generate a new document ID within the 'Meals' collection
    const newDocRef = doc(onlineOrderRef);
  
    // Update the document with new data
    await setDoc(newDocRef, {
      Name: category,
      ImageUrl: downloadUrl,
      Id: currentId + 1  // Increment the highest Id
    });
  
    console.log("Category added successfully");
  };
  

// update meal

  const updateImage = async (id, data, file) => {
    try {
      let downloadUrl = file;
  
      // Check if the file is a new image file or an existing URL
      if (!file.startsWith("http")) {
        const fileName = Date.now().toString() + ".jpg";
        const response = await fetch(file);
        const blob = await response.blob();
        const imageRef = ref(storage, "Meals/" + fileName);
        await uploadBytes(imageRef, blob);
        downloadUrl = await getDownloadURL(imageRef);
      }
  
      // Update data with either the new or existing image URL
      updatedata(id, data, downloadUrl);
    } catch (error) {
      console.error("Error updating image: ", error);
    }
  };
  
  
 const updatedata = async (id, data, downloadUrl) => {
      const docref = doc(db, "Meals", id);
      await updateDoc(docref, {
        Name: data,
        ImageUrl: downloadUrl,
      });
      getAllcategory();
    };
  

 //function to get all Meals

  const getAllcategory = async () => {
    const q = query(collection(db, "Meals"),orderBy("Id"));

    const querySnapshots = await getDocs(q);
  
    const categories = querySnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setmeal(categories);
   
  };

//delete MEal category
const deletedoc = async (id, imagePath) => {
  try {
    // Delete the document from Firestore
    await deleteDoc(doc(db, "Meals", `${id}`));
    console.log(`Document with id ${id} deleted`);

    // Reference to the image file in Firebase Storage
    const imageRef = ref(storage, imagePath);
    console.log(imageRef);

    // Delete the image file from Firebase Storage
    await deleteObject(imageRef);
    console.log(`Image file at ${imagePath} deleted`);

    // Call the function to refresh the categories
    getAllcategory();
  } catch (error) {
    console.error("Error deleting document or image file:", error);
  }
};






//products

const saveproduct = async (file, formData) => {
  try {
    const productName = formData?.dishName;
    
    // Check if the product already exists
    const productsRef = collection(db, 'Products');
    const q = query(productsRef, where('Name', '==', productName));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Product already exists
      console.log('A product with this name already exists');
      return;
    }

    // If the product does not exist, proceed with uploading the image
    const fileName = Date.now().toString() + ".jpg";
    const response = await fetch(file);
    const blob = await response.blob();
    const imageRef = ref(storage, "Products/" + fileName);
    
    await uploadBytes(imageRef, blob);
    console.log("File uploaded");

    const downloadUrl = await getDownloadURL(imageRef);
    console.log(downloadUrl);

    // Save product details
    await saveproductDetail(formData, downloadUrl);
  } catch (error) {
    console.error("Error adding product: ", error);
  }
};

const saveproductDetail = async (formData, downloadUrl) => {
  await setDoc(
    doc(db, 'Products', Date.now().toString()),
    {
      Name: formData?.dishName,
      Category: formData?.mealName,
      isAvailable: formData?.isAvailable,
      ImageUrl: downloadUrl,
      DietaryInfo: formData?.dietaryInfo,
      Description: formData?.description,
      
      Subcategory: formData?.category
    }
  );
};


const updateProducts = async (file, formData, uproductId) => {
  try {
    let downloadUrl = file;

    // Check if the file is a new image file or an existing URL
    if (!file.startsWith("http")) {
      const fileName = Date.now().toString() + ".jpg";
      console.log(fileName, 'djkfhk');
      const response = await fetch(file);
      console.log(response, 'response');
      const blob = await response.blob();
      const imageRef = ref(storage, "Products/" + fileName);
      console.log(imageRef, "img");

      await uploadBytes(imageRef, blob);
      console.log("File uploaded");

      downloadUrl = await getDownloadURL(imageRef);
      console.log(downloadUrl);
    }

    // Update product details with either the new or existing image URL
    updateProductsDetails(formData, downloadUrl, uproductId);
  } catch (error) {
    console.error("Error updating product: ", error);
  }
};


const updateProductsDetails = async(formData,downloadUrl,uproductId)=>{
  try {
    const productRef = doc(db, `Products/${uproductId}`);
    await updateDoc(productRef, {
      Category:formData?.category,
      Description:formData?.description,
      DietaryInfo:formData.dietaryInfo,
    
      Name:formData.dishName,
      isAvailable:formData.isAvailable,
      ImageUrl:downloadUrl
    });
    console.log("Product updated successfully");
    
 
  } catch (error) {

    console.error("Error updating product: ", error);
  }
}



const deleteProduct = async(id,imagePath)=>{
  try {
    // Delete the document from Firestore
    await deleteDoc(doc(db, "Product", `${id}`));
    console.log(`Document with id ${id} deleted`);

    // Reference to the image file in Firebase Storage
    const imageRef = ref(storage, imagePath);
    console.log(imageRef);

    // Delete the image file from Firebase Storage
    await deleteObject(imageRef);
    console.log(`Image file at ${imagePath} deleted`);

    // Call the function to refresh the categories
    getAllcategory();
  } catch (error) {
    console.error("Error deleting document or image file:", error);
  }
}










//category

const savecategories = async (formData) => {
  const category = formData?.meal; // Assuming 'meal' is the category
  const name = formData?.categoryname;
  
  // Reference to the collection
  const subcategoryRef = collection(db, 'Category');
  
  // Query to check if the name already exists within the same category
  const q = query(subcategoryRef, where('Name', '==', name), where('Category', '==', category));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    // Name already exists within the same category
    console.log('An entry with this Name already exists in the same Category.');
    // Handle the situation accordingly, e.g., show a notification to the user
    return;
  }
  
  // If name doesn't exist within the same category, proceed to save the new entry
  await setDoc(doc(db, 'Category', Date.now().toString()), {
    Name: name,
    Category: category
  
  });
};



  const updatesubcatdata = async (id, data) => {
    const docref = doc(db, "Category", id);
    await updateDoc(docref, {
      Name: data.category,
      Category:data.meals
    
    });
    getAllcategory();
  };


  // delete subcategories
  const deletesubdoc = async (id) => {
    try {
      // Delete the document from Firestore
      await deleteDoc(doc(db, "Category", `${id}`));
      console.log(`Document with id ${id} deleted`);
  
      getAllcategory();
    } catch (error) {
      console.error("Error deleting document ", error);
    }
   
  };













  //get the category corresponding the meal
  const getcategory = async () => {
    const q = query(collection(db, 'Category'));

    const querySnapshots = await getDocs(q);
    const categories = querySnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setcategories(categories);

    console.log(categories, "mealcategories");
  };

 

  const getAllSubcategories = async () => {
    const q = query(collection(db, "Category"));

    const querySnapshots = await getDocs(q);
    const lensubcategories = querySnapshots.size;
    setsub(lensubcategories);
    const subcategories = querySnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setSubcategories(subcategories);
   
  };




  const getAllproducts = async () => {
    const q = query(collection(db, "Products"));

    const querySnapshots = await getDocs(q);
    const lenproducts = querySnapshots.size;
    setlenpro(lenproducts);
    const products = querySnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setfoodProducts(products);
   
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
    saveproduct,deleteProduct,
    storecateImage,
    updateImage,
    savecategories,
    getcategory,
    allcategorie,
    subcategories,
    getAllSubcategories,
    foodprod,
    getAllproducts,
    updateProducts,deletesubdoc ,totalCategory,totalpro,totalsub,updatesubcatdata
    
  };

  return (
    <OnlineContext.Provider value={contextValue}>
      {props.children}
    </OnlineContext.Provider>
  );
};
