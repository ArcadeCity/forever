import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { AppConfig, openContractDeploy, showConnect, UserSession } from '@stacks/connect';
import { StacksMainnet } from '@stacks/network';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });
const codeBody = '(begin (print "hello, world"))';
const network = new StacksMainnet();

function authenticate() {
  showConnect({
    network,
    appDetails: {
      name: 'Arcade City',
      icon: window.location.origin + '/vercel.svg',
    },
    redirectTo: '/',
    finished: () => {
      let userData = userSession.loadUserData();
      console.log(userData);
      // Save or otherwise utilize userData post-authentication
    },
    userSession: userSession,
  });
}

export default function Home() {
  const [authed, setAuthed] = useState(false);
  const logout = () => {
    userSession.signUserOut();
    setAuthed(false);
  };
  useEffect(() => {
    const signedIn = userSession.isUserSignedIn();
    if (userSession.isSignInPending()) {
      console.log('Pending signin...');
      userSession.handlePendingSignIn().then(userData => {
        console.log('userData is now:', userData);
        setAuthed(signedIn);
      });
    } else if (signedIn) {
      const userData = userSession.loadUserData();
      console.log('Signed in', userData);
    }
    setAuthed(signedIn);
  }, []);

  const deploy = () => {
    console.log('deploy...?');
    openContractDeploy({
      network,
      contractName: 'hello-world',
      codeBody,
      appDetails: {
        name: 'Arcade City',
        icon: window.location.origin + '/vercel.svg',
      },
      finished: data => {
        console.log('Transaction ID:', data.txId);
        console.log('Raw transaction:', data.txRaw);
      },
    });
  };

  if (authed) {
    return (
      <div className={styles.container}>
        <div className="font-sans">
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={deploy}
          >
            Deploy Contract
          </button>
          <button
            type="button"
            className="ml-8 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Say something forever.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <button
          onClick={authenticate}
          type="button"
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Log in with Blockstack
        </button>
        {/* <p>Authed? {JSON.stringify(authed)}</p> */}
      </main>
    </div>
  );
}
