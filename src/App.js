import React from 'react';
import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout';
import pic from './images/1.jpeg';

function App() {
  return (
    <Layout sidebarSrc={pic} sidebarItems={['Home', 'About', 'Contact']}>
      <div className="App">
        <header className="App-header">
          <img src={pic} className="App-logo" alt="logo" />
          <p>
            Suck my nuts!
          </p>
        </header>
      </div>
    </Layout>
  );
}

export default App;
