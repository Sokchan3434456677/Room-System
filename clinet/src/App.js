import React, { useState } from 'react';
import RoomForm from './components/RoomForm';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div>
      <RoomForm/>
    </div>
  );
}

export default App;