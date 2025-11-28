import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../../components/Login/Login.jsx";
import Layout from "../../components/Layout/Layout.jsx";
import AdminLayout from "../../components/AdminLayout/AdminLayout.jsx";
import UserHome from "../../components/UserHome/UserHome.jsx";
import Profile from "../../components/Profile/Profile.jsx";
import Offers from "../../components/Offers/Offers.jsx";
import Sports from "../../components/Sports/Sports.jsx";
import QRScan from "../../components/QRScan/QRScan.jsx";
import StudentID from "../../components/StudentID/StudentID.jsx";
import Schedule from "../../components/Schedule/Schedule.jsx";
import AdminDashboard from "../../components/AdminDashboard/AdminDashboard.jsx";
import Users from "../../components/Users/Users.jsx";
import EditUser from "../../components/EditUser/EditUser.jsx";
import ManageContent from "../../components/ManageContent/ManageContent.jsx";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute.jsx";
import CreateUser from "../../components/CreateUser/CreateUser.jsx";
import Subscribers from  "../../components/Subscribers/Subscribers.jsx";
import RenewSubscriptionPage from "../../components/RenewSubscription/RenewSubscription.jsx";
import SubscriberDetails from "../../components/SubscriberDetails/SubscriberDetails.jsx";
import UpdateSubscriber from "../../components/UpdateSubscriber/UpdateSubscriber.jsx";
import ForgotPassword from "../ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "../../components/ResetPassword/ResetPassword.jsx";
import BannersDashboard from "../../components/BannersDashboard/BannerDashboard.jsx";
import CategoriesDashboard from "../../components/CatrgoriesDashboard/CategoriesDashboard.jsx";
import AddCategory from "../../components/CatrgoriesDashboard/AddCategory.jsx";
export default function AppRoutes() {
  return (
    <Routes>
     {/* ---- Login ---- */}
      <Route path="/login" element={<Login />} />

           {/* ---- Forgot / Reset Password ---- */}
   <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />

      {/* ---- Redirect / to /login ---- */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ---- User Layout ---- */}
  <Route element={<ProtectedRoute role={["user","subscriber"]}><Layout /></ProtectedRoute>}>
        <Route path="/user/home" element={<UserHome />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/offers" element={<Offers />} />
        <Route path="/user/sports" element={<Sports />} />
        <Route path="/user/qr" element={<QRScan />} />
        <Route path="/user/student-id" element={<StudentID />} />
        <Route path="/user/schedule" element={<Schedule />} />

      </Route>

      {/* ---- Admin Layout ---- */}
<Route element={<ProtectedRoute role={["admin", "super_admin"]}><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/users/edit/:id" element={<EditUser />} />
        <Route path="/admin/manage" element={<ManageContent />} />
        <Route path="/admin/create-user" element={<CreateUser />} />
        <Route path="/admin/subscribers" element={<Subscribers />} />
        <Route path="/admin/subscribers/renew/:id" element={<RenewSubscriptionPage />} />
        <Route path="/admin/subscribers/:id" element={<SubscriberDetails />} />
        <Route path="/admin/subscribers/update/:id" element={<UpdateSubscriber />} />
        <Route path="/admin/banners" element={<BannersDashboard />} />
        <Route path="/admin/categories" element={<CategoriesDashboard />} />
        <Route path="/admin/categories/add" element={<AddCategory />} />
        
      </Route>

      {/* ---- 404 Page ---- */}
      <Route path="*" element={<h1 className="text-center text-3xl mt-20">Page Not Found</h1>} />
    </Routes>
  );
}

