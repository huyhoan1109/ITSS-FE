import { NavBar } from 'components/NavBar';
import React, { ElementType, useCallback } from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom';
export interface DashboardLayoutProps extends RouteProps {
  RenderComponent: ElementType;
}

interface LayoutProps {
  routeProps: RouteComponentProps;
  RenderComponent: ElementType;
  path?: string | string[];
}

const Layout = (props: LayoutProps) => {
  const { routeProps, RenderComponent } = props;
  return (
    <div
      style={{
        background: '#F8EDDC',
        minHeight:'100vh',
      }}
    >
      <NavBar />
      <RenderComponent {...routeProps} />
    </div>
  );
};

const DashBoardLayout = ({
  RenderComponent,
  ...rest
}: DashboardLayoutProps) => {
  const render = useCallback(
    (routeProps: RouteComponentProps) => {
      return (
        <Layout
          routeProps={routeProps}
          RenderComponent={RenderComponent}
          path={rest.path as any}
        />
      );
    },
    [RenderComponent, rest.path],
  );

  return <Route {...rest} render={render} />;
};

export default DashBoardLayout;
