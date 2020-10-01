import React from 'react';
import PropTypes from 'prop-types';

import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { Loader } from '../loader/Loader';
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      loading ? (
        <Loader size={46} isButton={false} />
      ) : isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
