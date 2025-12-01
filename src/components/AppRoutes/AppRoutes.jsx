// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "../../components/Login/Login.jsx";
// import Layout from "../../components/Layout/Layout.jsx";
// import AdminLayout from "../../components/AdminLayout/AdminLayout.jsx";
// import UserHome from "../../components/UserHome/UserHome.jsx";
// import Profile from "../../components/Profile/Profile.jsx";
// import Offers from "../../components/Offers/Offers.jsx";
// import Qrscanner from "../qrscanner/qrscanner.jsx";
// import StudentID from "../../components/StudentID/StudentID.jsx";
// import Schedule from "../../components/Schedule/Schedule.jsx";
// import AdminDashboard from "../../components/AdminDashboard/AdminDashboard.jsx";
// import Users from "../../components/Users/Users.jsx";
// import EditUser from "../../components/EditUser/EditUser.jsx";
// import ManageContent from "../../components/ManageContent/ManageContent.jsx";
// import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute.jsx";
// import CreateUser from "../../components/CreateUser/CreateUser.jsx";
// import Subscribers from  "../../components/Subscribers/Subscribers.jsx";
// import RenewSubscriptionPage from "../../components/RenewSubscription/RenewSubscription.jsx";
// import SubscriberDetails from "../../components/SubscriberDetails/SubscriberDetails.jsx";
// import UpdateSubscriber from "../../components/UpdateSubscriber/UpdateSubscriber.jsx";
// import ForgotPassword from "../ForgotPassword/ForgotPassword.jsx";
// import ResetPassword from "../../components/ResetPassword/ResetPassword.jsx";
// import BannersDashboard from "../../components/BannersDashboard/BannerDashboard.jsx";
// import CategoriesDashboard from "../../components/CatrgoriesDashboard/CategoriesDashboard.jsx";
// import AddCategory from "../../components/CatrgoriesDashboard/AddCategory.jsx";
// import CreateBanner from "../../components/BannersDashboard/CreateBanner.jsx"
// import OffersDashboard from "../../components/OffersDashboard/OffersDashboard.jsx";
// import CreateOffer from "../../components/OffersDashboard/CreateOffer.jsx";
// import TrainingSessionDashboard from "../../components/TrainingSessionDashboard/TrainingSessionDashboard.jsx";
// import CreateTrainingSession from "../../components/TrainingSessionDashboard/CreateTrainingSession.jsx";
// import SubscribersReport from "../../components/SubscribersReport/SubscribersReport.jsx";
// import AttendenceReport from "../../components/AttendenceReport/AttendenceReport.jsx";
// import CreateAdmin from "../../components/CreateAdmin/CreateAdmin.jsx";
// import QRDashboard from "../../components/QRDashboard/QRDashboard.jsx";
// import SetInitialPassword from "../../components/SetInitialPassword/SetInitialPassword.jsx";

// export default function AppRoutes() {
//   return (
//      <Routes>
//       {/* ---- Public Home ---- */}
//       <Route element={<Layout showNavbar={true} />}>
//         <Route path="/" element={<UserHome />} />
//         <Route path="/user/home" element={<UserHome />} />
//       </Route>

//       {/* ---- Auth Pages (No Navbar) ---- */}
//     <Route path="/login" element={<Login />} />
//   <Route path="/forgot-password" element={<ForgotPassword />} />
//  <Route path="/reset-password" element={<ResetPassword />} />

//  <Route path="/set-initial-password" element={<SetInitialPassword />} />

//       {/* <Route path="/login" element={<Layout showNavbar={false}><Login /></Layout>} /> */}
//       {/* <Route path="/forgot-password" element={<Layout showNavbar={false}><ForgotPassword /></Layout>} />
//       <Route path="/reset-password" element={<Layout showNavbar={false}><ResetPassword /></Layout>} />
//       <Route path="/set-initial-password" element={<Layout showNavbar={false}><SetInitialPassword /></Layout>} /> */}

//       {/* ---- User Pages (Protected) ---- */}
//       <Route element={<ProtectedRoute role={["user","subscriber"]}><Layout showNavbar={true} /></ProtectedRoute>}>
//         <Route path="/user/profile" element={<Profile />} />
//         <Route path="/user/offers" element={<Offers />} />
//         <Route path="/user/Qrscanner" element={< Qrscanner />} />
//         <Route path="/user/student-id" element={<StudentID />} />
//         <Route path="/user/schedule" element={<Schedule />} />
//         {/* <Route path="/category/:id" element={<CategoryDetails />} /> */}
//       </Route>

//       {/* ---- Admin Layout ---- */}
// <Route element={<ProtectedRoute role={["admin", "super_admin"]}><AdminLayout /></ProtectedRoute>}>
//         <Route path="/admin/dashboard" element={<AdminDashboard />} />
//         <Route path="/admin/users" element={<Users />} />
//         <Route path="/admin/users/edit/:id" element={<EditUser />} />
//         <Route path="/admin/manage" element={<ManageContent />} />
//         <Route path="/admin/create-user" element={<CreateUser />} />
//         <Route path="/admin/subscribers" element={<Subscribers />} />
//         <Route path="/admin/subscribers/renew/:id" element={<RenewSubscriptionPage />} />
//         <Route path="/admin/subscribers/:id" element={<SubscriberDetails />} />
//         <Route path="/admin/subscribers/update/:id" element={<UpdateSubscriber />} />
//         <Route path="/admin/banners" element={<BannersDashboard />} />
//         <Route path="/admin/categories" element={<CategoriesDashboard />} />
//         <Route path="/admin/categories/add" element={<AddCategory />} />
//         <Route path="/admin/banners/add" element={<CreateBanner />} />
//         <Route path="/admin/offers" element={<OffersDashboard />} />
//         <Route path="/admin/offers/add" element={<CreateOffer />} />
//         <Route path="/admin/training-sessions" element={<TrainingSessionDashboard />} />
//         <Route path="/admin/training-sessions/add" element={<CreateTrainingSession />} />
//         <Route path="/admin/reports/subscribers" element={<SubscribersReport />} />
//         <Route path="/admin/reports/attendance" element={<AttendenceReport />} />
//         <Route path="/admin/create-admin" element={<CreateAdmin />} />
//         <Route path="/admin/qr-dashboard" element={<QRDashboard />} />
        
//       </Route>

//       {/* ---- 404 Page ---- */}
//       <Route path="*" element={<h1 className="text-center text-3xl mt-20">Page Not Found</h1>} />
//     </Routes>
//   );
// }


import { Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";

// ⬇️ Lazy Loading لكل الصفحات
const Login = lazy(() => import("../../components/Login/Login.jsx"));
const Layout = lazy(() => import("../../components/Layout/Layout.jsx"));
const AdminLayout = lazy(() => import("../../components/AdminLayout/AdminLayout.jsx"));
const UserHome = lazy(() => import("../../components/UserHome/UserHome.jsx"));
const Profile = lazy(() => import("../../components/Profile/Profile.jsx"));
const Offers = lazy(() => import("../../components/Offers/Offers.jsx"));
const Qrscanner = lazy(() => import("../qrscanner/qrscanner.jsx"));
const StudentID = lazy(() => import("../../components/StudentID/StudentID.jsx"));
const Schedule = lazy(() => import("../../components/Schedule/Schedule.jsx"));
const AdminDashboard = lazy(() => import("../../components/AdminDashboard/AdminDashboard.jsx"));
const Users = lazy(() => import("../../components/Users/Users.jsx"));
const EditUser = lazy(() => import("../../components/EditUser/EditUser.jsx"));
const ManageContent = lazy(() => import("../../components/ManageContent/ManageContent.jsx"));
const ProtectedRoute = lazy(() => import("../../components/ProtectedRoute/ProtectedRoute.jsx"));
const CreateUser = lazy(() => import("../../components/CreateUser/CreateUser.jsx"));
const Subscribers = lazy(() => import("../../components/Subscribers/Subscribers.jsx"));
const RenewSubscriptionPage = lazy(() => import("../../components/RenewSubscription/RenewSubscription.jsx"));
const SubscriberDetails = lazy(() => import("../../components/SubscriberDetails/SubscriberDetails.jsx"));
const UpdateSubscriber = lazy(() => import("../../components/UpdateSubscriber/UpdateSubscriber.jsx"));
const ForgotPassword = lazy(() => import("../ForgotPassword/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("../../components/ResetPassword/ResetPassword.jsx"));
const BannersDashboard = lazy(() => import("../../components/BannersDashboard/BannerDashboard.jsx"));
const CategoriesDashboard = lazy(() => import("../../components/CatrgoriesDashboard/CategoriesDashboard.jsx"));
const AddCategory = lazy(() => import("../../components/CatrgoriesDashboard/AddCategory.jsx"));
const CreateBanner = lazy(() => import("../../components/BannersDashboard/CreateBanner.jsx"));
const OffersDashboard = lazy(() => import("../../components/OffersDashboard/OffersDashboard.jsx"));
const CreateOffer = lazy(() => import("../../components/OffersDashboard/CreateOffer.jsx"));
const TrainingSessionDashboard = lazy(() => import("../../components/TrainingSessionDashboard/TrainingSessionDashboard.jsx"));
const CreateTrainingSession = lazy(() => import("../../components/TrainingSessionDashboard/CreateTrainingSession.jsx"));
const SubscribersReport = lazy(() => import("../../components/SubscribersReport/SubscribersReport.jsx"));
const AttendenceReport = lazy(() => import("../../components/AttendenceReport/AttendenceReport.jsx"));
const CreateAdmin = lazy(() => import("../../components/CreateAdmin/CreateAdmin.jsx"));
const QRDashboard = lazy(() => import("../../components/QRDashboard/QRDashboard.jsx"));
const SetInitialPassword = lazy(() => import("../../components/SetInitialPassword/SetInitialPassword.jsx"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-xl">Loading...</div>}>

      <Routes>

        {/* ---- Public Home ---- */}
        <Route element={<Layout showNavbar={true} />}>
          <Route path="/" element={<UserHome />} />
          <Route path="/user/home" element={<UserHome />} />
        </Route>

        {/* ---- Auth Pages ---- */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/set-initial-password" element={<SetInitialPassword />} />

        {/* ---- User Pages (Protected) ---- */}
        <Route
          element={
            <ProtectedRoute role={["user", "subscriber"]}>
              <Layout showNavbar={true} />
            </ProtectedRoute>
          }
        >
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/offers" element={<Offers />} />
          <Route path="/user/Qrscanner" element={<Qrscanner />} />
          <Route path="/user/student-id" element={<StudentID />} />
          <Route path="/user/schedule" element={<Schedule />} />
        </Route>

        {/* ---- Admin Layout ---- */}
        <Route
          element={
            <ProtectedRoute role={["admin", "super_admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
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
          <Route path="/admin/banners/add" element={<CreateBanner />} />
          <Route path="/admin/offers" element={<OffersDashboard />} />
          <Route path="/admin/offers/add" element={<CreateOffer />} />
          <Route path="/admin/training-sessions" element={<TrainingSessionDashboard />} />
          <Route path="/admin/training-sessions/add" element={<CreateTrainingSession />} />
          <Route path="/admin/reports/subscribers" element={<SubscribersReport />} />
          <Route path="/admin/reports/attendance" element={<AttendenceReport />} />
          <Route path="/admin/create-admin" element={<CreateAdmin />} />
          <Route path="/admin/qr-dashboard" element={<QRDashboard />} />
        </Route>

        {/* ---- 404 ---- */}
        <Route
          path="*"
          element={<h1 className="text-center text-3xl mt-20">Page Not Found</h1>}
        />

      </Routes>

    </Suspense>
  );
}

