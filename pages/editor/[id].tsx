import React from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import ScreenEditor from '../../components/ScreenEditor';
import NavBar from '../../components/NavBar';

const EditorPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    }
  }, [status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'authenticated' && (!id || typeof id !== 'string')) {
    return <div>Invalid project ID</div>;
  }

  if (status === 'authenticated') {
    return (
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <NavBar />
        <ScreenEditor projectID={id as string} />
      </div>
    );
  }

  return null;
};

export default EditorPage;
