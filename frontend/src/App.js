import './App.css';
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { Menu } from './components/Menu'
import Game from './components/Game'

function App() {
  const [user, setUser] = useState("");
  const userContextValue = {user, setUser}

  return (
      <div className="App">
        <UserContext.Provider value={userContextValue}>
          <Routes>
            <Route path='/' element={<Menu/>}/>
            <Route path='/game/:gameID' element={<Game/>}/>
          </Routes>
        </UserContext.Provider>
      </div>
  );
}

export default App;
