import { Routes, Route } from "react-router-dom";
import Login from "../../components/Login/Login.jsx";
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

export default function AppRoutes() {
  return (
    <Routes>
      {/* ---- Login ---- */}
      <Route path="/login" element={<Login />} />

      {/* ---- User Routes ---- */}
      <Route
        path="/user/home"
        element={
          <ProtectedRoute role="user">
            <UserHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/profile"
        element={
          <ProtectedRoute role="user">
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/offers"
        element={
          <ProtectedRoute role="user">
            <Offers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/sports"
        element={
          <ProtectedRoute role="user">
            <Sports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/qr"
        element={
          <ProtectedRoute role="user">
            <QRScan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/student-id"
        element={
          <ProtectedRoute role="user">
            <StudentID />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/schedule"
        element={
          <ProtectedRoute role="user">
            <Schedule />
          </ProtectedRoute>
        }
      />

      {/* ---- Admin Routes ---- */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute role="admin">
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute role="admin">
            <EditUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage"
        element={
          <ProtectedRoute role="admin">
            <ManageContent />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
