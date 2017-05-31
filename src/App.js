import React, { Component } from 'react';
import logo from './logo.svg';
import { connection } from './index';
import './App.css';
import ShareHOC from './reactive';
import Pretty from 'react-json-pretty';

const Chat = ({ title, data, dataFn, removeFn }) => (
  <div style={{ backgroundColor: data.color }}>
    <h1>{title}</h1>
    <ul>{data && data.chats.map(e => <li>{e}</li>)}</ul>
    <div style={{ display: 'flex' }}>
      <p onClick={() => dataFn.listPrepend('Hello message ' + Date(), 'chats')}>
        Prepend msg
      </p>
      <p onClick={() => dataFn.listAppend('Hello message ' + Date(), 'chats')}>
        Append msg
      </p>
      <p onClick={() => dataFn.objSet('blue', 'color')}>Blue</p>
      <p onClick={() => dataFn.objSet('red', 'color')}>Red</p>
      <p onClick={removeFn}>
        Remove list
      </p>
    </div>
    <hr />
  </div>
);

const Chats = ({ data, dataFn }) => (
  <div>
    {data.map((chat, i) => (
      <Chat
        data={dataFn.specializeData(i, data)}
        dataFn={dataFn.specialize(i)}
        removeFn={() => dataFn.listDel(chat, i)}
        title={'Chat ' + i}
        key={i}
      />
    ))}
    <p onClick={() => dataFn.listAppend({ chats: [], color: 'white' })}>
      Add chat
    </p>
  </div>
);

const App = ({ welcome, data, dataFn }) => {
  return (
    <div>
      <Chats
        dataFn={dataFn.specialize('chats')}
        data={dataFn.specializeData('chats', data)}
      />
      <hr />
      <div style={{ backgroundColor: data.color, display: 'flex' }}>
        <Pretty id={1} json={data} />
        <p onClick={() => dataFn.objSet('blue', 'color')}>Blue</p>
        <p onClick={() => dataFn.objSet('red', 'color')}>Red</p>
      </div>
    </div>
  );
};

const dataStructure = { chats: [], color: 'white' };

export default ShareHOC(dataStructure, 'afg')(App);
