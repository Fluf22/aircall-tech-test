import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingOverlay from "../loading-overlay";

const ProtectedRoute = lazy(() => import("../auth/protected-route"));
const Login = lazy(() => import("../login"));
const Calls = lazy(() => import("../calls"));

const Router = () => {
    return (
        <Routes>
            <Route path={"/"} element={
                <Suspense fallback={<LoadingOverlay />}>
                    <ProtectedRoute>
                        <Calls />
                    </ProtectedRoute>
                </Suspense>
            } />
            <Route path={"/login"} element={
                <Suspense fallback={<LoadingOverlay />}>
                    <Login />
                </Suspense>
            } />
            <Route path={"*"} element={
                <Navigate to={'/'} replace={true} />
            } />
        </Routes>
    );
};

export default Router;