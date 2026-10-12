import React from 'react';
import { DigitalWorkspace } from './components/workspace/DigitalWorkspace';

export const App: React.FC = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0d0f14] text-zinc-100 font-sans">
      <DigitalWorkspace />
    </div>
  );
};

export default App;
