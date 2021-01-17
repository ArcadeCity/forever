import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { AppConfig, showConnect, UserSession } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

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
      </main>
    </div>
  );
}
