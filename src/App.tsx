import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Loading from './components/Loading';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
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
      <Loading />
    </>
  );
}

export default App;
