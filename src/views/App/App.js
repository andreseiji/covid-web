import React from 'react';

// import { useAuth } from 'hooks/useAuth';

import AuthenticatedApp from 'views/Auth/AuthenticatedApp';
import UnauthenticatedApp from 'views/Auth/UnauthenticatedApp';

const App = () => {
  // const user = useAuth();
  const user = true;
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default App;
