import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { routes } from "./app/routes/index.jsx";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./store/index.js";
import { ClerkProvider } from "@clerk/clerk-react";
import { CLERK_PUBLISHABLE_KEY } from "./constants/env.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeProvider } from "@emotion/react";
import theme from "./styles/theme.jsx";

const router = createBrowserRouter(routes);
const store = configureStore({ reducer: rootReducer });

createRoot(document.getElementById("root")).render(
    <ThemeProvider theme={theme}>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
            <Provider store={store}>
                <RouterProvider router={router} />
                <Toaster position="top-right" />
            </Provider>
        </ClerkProvider>
    </ThemeProvider>,
);
