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
    <div>
      <Head>
        <title>Say something forever.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
              <nav
                className="relative flex items-center justify-between sm:h-10 lg:justify-start"
                aria-label="Global"
              >
                <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                  <div className="flex items-center justify-between w-full md:w-auto">
                    <a href="#">
                      <span className="sr-only">Workflow</span>
                      <img
                        className="h-8 w-auto sm:h-10"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                      />
                    </a>
                    <div className="-mr-2 flex items-center md:hidden">
                      <button
                        type="button"
                        className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        id="main-menu"
                        aria-haspopup="true"
                      >
                        <span className="sr-only">Open main menu</span>
                        <svg
                          className="h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                  <a href="#" className="font-medium text-gray-500 hover:text-gray-900">
                    Product
                  </a>
                </div>
              </nav>
            </div>

            <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
              <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="px-5 pt-4 flex items-center justify-between">
                  <div>
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                      alt=""
                    />
                  </div>
                  <div className="-mr-2">
                    <button
                      type="button"
                      className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    >
                      <span className="sr-only">Close main menu</span>
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div role="menu" aria-orientation="vertical" aria-labelledby="main-menu">
                  <div className="px-2 pt-2 pb-3 space-y-1" role="none">
                    <a
                      href="#"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      role="menuitem"
                    >
                      Product
                    </a>
                  </div>
                  <div role="none">
                    <a
                      href="#"
                      className="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Log in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <main className="flex flex-col justify-center mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Say something</span>
                  <span className="block text-indigo-600 xl:inline">forever.</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  On the user-owned internet, you are free to speak your mind.
                </p>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Got something to say? Put it on the blockchain where it will live forever.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      type="button"
                      onClick={authenticate}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Log in with Stacks
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="https://www.stacks.co/"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                      target="_blank"
                    >
                      Learn about Stacks
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="/bullhorn.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
