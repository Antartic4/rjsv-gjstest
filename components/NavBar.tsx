import React from 'react';
import { signOut, useSession } from 'next-auth/react';

const NavBar: React.FC = () => {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="px-4 md:px-20 w-full bg-blue-800 text-white p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl md:text-3xl underline font-bold">
          Project Management
        </h1>
      </div>
      <div className="flex items-center">
        <p className="mr-4 text-center font-bold">{session?.user?.email}</p>
        <button
          className="bg-red-500 px-3 py-1 rounded-lg"
          onClick={handleSignOut}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
