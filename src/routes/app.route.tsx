import HomeLayout from "@/layouts/home.layout";
import GeneralError from "@/modules/errors/general-error.page";
import MoreAbout from "@/modules/landing-page/more-about.page";
import Museums from "@/modules/landing-page/museums.page";
import { createBrowserRouter } from "react-router-dom";

export const appRouter = createBrowserRouter([
  {
    path: '/',
    lazy: async () => { 
      const AppShell = await import('@/layouts/page.layout');
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        Component: HomeLayout
      },
      {
        path: '/home',
        Component: HomeLayout,
        errorElement: <GeneralError />
      },
      {
        path: '/about',
        Component: MoreAbout,
        errorElement: <GeneralError />
      },
      {
        path: '/museums',
        Component: Museums,
        errorElement: <GeneralError />
      }
    ]
  }

])

export default appRouter;

