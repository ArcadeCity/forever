import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { AppConfig, openContractDeploy, showConnect, UserSession } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });
const codeBody = '(begin (print "hello, world"))';

function authenticate() {
  showConnect({
    appDetails: {
      name: 'Say Something Forever',
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
  useEffect(() => {
    const signedIn = userSession.isUserSignedIn();
    if (userSession.isSignInPending()) {
      console.log('Pending signin...');
      userSession.handlePendingSignIn().then(userData => {
        console.log('userData is now:', userData);
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
      contractName: 'hello-world',
      codeBody,
      appDetails: {
        name: 'Say Something Forever',
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
        <button onClick={deploy} style={{ padding: 12 }}>
          Deploy Contract
        </button>
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
        <button onClick={authenticate} style={{ padding: 12 }}>
          Log in with Blockstack
        </button>
        <p>Authed? {JSON.stringify(authed)}</p>
      </main>
    </div>
  );
}
