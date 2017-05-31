import React, { Component } from 'react';
import { connection } from './index';

const cleanPath = (defPath, newPath = []) => {
  console.log(defPath, newPath);
  if (newPath.constructor !== Array) {
    newPath = [newPath];
  }
  return [...defPath, ...newPath];
};

class Doc {
  constructor(doc, path) {
    this.doc = doc;
    this.path = path || [];
  }
  listPrepend(newVal, path) {
    this.doc.submitOp({ p: [...cleanPath(this.path, path), 0], li: newVal });
  }
  listAppend(newVal, path) {
    this.doc.submitOp({
      p: [...cleanPath(this.path, path), 999999],
      li: newVal
    });
  }
  listInsert(newVal, path) {
    this.doc.submitOp({
      p: cleanPath(this.path, path),
      li: newVal
    });
  }
  listDel(oldVal, path) {
    console.log(path);
    this.doc.submitOp({
      p: cleanPath(this.path, path),
      ld: oldVal
    });
  }
  objInsert(newVal, path) {
    this.doc.submitOp({ p: cleanPath(this.path, path), oi: newVal });
  }
  objDel(oldVal, path) {
    this.doc.submitOp({ p: cleanPath(this.path, path), od: oldVal });
  }
  objReplace(oldVal, newVal, path) {
    this.doc.submitOp({
      p: cleanPath(this.path, path),
      od: oldVal,
      oi: newVal
    });
  }
  objSet(newVal, path) {
    this.doc.submitOp({
      p: [...this.path, path],
      oi: newVal
    });
  }
  specialize(path) {
    if (path.constructor !== Array) {
      path = [path];
    }
    return new Doc(this.doc, [...this.path, ...path]);
  }

  specializeData(path, data) {
    console.log(path, data);
    if (path.constructor !== Array) {
      return data[[path]];
    }
    return path.reduce((acc, x) => acc[[x]], data);
  }
}

const generateDataFn = doc => {
  if (doc) {
    return new Doc(doc, []);
  }
};

const ShareHOC = (dataStructure, docId) => WrappedComponent => class
  extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  componentDidMount = () => {
    this.doc = connection.get('a', docId);
    this.doc.subscribe();
    this.doc.on('ready', this.update);
    this.doc.on('op', this.update);
    this.doc.on('load', () => {
      if (!this.doc.type) {
        this.doc.create(dataStructure || {});
      }
      this.update();
    });
  };

  update = () => {
    this.setState({ data: this.doc.data });
  };

  render = () => {
    console.log(this.state.data);
    return this.state.data
      ? <WrappedComponent
          dataFn={generateDataFn(this.doc)}
          data={this.state.data}
          {...this.props}
        />
      : null;
  };
};

export default ShareHOC;
