import React from 'react';
import {Content} from './Content';
import SauerteigProvider from './SauerteigProvider';

const App = (): JSX.Element => (
  <SauerteigProvider>
    <Content />
  </SauerteigProvider>
);

export default App;
