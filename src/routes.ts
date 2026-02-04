import { createBrowserRouter } from "react-router";
import  Layout  from "./layout/Layout";
import  Search  from "./pages/Search";
import Home from "./pages/Home";
import BookDetails from "./pages/BookDetails";

const routes = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { path: "/", Component: Home },
      { path: "/search", Component: Search},
      { path: "/book/:id", Component: BookDetails}
    ],
  },
]);

export default routes;