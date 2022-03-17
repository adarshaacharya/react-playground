import Head from 'next/head';
import React from 'react';
import dynamic from 'next/dynamic';
import CodeEditor from '../components/CodeEditor/CodeEditor';
import Preview from '../components/Preview/Preview';
import { bundler, setupBundler } from '../bundler';
import { editorInitialValue as initialValue } from '../constants';

const Resizable = dynamic(() => import('../components/Resizable/Resizable'), {
  ssr: false,
});

const Home = () => {
  const [input, setInput] = React.useState(initialValue);
  const [code, setCode] = React.useState<string>();
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      const result = await bundler(input);
      setCode(result.code);
      setError(result.err); // bundling error
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  React.useEffect(() => {
    setupBundler();
  }, []);

  return (
    <div className="app">
      <Head>
        <title>Code Playground</title>
      </Head>
      <Resizable direction="horizontal">
        <CodeEditor
          initialValue={initialValue}
          onChange={(value) => setInput(value)}
        />
      </Resizable>

      <Preview code={code} error={error} />
    </div>
  );
};

export default Home;
