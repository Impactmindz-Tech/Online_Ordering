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
  //store Category Image
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
  

  //save the category details
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
  

 //function to get all category

  const getAllcategory = async () => {
    const q = query(collection(db, "Meals"),orderBy("Id"));

    const querySnapshots = await getDocs(q);
  
    const categories = querySnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setmeal(categories);
   
  };



//delete main category
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
  // delete subcategories
  const deletesubdoc = async (id,imagePath) => {
    try {
      // Delete the document from Firestore
      await deleteDoc(doc(db, "Category", `${id}`));
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

//delete products
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

  // store image into firestore

  // const saveproduct = async (file, formData) => {
  //   try {
  //     const fileName = Date.now().toString() + ".jpg";
  //     const response = await fetch(file);
  //     console.log(formData, "data");
  //     const blob = await response.blob();
  //     const imageRef = ref(storage, "Products/" + fileName);

  //     await uploadBytes(imageRef, blob);
  //     console.log("File uploaded");

  //     const downloadUrl = await getDownloadURL(imageRef);
  //     console.log(downloadUrl);

  //     await saveproductDetail(formData, downloadUrl);
  //   } catch (error) {
  //     console.error("Error adding business: ", error);
  //   }
  // };

  // const saveproductDetail = async (formData, downloadUrl) => {
  //   const mealid = formData?.meal;
  //   const cateid = formData?.categoryId;
  //   console.log(formData?.category, "category");

  //   await setDoc(
  //     doc(
  //       db,
  //       `Meals/${mealid}/Categories/${cateid}/Products`,
  //       Date.now().toString()
  //     ),
  //     {
  //       Name: formData?.dishName,
  //       Category: formData?.category,
  //       isAvailable: formData?.isAvailable,
  //       ImageUrl: downloadUrl,
  //       DietaryInfo: formData?.dietaryInfo,
  //       Description: formData?.description,
  //       Price: formData?.price,
  //     }
  //   );
  // };


//second way

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
      Price: formData?.price,
      Subcategory: formData?.category
    }
  );
};








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




  const updatesubcateImage = async (id, data, file) => {
    try {
      let downloadUrl = file;
  
      // Check if the file is a new image file or an existing URL
      if (!file.startsWith("http")) {
        const fileName = Date.now().toString() + ".jpg";
        const response = await fetch(file);
        const blob = await response.blob();
        const imageRef = ref(storage, "categories/" + fileName);
        await uploadBytes(imageRef, blob);
        downloadUrl = await getDownloadURL(imageRef);
      }
  
      // Update subcategory data with either the new or existing image URL
      updatesubcatdata(id, data, downloadUrl);
    } catch (error) {
      console.error("Error updating subcategory: ", error);
    }
  };

  const updatesubcatdata = async (id, data, downloadUrl) => {
    const docref = doc(db, "Category", id);
    await updateDoc(docref, {
      Name: data.category,
      Category:data.meals,
     Thumbnail: downloadUrl,
    });
    getAllcategory();
  };




  //store all the categories
  // const savecategories = async (file, formData) => {
  //   try {
  //     const fileName = Date.now().toString() + ".jpg";
  //     const response = await fetch(file);
  //     console.log(formData, "data");
  //     const blob = await response.blob();
  //     const imageRef = ref(storage, "categories/" + fileName);

  //     await uploadBytes(imageRef, blob);

  //     const downloadUrl = await getDownloadURL(imageRef);
  //     console.log(downloadUrl);

  //     await savedetails(formData, downloadUrl);
  //   } catch (error) {
  //     console.error("Error adding business: ", error);
  //   }
  // };

  // const savedetails = async (formData, downloadUrl) => {
  //   const id = formData?.meal;
  //   await setDoc(doc(db, `Meals/${id}/Categories`, Date.now().toString()), {
  //     Name: formData?.categoryname,

  //     Thumbnail: downloadUrl,
  //   });
  // };



  //save the subcategories

  const savecategories = async (file, formData) => {
    try {
      const name = formData?.categoryname;
      const category = formData?.meal; // Assuming 'meal' is the category
      const fileName = Date.now().toString() + ".jpg";
      
      // Check if the name already exists within the same category
      const subcategoryRef = collection(db, 'Category');
      const q = query(subcategoryRef, where('Name', '==', name), where('Category', '==', category));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Name already exists within the same category, so do not proceed with upload and saving
        console.log('An entry with this Name already exists in the same Category');
        return;
      }
      
      // Name does not exist within the same category, proceed with upload
      const response = await fetch(file);
      const blob = await response.blob();
      const imageRef = ref(storage, "categories/" + fileName);
      
      await uploadBytes(imageRef, blob);
      
      const downloadUrl = await getDownloadURL(imageRef);
      console.log(downloadUrl);
      
      await savedetails(formData, downloadUrl);
    } catch (error) {
      console.error("Error adding: ", error);
    }
  };
  
  const savedetails = async (formData, downloadUrl) => {
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
      Category: category,
      Thumbnail: downloadUrl,
    });
  };
  















  //get the category corresponding the meal
  const getcategory = async (mealid) => {
    const q = query(collection(db, 'Category'));

    const querySnapshots = await getDocs(q);
    const categories = querySnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setcategories(categories);

    console.log(categories, "mealcategories");
  };

  // const getall category
  // const getAllSubcategories = async () => {
  //   try {
  //     let allSubcategories = [];

  //     // Get all documents in the 'Meals' collection
  //     const mealsCollection = collection(db, "Meals");
  //     const mealsSnapshot = await getDocs(mealsCollection);

  //     // Iterate over each document in the 'Meals' collection
  //     for (const mealDoc of mealsSnapshot.docs) {
  //       const categoriesCollection = collection(
  //         db,
  //         `Meals/${mealDoc.id}/Categories`
  //       );
  //       const categoriesSnapshot = await getDocs(categoriesCollection);

  //       // Collect all categories
  //       categoriesSnapshot.forEach((doc) => {
  //         allSubcategories.push({ mealId: mealDoc.id, ...doc.data() });
  //       });
  //     }
  //     console.log(allSubcategories);
  //     // Update state with all subcategories
  //     setSubcategories(allSubcategories);
  //   } catch (error) {
  //     setError(error.message);
  //     console.error("Error getting subcategories: ", error);
  //   }
  // };


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



  //pagination









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




//getall products
// const getAllproducts = async () => {
//   try {
//     let allSubcategories = [];
//     let allProducts = [];

//     // Get all documents in the 'Meals' collection
//     const mealsCollection = collection(db, "Meals");
//     const mealsSnapshot = await getDocs(mealsCollection);

//     // Iterate over each document in the 'Meals' collection
//     for (const mealDoc of mealsSnapshot.docs) {
//       const categoriesCollection = collection(db, `Meals/${mealDoc.id}/Categories`);
//       const categoriesSnapshot = await getDocs(categoriesCollection);

//       // Collect all categories and their products
//       for (const categoryDoc of categoriesSnapshot.docs) {
//         const categoryData = { mealId: mealDoc.id, categoryId: categoryDoc.id, ...categoryDoc.data() };
//         allSubcategories.push(categoryData);

//         const productsCollection = collection(db, `Meals/${mealDoc.id}/Categories/${categoryDoc.id}/Products`);
//         const productsSnapshot = await getDocs(productsCollection);

//         productsSnapshot.forEach((productDoc) => {
//           allProducts.push({ mealId: mealDoc.id, categoryId: categoryDoc.id, productId: productDoc.id, ...productDoc.data() });
//         });
//       }
//     }


//     setfoodProducts(allProducts);
//   } catch (error) {
//     setError(error.message);
//     console.error("Error getting products: ", error);
//   }
// };




// const updateProducts = async (file, formData,umealId,ucateId,uproductId) => {
//   try {
//     const fileName = Date.now().toString() + ".jpg";
//     const response = await fetch(file);

//     const blob = await response.blob();
//     const imageRef = ref(storage, "Products/" + fileName);
//     console.log(imageRef, "img");

//     await uploadBytes(imageRef, blob);
//     console.log("File uploaded");

//     const downloadUrl = await getDownloadURL(imageRef);
//     console.log(downloadUrl);

//     updateProductsDetails(formData,umealId,ucateId,uproductId,downloadUrl);
//   } catch (error) {
//     console.error("Error adding business: ", error);
//   }
// };

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
      Price:formData.price,
      Name:formData.dishName,
      isAvailable:formData.isAvailable,
      ImageUrl:downloadUrl
    });
    console.log("Product updated successfully");
    
 
  } catch (error) {

    console.error("Error updating product: ", error);
  }
}






// const updateProductsDetails = async(formData,mealId,categoryId,productId,downloadUrl)=>{
//   try {
//     const productRef = doc(db, `Meals/${mealId}/Categories/${categoryId}/Products/${productId}`);
//     await updateDoc(productRef, {
//       Category:formData?.category,
//       Description:formData?.description,
//       DietaryInfo:formData.dietaryInfo,
//       Price:formData.price,
//       Name:formData.dishName,
//       isAvailable:formData.isAvailable,
//       ImageUrl:downloadUrl
//     });
//     console.log("Product updated successfully");
    
 
//   } catch (error) {

//     console.error("Error updating product: ", error);
//   }
// }





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
    updateProducts,deletesubdoc ,updatesubcateImage,totalCategory,totalpro,totalsub
    
  };

  return (
    <OnlineContext.Provider value={contextValue}>
      {props.children}
    </OnlineContext.Provider>
  );
};
