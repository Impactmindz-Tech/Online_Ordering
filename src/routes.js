import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

//restaurantt

// restaurant
const Accordion = React.lazy(() => import('./views/restaurant/accordion/Accordion'))
const Category = React.lazy(() => import('./views/restaurant/category/Category'))
const Product = React.lazy(() => import('./views/restaurant/products/Product'))
const Carousels = React.lazy(() => import('./views/restaurant/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/restaurant/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/restaurant/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/restaurant/navs/Navs'))
const Paginations = React.lazy(() => import('./views/restaurant/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/restaurant/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/restaurant/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/restaurant/progress/Progress'))
const Spinners = React.lazy(() => import('./views/restaurant/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/restaurant/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/restaurant/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/restaurant/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },

  { path: '/restaurant/accordion', name: 'Accordion', element: Accordion },

  { path: '/restaurant/category', name: 'Category', element: Category },
  { path: '/restaurant/products', name: 'Product', element: Product },
  { path: '/restaurant/carousels', name: 'Carousel', element: Carousels },
  { path: '/restaurant/collapses', name: 'Collapse', element: Collapses },
  { path: '/restaurant/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/restaurant/navs', name: 'Navs', element: Navs },
  { path: '/restaurant/paginations', name: 'Paginations', element: Paginations },
  { path: '/restaurant/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/restaurant/popovers', name: 'Popovers', element: Popovers },
  { path: '/restaurant/progress', name: 'Progress', element: Progress },
  { path: '/restaurant/spinners', name: 'Spinners', element: Spinners },
  { path: '/restaurant/tabs', name: 'Tabs', element: Tabs },
  { path: '/restaurant/tables', name: 'Tables', element: Tables },
  { path: '/restaurant/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
