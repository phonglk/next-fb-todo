import { User } from 'firebase/auth';
import AuthWrapper from '../components/AuthWrapper';
import Todo from '../components/Todo';

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
  return (
    <div>
      Hello <b>{authUser.displayName}</b>
      <Todo authUser={authUser} />
    </div>
  );
}
