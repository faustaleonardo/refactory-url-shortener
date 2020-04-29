import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../actions';

import showAlert from '../utils/showAlert';
import Loader from './partials/Loader';

class Login extends Component {
  state = { username: '', password: '', loading: false };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    if (!this.state.username || !this.state.password) {
      showAlert('error', 'Oops...', 'Username and password must be filled!');
      return;
    }

    this.setState({ loading: true });
    await this.props.login(this.state);
    this.setState({ loading: false });

    if (this.props.auth === false) {
      showAlert('error', 'Oops...', 'Your username or password is wrong!');
      this.setState({ password: '' });
      return;
    }

    this.props.history.push('/');
  };

  render() {
    if (this.props.auth !== false && this.props.auth !== undefined) {
      return <Redirect to="/" />;
    }

    if (this.state.loading) return <Loader />;

    return (
      <div className="w-full max-w-xs center-vh">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={this.handleSubmit}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(mapStateToProps, actions)(Login);
