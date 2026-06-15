import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import PDFViewer from "./pages/PDFViewer";
import SignDocument from "./pages/SignDocument";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<PDFViewer />}
        />

        <Route
          path="/sign/:documentId/:signerId"
          element={
            <SignDocument />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;