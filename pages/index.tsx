import { User } from 'firebase/auth';
import AuthWrapper from '../components/AuthWrapper';

export default function Home() {
  return <AuthWrapper Authorised={App} Unauthorised={Login} />;
}

function Login({ doLogin }) {
  return (
    <div>
      Please{' '}
      <a href="#" onClick={doLogin}>
        login
      </a>{' '}
      to continue
    </div>
  );
}

function App({ authUser }: { authUser: User }) {
  return <div>Hello <b>{authUser.displayName}</b></div>;
}
