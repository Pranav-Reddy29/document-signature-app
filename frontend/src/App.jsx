import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PDFViewer from "./pages/PDFViewer";
import SignDocument from "./pages/SignDocument";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ManageSigners from "./pages/ManageSigners";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pdf"
          element={<PDFViewer />}
        />

        <Route
          path="/sign/:documentId/:signerId"
          element={
            <SignDocument />
          }
        />

        <Route
          path="/manage-signers/:documentId"
          element={
            <ProtectedRoute>
              <ManageSigners />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;