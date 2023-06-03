import { Route, Routes } from "react-router-dom";
import UserList from "../pages/dashboard/UserList";
import ProtectedRoute from "../routes/protectedRoute";
import Dashboard from "../layout/dashboard";
import PersistLogin from "./persistLogin";
import Applicants from "../pages/applicants/Applicants";

function AdminRoutes() {
  return (
    <>
      <Routes>
        <Route element={<PersistLogin />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<Dashboard />}>
              <Route path="" element={<UserList />} />
              <Route path="applicants" element={<Applicants />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export { AdminRoutes };
