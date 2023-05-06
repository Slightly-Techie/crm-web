import { Route, Routes } from "react-router-dom";
import UserProfile from "../pages/user-profile/UserProfile";
import UserList from "../pages/dashboard/UserList";
import ProtectedRoute from "../routes/protectedRoute";
import Dashboard from "../layout/dashboard";
import PersistLogin from "./persistLogin";

function UserRoutes() {
  return (
    <>
      <Routes>
        <Route element={<PersistLogin />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<Dashboard />}>
              <Route path="" element={<UserList />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export { UserRoutes };
