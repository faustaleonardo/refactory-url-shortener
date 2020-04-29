import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Loader from './partials/Loader';

import * as actions from '../actions';

class Track extends Component {
  state = { loading: false };

  async componentDidMount() {
    const { urlId } = this.props.match.params;

    this.setState({ loading: true });
    await this.props.getTrack(urlId);
    this.setState({ loading: false });
  }

  renderContent() {
    if (!this.props.track.length) return null;

    return this.props.track.map((el) => {
      return (
        <tr key={el.id}>
          <td className="border px-4 py-2">{el.ipAddress}</td>
          <td className="border px-4 py-2">
            <a href={el.refererUrl} className="link">
              {el.refererUrl}
            </a>
          </td>
        </tr>
      );
    });
  }

  render() {
    if (!this.props.auth) return <Redirect to="/login" />;

    if (this.state.loading) return <Loader />;

    if (!this.props.track.length)
      return (
        <div className="text-xl center-vh text-align-center">
          <h3 className="mb-5">No record yet :(</h3>
          <Link
            to="/history"
            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
          >
            Back
          </Link>
        </div>
      );

    return (
      <div className="center-vh text-align-center">
        <table className="mb-5">
          <thead>
            <tr className="text-align-left">
              <th className="px-4 py-2">IP Address</th>
              <th className="px-4 py-2">Referer URL</th>
            </tr>
          </thead>
          <tbody>{this.renderContent()}</tbody>
        </table>
        <Link
          to="/history"
          className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Back
        </Link>
      </div>
    );
  }
}

const mapStateToProps = ({ track, auth }) => {
  return { track, auth };
};

export default connect(mapStateToProps, actions)(Track);
