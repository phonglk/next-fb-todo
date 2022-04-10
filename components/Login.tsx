import React from 'react';
import AuthContext from '../contexts/AuthContext';

function Login() {
  return (
    <AuthContext.Consumer>
      {({ doLogin }) => (
        <div className="text-base ">
          Please{' '}
          <a
            href="#"
            onClick={doLogin}
            className="font-semibold tracking-wide text-blue-700"
          >
            login
          </a>{' '}
          to continue
        </div>
      )}
    </AuthContext.Consumer>
  );
}

export default Login;
