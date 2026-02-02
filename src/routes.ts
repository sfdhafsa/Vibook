import { createBrowserRouter } from "react-router";
import  Layout  from "./layout/Layout";
import  Search  from "./pages/Search";
import Home from "./pages/Home";

const routes = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { path: "/", Component: Home },
      { path: "/Search", Component: Search},
    ],
  },
]);

export default routes;