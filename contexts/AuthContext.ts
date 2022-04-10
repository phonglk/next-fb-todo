import { User } from 'firebase/auth';
import _ from 'lodash';
import React from 'react';

const AuthContext = React.createContext<{
  authUser: User;
  doLogin: () => void;
}>({ authUser: null, doLogin: _.noop });

export default AuthContext;
