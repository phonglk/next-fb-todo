import { User } from 'firebase/auth';
import AuthWrapper from '../components/AuthWrapper';
import Login from '../components/Login';
import Todo from '../components/Todo';
import AuthContext from '../contexts/AuthContext';

export default function Home() {
  return <AuthWrapper Authorised={App} Unauthorised={Login} />;
}

function App() {
  return (
    <AuthContext.Consumer>
      {({ authUser }) => (
        <div>
          Hello <b>{authUser.displayName}</b>
          <Todo authUser={authUser} />
        </div>
      )}
    </AuthContext.Consumer>
  );
}
