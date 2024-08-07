import React, { createContext, useEffect, useState } from "react";
import { app, storage, db,auth } from "../config/Firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { CAlert } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCheckCircle, cilWarning } from "@coreui/icons";
import { createUserWithEmailAndPassword } from "firebase/auth";

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
  startAfter,
} from "firebase/firestore";
import { Category } from "@mui/icons-material";

export const OnlineContext = createContext(null);
export const OnlineContextProvider = (props) => {
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [getmeal, setmeal] = useState([]);
  const [allcategorie, setcategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [foodprod, setfoodProducts] = useState([]);
  const[location,setlocation]  = useState([]);
  const[summary,setSummary] = useState([]);
  const[Schedule, setSchedule] = useState([]);
  const [orders, setOrders] = useState([]);

  //store Meals

  const signup = async(data)=>{
    const{email,password} = data;
    console.log(data);
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
   
    const user = userCredential.user;
 
    console.log(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
  }


  const storecateImage = async (file, category) => {
    try {
      // Check if the category already exists
      const categoryRef = collection(db, "Mealsdemo");
      const q = query(categoryRef, where("Name", "==", category));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Category already exists
      
        setAlert({
          show: true,
          message: "A category with this name already exists",
          type: "danger",
          visible: true,
        });
        return;
      }

      let downloadUrl = null;

      // Proceed with image upload if file is provided
      if (file) {
        const fileName = Date.now().toString() + ".jpg";
        const response = await fetch(file);
        const blob = await response.blob();
        const imageRef = ref(storage, "mealsdemo/" + fileName);

        await uploadBytes(imageRef, blob);
       

        downloadUrl = await getDownloadURL(imageRef);

      }

      await Addcategory(downloadUrl, category);
      getAllcategory();
      setAlert({
        show: true,
        message: "Category added successfully",
        type: "success",
        visible: true,
      });
    } catch (error) {
      console.error("Error adding category: ", error);
      setAlert({
        show: true,
        message: "Error adding category",
        type: "danger",
        visible: true,
      });
    }
  };

  // Save the Meal details
  const Addcategory = async (downloadUrl, category) => {
    // Reference to the 'Meals' collection
    const onlineOrderRef = collection(db, "Mealsdemo");

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
    const newCategoryData = {
      Name: category,
      Id: currentId + 1, // Increment the highest Id
    };

    if (downloadUrl) {
      newCategoryData.ImageUrl = downloadUrl;
    }

    await setDoc(newDocRef, newCategoryData);

    
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
        const imageRef = ref(storage, "Mealsdemo/" + fileName);
        await uploadBytes(imageRef, blob);
        downloadUrl = await getDownloadURL(imageRef);
      }

      // Update data with either the new or existing image URL
      updatedata(id, data, downloadUrl);
      setAlert({
        show: true,
        message: "Update Meal successfully",
        type: "success",
        visible: true,
      });
    } catch (error) {
      console.error("Error updating image: ", error);
      setAlert({
        show: true,
        message: "Not Updated",
        type: "danger",
        visible: true,
      });
    }
  };

  const updatedata = async (id, data, downloadUrl) => {
    const docref = doc(db, "Mealsdemo", id);
   
    try {
      await updateDoc(docref, {
        Name: {
          en: data.en,
          he: data.he,
          ru: data.ru,
        },
        ImageUrl: downloadUrl,
      });
      setAlert({
        show: true,
        message: "Update successfully",
        type: "success",
        visible: true,
      });
    } catch (error) {
      setAlert({
        show: true,
        message: "Update failed",
        type: "danger",
        visible: true,
      });
    }

    getAllcategory();
  };

  //function to get all Meals

  //delete MEal category
  const deletedoc = async (id, imagePath) => {
    try {
      // Delete the document from Firestore
      await deleteDoc(doc(db, "Mealsdemo", `${id}`));


      // Reference to the image file in Firebase Storage
      const imageRef = ref(storage, imagePath);
     

      // Delete the image file from Firebase Storage
      await deleteObject(imageRef);
     

      setAlert({
        show: true,
        message: "Delete successfully",
        type: "success",
        visible: true,
      });
      getAllcategory();
    } catch (error) {
      console.error("Error deleting document or image file:", error);
      setAlert({
        show: true,
        message: "Can not deleted",
        type: "danger",
        visible: true,
      });
    }
  };

  //products

  const saveproduct = async (file, formData) => {
    try {
      const productName = formData?.dishName;
      const productMeal = formData?.meal;
      const productCategory = formData?.category;
  
      // Check if the product already exists with the same name, meal, and category
      const productsRef = collection(db, "Productsdemo");
      const q = query(
        productsRef,
        where("Name", "==", productName),
        where("category", "==", productCategory),
        where("meal", "==", productMeal)
      );
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // Product already exists with the same name, category, and meal
      
        setAlert({
          show: true,
          message: "A product with this name, category, and meal already exists",
          type: "danger",
          visible: true,
        });
        return;
      }
  
      let downloadUrl = null;
  
      // If a file is provided, proceed with uploading the image
      if (file) {
        try {
          const fileName = Date.now().toString() + ".jpg";
          const response = await fetch(file);
          if (!response.ok) throw new Error("File fetch failed");
          const blob = await response.blob();
          const imageRef = ref(storage, "Productsdemo/" + fileName);
  
          await uploadBytes(imageRef, blob);
        
          downloadUrl = await getDownloadURL(imageRef);
     
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          setAlert({
            show: true,
            message: "Failed to upload file. Please try again.",
            type: "danger",
            visible: true,
          });
          return;
        }
      }
  
      // Save product details
      await saveproductDetail(formData, downloadUrl);
      setAlert({
        show: true,
        message: "Product successfully added",
        type: "success",
        visible: true,
      });
  
    } catch (error) {
      console.error("Error adding product:", error);
      setAlert({
        show: true,
        message: "Error adding product. Please try again.",
        type: "danger",
        visible: true,
      });
    }
  };
  
  const saveproductDetail = async (formData, downloadUrl) => {
    try {
      // Fetch category data
      const q = query(collection(db, "Categorydemo"), where("Name.en", "==", formData.category));
      const querySnapshot = await getDocs(q);
  
      let categoryData = null;
      querySnapshot.forEach((doc) => {
        categoryData = doc.data(); // Assuming you want the first match
      });
  
      if (!categoryData) {
       
        setAlert({
          show: true,
          message: "No matching category found.",
          type: "danger",
          visible: true,
        });
        return;
      }
  
      // Extract only ar, he, and en values from category
      const filteredCategoryData = {
        ru: categoryData.Name.ru,
        he: categoryData.Name.he,
        en: categoryData.Name.en,
      };
  
      // Fetch meal data
      const m = query(collection(db, "Mealsdemo"), where("Name.en", "==", formData.meal));
      const mSnapshot = await getDocs(m);
  
      let mealData = null;
      mSnapshot.forEach((doc) => {
        mealData = {
          ...doc.data(), // Spread the document data
          id: doc.id,   // Add the document id
        };
      });
  
      if (!mealData) {
  
        setAlert({
          show: true,
          message: "No matching meal found.",
          type: "danger",
          visible: true,
        });
        return;
      }
  
      // Extract Name and id from meal data
      const filteredMealData = {
        Name: mealData.Name.en,
        id: mealData.id,
      };
  
     
  
      // Save product details
      await setDoc(doc(db, "Productsdemo", Date.now().toString()), {
        Name: formData?.dishName,
        category: filteredCategoryData, // Saving only ar, he, and en values
        meal: filteredMealData, // Saving both Name and id
        isAvailable: formData?.isAvailable,
        ImageUrl: downloadUrl, // This can be null if no image is uploaded
        DietaryInfo: formData?.dietaryInfo,
        Description: formData?.description,
        // Assuming Subcategory is part of formData
      });
  
    } catch (error) {
      console.error("Error saving product details:", error);
      setAlert({
        show: true,
        message: "Error saving product details. Please try again.",
        type: "danger",
        visible: true,
      });
    }
  };
  

  const updateProducts = async (file, formData, uproductId) => {
    try {
      let downloadUrl = file;

      // Check if the file is a new image file or an existing URL
      if (!file.startsWith("http")) {
        const fileName = Date.now().toString() + ".jpg";
       
        const response = await fetch(file);
     
        const blob = await response.blob();
        const imageRef = ref(storage, "Productsdemo/" + fileName);
    
        await uploadBytes(imageRef, blob);
 
        downloadUrl = await getDownloadURL(imageRef);
        setAlert({
          show: true,
          message: "Product updated successfully",
          type: "success",
          visible: true,
        });
   
      }

      // Update product details with either the new or existing image URL
      updateProductsDetails(formData, downloadUrl, uproductId);
    } catch (error) {
  
      setAlert({
        show: true,
        message: "Product Not Updated",
        type: "danger",
        visible: true,
      });
    }
  };

  const updateProductsDetails = async (formData, downloadUrl, uproductId) => {
  
    try {
      const productRef = doc(db, `Productsdemo/${uproductId}`);
      await updateDoc(productRef, {
        category: formData?.category,
        Description: formData?.description,
        DietaryInfo: formData.dietaryInfo,
        meal: formData?.meal,
        Name: formData.dishName,
        isAvailable: formData.isAvailable,
        ImageUrl: downloadUrl,
      });
      setAlert({
        show: true,
        message: "Product updated successfully",
        type: "success",
        visible: true,
      });
    } catch (error) {
      console.error("Error updating product: ", error);
      setAlert({
        show: true,
        message: "Product Not Added",
        type: "danger",
        visible: true,
      });
    }
  };

  const deleteProduct = async (id, imagePath) => {
    
    try {
      // Delete the document from Firestore
      await deleteDoc(doc(db, "Productsdemo", `${id}`));


      // Reference to the image file in Firebase Storage
      const imageRef = ref(storage, imagePath);
  

      // Delete the image file from Firebase Storage
      await deleteObject(imageRef);
   
      // Call the function to refresh the categories
      setAlert({
        show: true,
        message: "Product deleted successfully",
        type: "success",
        visible: true,
      });
      getAllcategory();
    } catch (error) {
      // console.error("Error deleting document or image file:", error);
      setAlert({
        show: true,
        message: "Product is Not Deleted",
        type: "danger",
        visible: true,
      });
    }
  };

  const getAllcategory = async () => {
    try {
      // Create a query to order documents by "Id"
      const q = query(collection(db, "Mealsdemo"), orderBy("Id"));

      // Fetch documents
      const querySnapshots = await getDocs(q);

      // Map documents to an array of categories
      const categories = querySnapshots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));


      // Update state with fetched categories
      setmeal(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  //category

  const savecategories = async (formData) => {

    const category = formData?.meal; // Assuming 'meal' is the category
    const name = formData?.Name; // Ensure this matches the name field in formData

    const qs = query(collection(db, "Mealsdemo"), where("Name.en", "==", category));
      const querySnapshots = await getDocs(qs);
  
      let categoryData = null;
      querySnapshots.forEach((doc) => {
        categoryData = doc.data(); // Assuming you want the first match
      });
  
      if (!categoryData) {
     
        return;
      }
  
      // Extract only ar, he, and en values from category
      const filteredCategoryData = {
        ru: categoryData.Name.ru,
        he: categoryData.Name.he,
        en: categoryData.Name.en,
      };
  
  

    // Check if category or name is undefined
    if (!category || !name) {
      console.error("Category or Name is undefined.");
      setAlert({
        show: true,
        message: "Category or Name is required.",
        type: "danger",
        visible: true,
      });
      return;
    }

    // Reference to the collection
    const subcategoryRef = collection(db, "Categorydemo");

    // Query to check if the name already exists within the same category
    const q = query(
      subcategoryRef,
      where("Name", "==", name),
      where("Category", "==", category)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Name already exists within the same category
   
      setAlert({
        show: true,
        message: "An entry with this Name already exists in the same Category",
        type: "danger",
        visible: true,
      });
      return;
    }

    // If name doesn't exist within the same category, proceed to save the new entry
    await setDoc(doc(db, "Categorydemo", Date.now().toString()), {
      Name: name,
      Category: filteredCategoryData,
    });

    setAlert({
      show: true,
      message: "New Category Added successfully",
      type: "success",
      visible: true,
    });
  };

  const updatesubcatdata = async (id, data) => {
    const docref = doc(db, "Category", id);
    await updateDoc(docref, {
      Name: data.category,
      Category: data.meals,
    });
    setAlert({
      show: true,
      message: "Category Updated successfully",
      type: "success",
      visible: true,
    });
    getAllcategory();
  };

  // delete subcategories
  const deletesubdoc = async (id) => {
    try {
      await deleteDoc(doc(db, "Categorydemo", id));

      setAlert({
        show: true,
        message: "Category deleted successfully",
        type: "success",
        visible: true,
      });

      getAllcategory();
    } catch (error) {
      setAlert({
        show: true,
        message: "Failed to delete the category. Please try again later.",
        type: "danger",
        visible: true,
      });
    }
  };

  const getCategories = async () => {
    try {
      const q = query(collection(db, "Categorydemo"));
      const querySnapshots = await getDocs(q);

      const categories = querySnapshots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setcategories(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getAllproducts = async () => {
    // Define the query to get all products from the "Products" collection
    const q = query(collection(db, "Productsdemo"));

    // Set up a real-time listener for the query
    const unsubscribe = onSnapshot(
      q,
      { includeMetadataChanges: true },
      (snapshot) => {
        const products = [];

        // Iterate through the document changes
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            // You can add additional handling for added documents if needed
          }
        });

        // Collect all documents data into the products array, including the document ID
        snapshot.docs.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() });
        });

        // Determine the source of the data
        const source = snapshot.metadata.fromCache ? "local cache" : "server";

        // Update the state with the new products data
        setfoodProducts(products);
        
      }
    );

    // Return the unsubscribe function to stop listening for updates when needed
    return unsubscribe;
  };

  const getAllOrder = () => {
    const q = query(collection(db, "Orders")); // Example with ordering by timestamp
  
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orders);
      
        // Process and log order details
        orders.forEach((order) => {
          const location = order.location || {};
          const summary = order.summary || {};
          const schedule = order.schedule || {};
  
          // Extracting location details
          const city = location.city || '';
          const state = location.state || '';
          const postalCode = location.postcode || '';
          const country = location.country || '';
          const railway = location.railway || '';
          const road = location.road || '';
          const stateDistrict = location.state_district || '';
          const suburb = location.suburb || '';
  
          // Extracting summary details
          const breakfast = summary.breakfast || [];
          const lunch = summary.lunch || [];
          const dinner = summary.dinner || [];
  
          // Set the details or use as needed
          setlocation({
            city,
            state,
            country,
            postalCode,
            railway,
            road,
            stateDistrict,
            suburb
          });
  
          setSummary({
            breakfast,
            lunch,
            dinner
          });
  
          setSchedule({
            staying: schedule.Staying || false,
            tomorrow: schedule.Tomorrow || false,
            week: schedule.Week || false
          });
  
          // Log order details for debugging
       
        });
      },
      (error) => {
        console.error("Error fetching orders:", error);
        // Handle the error appropriately
      }
    );
  
    // Cleanup listener when no longer needed
    return () => unsubscribe();
  };
  


  

  useEffect(() => {
    getAllcategory();
    getCategories();
    getAllproducts();
    getAllOrder();
  }, []);

  const contextValue = {
    Addcategory,
    getmeal,
    getAllcategory,
    deletedoc,
    updatedata,
    saveproduct,
    deleteProduct,
    storecateImage,
    updateImage,
    savecategories,

    allcategorie,
    subcategories,
    foodprod,
    getAllproducts,
    updateProducts,
    deletesubdoc,

    updatesubcatdata,
    alert,
    setAlert,
    getAllOrder,
    location,
    summary,
    Schedule,
    orders,signup
  
  };

  return (
    <OnlineContext.Provider value={contextValue}>
      {props.children}
    </OnlineContext.Provider>
  );
};
