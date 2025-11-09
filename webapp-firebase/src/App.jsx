import { lazy, Suspense } from "react";
import "./App.css";
import { Routes, Route, Router } from "react-router-dom";
import Loading from "./components/subParts/loading";

const Header = lazy(() => import("./components/subParts/header"));
const Home = lazy(() => import("./components/home"));
const Login = lazy(() => import("./components/login"));
const Createacc = lazy(() => import("./components/createacc"));
const Dashboard = lazy(() => import("./components/dashboard"));
const Protected = lazy(() => import("./components/subParts/protected"));
const Footer = lazy(() => import("./components/subParts/footer"));
const Companion = lazy(() => import("./components/companion"));

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/createacc"
          element={
            <Suspense fallback={<Loading />}>
              <Createacc />
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<Loading />}>
              <Protected>
                <Dashboard />
              </Protected>
            </Suspense>
          }
        />
        <Route
          path="/companion"
          element={
            <Suspense fallback={<Loading />}>
              <Protected>
                <Companion />
              </Protected>
            </Suspense>
          }
        />
      </Routes>
      <br />
      <br />
      <Footer />
    </>
  );
}

export default App;
