import React from 'react';
import { Link, browserHistory } from 'react-router';

import { LegablyLargeFooter } from '../../index';
import { constant, utils } from '../../../shared/index';

export default class AboutUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState({ token: utils.getToken() });
  }

  render() {
    return (
      <div className="aboutus-container">
        <div className="static-heading">
          <h1>About Us</h1>
        </div>

        <section className="bg-white">
          <div className="container">
            <div className="row">
              <h2 className="subpage-heading text-center">Who We Are</h2>
              <div className="col-md-4">
                <p className="big-font">Legably is committed to changing how legal staffing works for lawyers.</p>
              </div>
              <div className="col-md-8">
                <p>Legably is a freelance <span className="blue">legal staffing platform</span> that provides a network of vetted, licensed attorneys for other lawyers who need short-term help. With Legably, you replace expensive temp agencies that cost you too much and place your best employees under contract. Use Legably to flexibly manage your practice needs and grow your revenue, while keeping your costs down.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="career bg-white">
          <div className="container">
            <div className="row">
              <h2 className="subpage-heading text-center">Careers</h2>
              <div className="col-md-offset-2 col-md-8 text-center">
                <p>Legably is actively looking for candidates in a variety of roles. If you are a designer, engineer, marketer - or have the skills you think would fit in well with us, we want to hear from you.</p>
                <p>Send us your resume and cover letter to <a className="contact-link" href='mailto:info@legably.com'>info@legably.com</a></p>
              </div>
            </div>
          </div>
        </section>
        {!this.state.token && <LegablyLargeFooter />}
      </div>
    );
  }
}
