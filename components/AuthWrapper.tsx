import React, { ComponentType, useState } from 'react';
import firebase from '../firebase/clientApp';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';

const auth = getAuth(firebase);
const provider = new GoogleAuthProvider();

type Props = {
  Authorised: ComponentType<{
    authUser: User;
  }>;
  Unauthorised: ComponentType<{
    doLogin: () => void;
  }>;
};
function AuthWrapper({ Unauthorised, Authorised }: Props) {
  const [authUser, setAuthUser] = useState(auth.currentUser);
  const doLogin = () => {
    signInWithPopup(auth, provider).then((result) => {
      const { user } = result;
      setAuthUser(user);
    });
  };
  if (authUser === null) {
    return <Unauthorised doLogin={doLogin} />;
  }
  return <Authorised authUser={authUser} />;
}

export default AuthWrapper;
