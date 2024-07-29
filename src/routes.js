import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
// const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const AddProduct = React.lazy(() => import('./views/restaurant/products/Addproduct'))

//restaurantt

// restaurant


const Product = React.lazy(() => import('./views/restaurant/products/Product'))
const Meal = React.lazy(() => import('./views/restaurant/meal/AddMeals'));
const Order = React.lazy(() => import('./views/restaurant/orders/Order'))
const Categories = React.lazy(() => import('./views/restaurant/meal/AddCategories'));



const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },



  { path: '/restaurant/allproducts', name: 'All Product', element: Product },
  { path: '/restaurant/addproducts', name: 'Add Products', element: AddProduct },
  { path: '/restaurant/addmeals', name: 'Add Meals', element: Meal },
  { path: '/restaurant/addcategories', name: 'Add Categories', element: Categories },

  { path: '/restaurant/orders', name: 'Orders', element: Order },

  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
