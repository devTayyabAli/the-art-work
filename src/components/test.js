import React, { Component } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
  } from "react-router-dom";
export default class Test extends Component {
  render() {
    return (
      <div>
        <ul>
        <li><Link to="/">Test</Link>
</li>
        </ul>
      </div>
    )
  }
}
