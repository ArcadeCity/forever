import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {
  AppConfig,
  openContractCall,
  openContractDeploy,
  showConnect,
  UserSession,
} from '@stacks/connect';
import { StacksMainnet } from '@stacks/network';
import { Propaganda } from '../components/propaganda';
// import counter from '../contracts/counter.clar';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });
// const codeBody = '(begin (print "hello, world"))';

const network = new StacksMainnet();

export default function Home() {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState('');
  const onChange = event => setInput(event.target.value);

  const call = async () => {
    console.log('Test call contract');
    // const functionArgs = [
    //   uintCV(1234),
    //   intCV(-234),
    //   bufferCV(Buffer.from('hello, world')),
    //   stringAsciiCV('hey-ascii'),
    //   stringUtf8CV('hey-utf8'),
    //   standardPrincipalCV('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6'),
    //   trueCV(),
    // ];

    const functionArgs = [];

    const options = {
      contractAddress: 'SP2SYHR84SDJJDK8M09HFS4KBFXPPCX9H7RZ9YVTS',
      contractName: 'counter-test',
      functionName: 'increment',
      functionArgs,
      //   authOrigin: null,
      appDetails: {
        name: 'Arcade City',
        icon: window.location.origin + '/logo167.png',
      },
      finished: data => {
        console.log('Transaction ID:', data.txId);
        console.log('Raw transaction:', data.txRaw);
      },
    };

    const res = await openContractCall(options);
    console.log('res?', res);
  };

  const authenticate = () => {
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
        setAuthed(true);
        // Save or otherwise utilize userData post-authentication
      },
      userSession: userSession,
    });
  };

  const logout = () => {
    userSession.signUserOut();
    setAuthed(false);
  };
  useEffect(() => {
    const signedIn = userSession.isUserSignedIn();
    setAuthed(signedIn);
    if (userSession.isSignInPending()) {
      if (signedIn) return;
      console.log('Pending signin...');
      userSession.handlePendingSignIn().then(userData => {
        console.log('userData is now:', userData);
        setAuthed(true);
      });
    } else if (signedIn) {
      const userData = userSession.loadUserData();
      console.log('Signed in', userData);
    }
  }, []);

  const deploy = () => {
    //     const codeBody = `
    // ;; forever.arcade.city
    // (print "${escapeHtml(input)}")
    // `;

    const codeBody = `
    (define-data-var counter int 0)

    (define-public (get-counter)
      (ok (var-get counter)))

    (define-public (increment)
      (begin
        (var-set counter (+ (var-get counter) 1))
        (ok (var-get counter))))

    (define-public (decrement)
      (begin
        (var-set counter (- (var-get counter) 1))
        (ok (var-get counter))))
    `;

    console.log(input);
    console.log(codeBody);

    openContractDeploy({
      network,
      contractName: 'counter-localnet',
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
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700">
              Text
            </label>
            <div className="mt-1 mb-4">
              <input
                type="text"
                value={input}
                onChange={onChange}
                name="text"
                id="text"
                autoFocus
                className="p-4 shadow focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Type here what to say forever"
              />
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={deploy}
          >
            Deploy Contract
          </button>{' '}
          <button
            type="button"
            className="ml-6 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={call}
          >
            Test Call Contract
          </button>
          '
          <button
            type="button"
            className="ml-6 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

      <div className="min-h-screen bg-gray-200">
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                <nav
                  className="relative flex items-center justify-between sm:h-10 lg:justify-start"
                  aria-label="Global"
                >
                  <img className="mt-6 h-16 w-auto" src="/logo-t.png" />
                  {/* <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                    <a href="#" className="font-medium text-gray-500 hover:text-gray-900">
                      Product
                    </a>
                  </div> */}
                </nav>
              </div>

              <main className="flex flex-col justify-center mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Say something </span>
                    <span className="block text-indigo-600 xl:inline">forever.</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    On the user-owned internet, you are free to speak your mind.
                  </p>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Got something to say? Put it on the{' '}
                    <span className="font-bold">blockchain</span> where it will live forever.
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
        <Propaganda />
      </div>
    </div>
  );
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
