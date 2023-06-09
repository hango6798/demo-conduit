import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';


function App() {
  return (
    <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router}/>
    </PersistGate>
  );
}

export default App;
