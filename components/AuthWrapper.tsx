import React, { ComponentType, useState } from 'react';
import firebase from '../firebase/clientApp';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import AuthContext from '../contexts/AuthContext';

const auth = getAuth(firebase);
const provider = new GoogleAuthProvider();

type Props = {
  Authorised: ComponentType;
  Unauthorised: ComponentType;
};
function AuthWrapper({ Unauthorised, Authorised }: Props) {
  const [authUser, setAuthUser] = useState(auth.currentUser);
  const doLogin = () => {
    signInWithPopup(auth, provider).then((result) => {
      const { user } = result;
      setAuthUser(user);
    });
  };
  const comp = authUser ? <Authorised /> : <Unauthorised />;
  return (
    <AuthContext.Provider value={{ authUser, doLogin }}>
      {comp}
    </AuthContext.Provider>
  );
}

export default AuthWrapper;
