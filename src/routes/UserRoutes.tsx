import { Route, Routes } from "react-router-dom";
import UserProfile from "../pages/user-profile/UserProfile";
import UserList from "../pages/dashboard/UserList";
import ProtectedRoute from "../routes/protectedRoute";
import Dashboard from "../layout/dashboard";

function UserRoutes() {
  return (
    <>
      <Routes>
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<UserList />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </>
  );
}

export { UserRoutes };
