import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux"; 
import { store } from "./redux/store.js"; 
import router from "./routers/router.jsx";
import { AuthProvider } from "./components/context/AuthContext.jsx"; // ✅ Import this
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider> {/* ✅ Wrap RouterProvider */}
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </StrictMode>
);
