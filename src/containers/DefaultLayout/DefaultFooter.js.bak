import React, { Component } from "react";
import PropTypes from "prop-types";
import integraLogo from "./IntegraLogo.png";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span id="footer">
          <a href="https://www.integramicro.com/" target="_blank">
            <img src={integraLogo} width="45px"></img>
          </a>{" "}
          Copyright &copy; 2024 Integra Micro Systems Private Ltd. All Rights
          Reserved. Version : 1.9.26
        </span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
