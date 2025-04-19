import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
// import { CssBaseline } from '@mui/material';
// import theme from './theme';
import App from './App';
import { Provider } from "react-redux";
import store from "./redux/store"; // Ensure the correct path to your store
import "./index.css"; // Import Tailwind CSS
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from './components/ui/sonner';

const persistor = persistStore(store); //To maintain different levels of states changes that takes place

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <PersistGate loading={null} persistor={persistor}>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
    </PersistGate>
  </React.StrictMode>,
);
