import React from 'react';
import AddHelpSupport from './help&support/AddHelpSupport';
import GetHelpSupport from './help&support/GetHelpSupport';

const HelpSupport = () => {
  const role = sessionStorage.getItem('role');

  return (
    <>
      {role === 'admin' ? (
        <GetHelpSupport />
      ) : (
        <>
          <AddHelpSupport />
          {/* <GetHelpSupport /> */}
        </>
      )}
    </>
  );
};

export default HelpSupport;