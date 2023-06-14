import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/common.scss'
import 'react-loading-skeleton/dist/skeleton.css'

import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { SkeletonTheme } from 'react-loading-skeleton';


function App() {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <SkeletonTheme baseColor="#b1b1b1" highlightColor="#ececec">
        <RouterProvider router={router}/>
      </SkeletonTheme>
    </PersistGate>
  );
}

export default App;
