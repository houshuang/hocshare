import React, { Component } from 'react';
import logo from './logo.svg';
import { connection } from './index';
import './App.css';
import ShareHOC from './reactive';
import Pretty from 'react-json-pretty';

const Chat = ({ data, dataFn, removeFn }) => (
  <div style={{ backgroundColor: data.color }}>
    <ul>{data && data.chats.map(e => <li>{e}</li>)}</ul>
    <p onClick={() => dataFn.listPrepend('Hello message ' + Date(), 'chats')}>
      Add msg before
    </p>
    <p onClick={() => dataFn.listAppend('Hello message ' + Date(), 'chats')}>
      Add msg after
    </p>
    <p onClick={() => dataFn.objSet('blue', 'color')}>Blue</p>
    <p onClick={() => dataFn.objSet('red', 'color')}>Red</p>
    <p onClick={removeFn}>
      Remove list
    </p>
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
        key={i}
      />
    ))}
    <p onClick={() => dataFn.listAppend({ chats: [], color: 'white' })}>
      Add list
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
      <div style={{ backgroundColor: data.color }}>
        <Pretty id={1} json={data} />
        <p onClick={() => dataFn.objSet('blue', 'color')}>Blue</p>
        <p onClick={() => dataFn.objSet('red', 'color')}>Red</p>
      </div>
    </div>
  );
};

const dataStructure = { chats: [], color: 'white' };

export default ShareHOC(dataStructure, 'xxxy')(App);
