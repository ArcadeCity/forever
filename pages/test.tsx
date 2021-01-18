import { AppConfig, AuthOptions, UserSession } from '@stacks/connect';
import { Connect, useConnect } from '@stacks/connect-react';
import { StacksMainnet } from '@stacks/network';

const network = new StacksMainnet();

const AuthButton = () => {
  const { doOpenAuth } = useConnect();
  return <button onClick={() => doOpenAuth()}>Authenticate</button>;
};

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const authOptions: AuthOptions = {
  //   network, -- Throws type error. How to specify mainnet?
  appDetails: {
    name: 'Arcade City',
    icon: '/vercel.svg',
  },
  redirectTo: '/',
  finished: () => {
    let userData = userSession.loadUserData();
    console.log(userData);
    // Save or otherwise utilize userData post-authentication
  },
};

// Let's test interacting with our deployed contract.
const Test = () => {
  return (
    <Connect authOptions={authOptions}>
      <AuthButton />
    </Connect>
  );
};

export default Test;
