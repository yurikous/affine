import { FrameworkScope, useLiveData } from '@toeverything/infra';
import { lazy as reactLazy, useLayoutEffect, useMemo } from 'react';
import {
  createMemoryRouter,
  RouterProvider,
  UNSAFE_LocationContext,
  UNSAFE_RouteContext,
} from 'react-router-dom';

import { viewRoutes } from '../../../router';
import type { View } from '../entities/view';
import { RouteContainer } from './route-container';

const warpedRoutes = viewRoutes.map(({ path, lazy }) => {
  const Component = reactLazy(() =>
    lazy().then(m => ({
      default: m.Component as React.ComponentType,
    }))
  );
  const route = {
    Component,
  };

  return {
    path,
    Component: () => {
      return <RouteContainer route={route} />;
    },
  };
});

export const ViewRoot = ({ view }: { view: View }) => {
  const viewRouter = useMemo(() => createMemoryRouter(warpedRoutes), []);

  const location = useLiveData(view.location$);

  useLayoutEffect(() => {
    viewRouter.navigate(location).catch(err => {
      console.error('navigate error', err);
    });
  }, [location, view, viewRouter]);

  // https://github.com/remix-run/react-router/issues/7375#issuecomment-975431736
  return (
    <FrameworkScope scope={view.scope}>
      <UNSAFE_LocationContext.Provider value={null as any}>
        <UNSAFE_RouteContext.Provider
          value={{
            outlet: null,
            matches: [],
            isDataRoute: false,
          }}
        >
          <RouterProvider router={viewRouter} />
        </UNSAFE_RouteContext.Provider>
      </UNSAFE_LocationContext.Provider>
    </FrameworkScope>
  );
};
