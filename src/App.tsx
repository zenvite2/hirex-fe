import MyComponent from './pages/MyComponent';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import Messenger from './pages/Messenger';
import ChatRoom from './pages/ChatRoom';
import ChatModal from './pages/ChatModal';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<ChatModal />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        theme="light"
      />
    </>
  );
}

export default App;
