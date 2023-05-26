import { Route, Routes } from "react-router-dom";
import UserProfile from "../pages/user-profile/UserProfile";
import UserList from "../pages/dashboard/UserList";
import ProtectedRoute from "../routes/protectedRoute";
import Dashboard from "../layout/dashboard";
import PersistLogin from "./persistLogin";
import FeedPage from "../pages/Feed/FeedPage";

function UserRoutes() {
  return (
    <>
      <Routes>
        <Route element={<PersistLogin />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<Dashboard />}>
              <Route path="techies" element={<UserList />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
            <Route path="/feed" element={<FeedPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export { UserRoutes };
