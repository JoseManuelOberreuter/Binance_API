import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import './index.css';
import {Select,Canvas,Table} from './App';
import {T1} from './App';
import {JsTable} from './component.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>



  <div class="container-fluid">
    <div class="row">

      {/* MAIN */}
      <main class="col-md-9 m-auto col-lg-10 px-md-4">

        {/* HEADER */}
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <T1/>
          <div class="btn-toolbar mb-2 mb-md-0">
            <Select/>
          </div>
        </div>

        {/* CHART */}
        <Canvas/>

        {/* TABLA */}
        <h2 class="mt-5">Cryptocurrencies</h2>
        <JsTable/>
        <Table/>

      </main>
    </div>
  </div>


  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
