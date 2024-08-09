import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthRoute from './AuthRoute'; // Import the AuthRoute component

// Lazy-loaded components
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const AddProduct = React.lazy(() => import('./views/restaurant/products/Addproduct'));
const Product = React.lazy(() => import('./views/restaurant/products/Product'));
const Meal = React.lazy(() => import('./views/restaurant/meal/AddMeals'));
const Order = React.lazy(() => import('./views/restaurant/orders/Order'));
const Categories = React.lazy(() => import('./views/restaurant/meal/AddCategories'));
const Widgets = React.lazy(() => import('./views/widgets/Widgets'));
const Login = React.lazy(() => import('./views/pages/login/Login')); // Assuming you have a Login component

const isAuthenticated = () => {
  // Check if user UID exists in localStorage
  return !!localStorage.getItem('userUID');
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<AuthRoute isAuthenticated={isAuthenticated()} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/restaurant/allproducts" element={<Product />} />
        <Route path="/restaurant/addproducts" element={<AddProduct />} />
        <Route path="/restaurant/addmeals" element={<Meal />} />
        <Route path="/restaurant/addcategories" element={<Categories />} />
        <Route path="/restaurant/orders" element={<Order />} />
        <Route path="/widgets" element={<Widgets />} />
      </Route>

      {/* Redirect to /dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
