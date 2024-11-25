import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import UserWelcom from "./components/UserWelcom";
import AdminDashboard from "./components/AdminDashboard";
import PublicRoute from "./components/PublicRoute";
import Registration from "./components/Registration";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

        <Route
        path="/register"
        element={
          <PublicRoute>
            <Registration />
          </PublicRoute>
        }
      />

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserWelcom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
