

import { Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";

// ⬇️ Lazy Loading لكل الصفحات
const Login = lazy(() => import("../../components/Login/Login.jsx"));
const AdminLogin = lazy(() => import("../../components/Login/AdminLogin.jsx"));
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
const AdminManage = lazy(() => import("../../components/AdminManage/AdminManage.jsx"));
const QRDashboard = lazy(() => import("../../components/QRDashboard/QRDashboard.jsx"));
const SetInitialPassword = lazy(() => import("../../components/SetInitialPassword/SetInitialPassword.jsx"));
const LoginRedirect = lazy(() => import("../../components/LoginRedirect.jsx"));
const Sessions = lazy(() => import("../../components/Sessions/Sessions.jsx"));
const CreateAdmin = lazy(() => import("../../components/CreateAdmin/CreateAdmin.jsx"));


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
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/:token" element={<LoginRedirect />} />
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
          <Route path="/user/sessions" element={<Sessions />} />
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
          <Route path="/admin/admin-manage" element={<AdminManage />} />
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
