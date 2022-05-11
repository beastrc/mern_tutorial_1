import React from 'react';
import { Link, browserHistory } from 'react-router';

import { LegablyLargeFooter } from '../../index';
import { constant, utils } from '../../../shared/index';

export default class Faqs extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      token : ''
    };
  }

  componentDidMount() {
    window.scrollTo(0,0);
    this.setState({token : utils.getToken()});
  }


  render() {
    return (
      <div className="faq-page">
        <div className="static-heading">
          <h1>FAQ</h1>
        </div>
        <div className="content-wrapper container bg-white">
          <div className="faq-section">
            <h1>Frequently Asked Questions</h1>
            <div className="faq-panel">
              <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                <div className="panel panel-default">
                  <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <div className="panel-heading" role="tab" id="headingOne">
                      <h4 className="panel-title">
                        What is Legably?
                      </h4>
                    </div>
                  </a>
                  <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                    <div className="panel-body">
                      Legably is an online freelance staffing platform that connects vetted and licensed attorneys who are looking for contract engagements with other attorneys and firms in need of staffing support.
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    <div className="panel-heading" role="tab" id="headingTwo">
                      <h4 className="panel-title">
                        How does Legably work?
                      </h4>
                    </div>
                  </a>
                  <div id="collapseTwo" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                    <div className="panel-body">
                      Attorneys create profiles on Legably and provide their professional and firm information. They then bid on work being posted by other attorneys who are looking for help. When attorneys are hired, they agree to the scope of work, the timeline it will be completed in, and the total amount that the lawyer performing the work will charge.
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    <div className="panel-heading" role="tab" id="headingThree">
                      <h4 className="panel-title">
                        Who can use Legably?
                      </h4>
                    </div>
                  </a>
                  <div id="collapseThree" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                    <div className="panel-body">
                      Any attorney, who is licensed and in good standing in their licensing jurisdiction, may use Legably. At this time, Legably is not open to non-attorney users.
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                    <div className="panel-heading" role="tab" id="headingFour">
                      <h4 className="panel-title">
                        How do I post work to be completed?
                      </h4>
                    </div>
                  </a>
                  <div id="collapseFour" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour">
                    <div className="panel-body">
                      If you would like to hire a freelance attorney to complete a project, sign up to be a <Link to={constant['ROUTES_PATH']['POST_JOB']}>job poster</Link> and complete your profile. You may choose from a range of monthly subscription options which give you the ability to post a certain number of projects. Access to the platform as a job poster also allows you to view and message candidates and invite specific attorneys in the Legably network to apply for positions.
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                    <div className="panel-heading" role="tab" id="headingFive">
                      <h4 className="panel-title">
                        What does Legably cost?
                      </h4>
                    </div>
                  </a>
                  <div id="collapseFive" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFive">
                    <div className="panel-body">
                      Legably is free for attorneys to create profiles, search for work, and post jobs to be completed. Job posters pay for monthly, subscription-based access to post projects to the platform. Legably only takes a small percentage fee of the total budgeted work being performed in order to cover payment processing costs. This only happens once both attorneys have agreed to the total budget and the hiring attorney has been billed for the work.
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                    <div className="panel-heading" role="tab" id="headingSix">
                      <h4 className="panel-title">
                        How are service charges calculated?
                      </h4>
                    </div>
                  </a>
                  <div id="collapseSix" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingSix">
                    <div className="panel-body">
                      Service charges are calculated as a percentage of the total project budget, as set by the job poster. Service charges generally amount to 2% or less, but potentially more, of the total project budget. These charges cover transaction fees charged by our payment processor.
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
                    <div className="panel-heading" role="tab" id="headingSeven">
                      <h4 className="panel-title">
                        How do I get paid?
                      </h4>
                    </div>
                  </a>
                  <div id="collapseSeven" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingSeven">
                    <div className="panel-body">
                      A job seeker will be paid for work completed on the timeline agreed to by the poster at the beginning of the project. A project may be completed in one step, in which case you will be paid in-full upon completion. A project with multiple milestones will involve multiple payments as different milestones are completed. Both the seeker and the poster agree to these terms upon the start of the project.
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseEight" aria-expanded="false" aria-controls="collapseSeven">
                    <div className="panel-heading" role="tab" id="headingEight">
                      <h4 className="panel-title">
                        As a job poster, how long does it take after funds are transfer for a project to begin?
                      </h4>
                    </div>
                  </a>
                  <div id="collapseEight" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingEight">
                    <div className="panel-body">
                      After initiating a transfer of funds to start the job, it can take up to two days for your bank to process the transfer.
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseNine" aria-expanded="false" aria-controls="collapseEight">
                    <div className="panel-heading" role="tab" id="headingNine">
                      <h4 className="panel-title">
                        As a job seeker, how long does it take to get paid once a project has been completed?
                      </h4>
                    </div>
                  </a>
                  <div id="collapseNine" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingNine">
                    <div className="panel-body">
                      <p>For job seekers, milestone payments are transferred to your Stripe Connect account when the hiring manager approves a milestone deliverable.</p>
                      <br/>
                      <p>Stripe will make deposits or payouts from the available balance in your Stripe Connect account to the bank account linked to your account. The first payout will be made 7 days after the first milestone payment is transferred from the hiring manager.</p>
                      <br/>
                      <p>By default, subsequent payouts are processed on a daily basis and contain payments processed seven days prior, i.e. payments received on a Tuesday are paid out on the following Tuesday.</p>
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTen" aria-expanded="false" aria-controls="headingTen">
                    <div className="panel-heading" role="tab" id="headingSeven">
                      <h4 className="panel-title">
                        How are payments processed?
                      </h4>
                    </div>
                  </a>
                  <div id="collapseTen" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTen">
                    <div className="panel-body">
                      Legably uses the Stripe Connect payment service to facilitate payments between our users (all Stripe fees are paid by Legably). You will be asked to create a Stripe Connect account in one of two situations:
                      <br/>
                      <ul>
                        <li>As a hiring manager on the job Start Pending screen, prior to transferring job funds to Legably.</li>
                        <li>As a candidate on the job Start Pending screen, prior to providing us with your W-9 information for tax purposes.</li>
                      </ul>
                      <p>This account is necessary to seamlessly integrate the Legably platform with the Stripe Connect payment service. Your Stripe Connect account will be used whether you are the hiring manager or the candidate. You will be directed to the Stripe Connect site to create your account and re-directed back to the Legably site when your account is successfully created.</p>
                      <br/>
                      <p>All Stripe Connect fees associated with the job will be paid by Legably. We do not accept credit cards for payment at this time but if we do so in the future, all credit card fees are the responsibility of the user and cannot be paid by Legably.</p>
                      <br/>
                      <p>If you have any additional questions about Legably’s relationship with Stripe or experience problems either transferring funds or setting up your payout preferences please contact the Legably support team at <a className="contact-link" href={"mailto:" + constant['SUPPORT_ID']}>support@legably.com</a>.</p>
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseEleven" aria-expanded="false" aria-controls="collapseNine">
                    <div className="panel-heading" role="tab" id="headingEleven">
                      <h4 className="panel-title">
                        How do I change my method of payment?
                      </h4>
                    </div>
                  </a>
                  <div id="collapseEleven" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingEleven">
                    <div className="panel-body">
                      Your account preferences can be changed by clicking the Payment Info tab within your settings tab located in the upper right corner of the page. If you have any issues with changing your account preferences please contact the Legably support team at <a className="contact-link" href={"mailto:" + constant['SUPPORT_ID']}>support@legably.com</a>.
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTweleve" aria-expanded="false" aria-controls="collapseNine">
                    <div className="panel-heading" role="tab" id="headingTwelve">
                      <h4 className="panel-title">
                        How are disputes handled once work on the job has started?
                      </h4>
                    </div>
                  </a>
                  <div id="collapseTweleve" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwelve">
                    <div className="panel-body">
                      We strongly urge hiring managers and candidates to try and work out job problems using the Send Message feature of the Legably platform. However, in the event that either party feels they cannot get satisfaction please contact the Legably support team at <a className="contact-link" href={"mailto:" + constant['SUPPORT_ID']}>support@legably.com</a> and we will put you in contact with the  dispute management group at our payment processor which has a process in place for negotiation and arbitration.
                      <br /><br />
                      In the near future we are working to directly integrate a negotiation and arbitration process directly into the Legably platform.
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThirteen" aria-expanded="false" aria-controls="collapseTen">
                    <div className="panel-heading" role="tab" id="headingThirteen">
                      <h4 className="panel-title">
                        Is Legably a temp agency?
                      </h4>
                    </div>
                  </a>
                  <div id="collapseThirteen" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThirteen">
                    <div className="panel-body">
                      No. While Legably matches attorneys looking for work with other attorneys who need help, users are never under contract and are free to work on other engagements that they may agree to on or off of the Legably platform. Unlike temp agencies, Legably does not charge exorbitant mark ups or fees.
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFourteen" aria-expanded="false" aria-controls="collapseEleven">
                    <div className="panel-heading" role="tab" id="headingFourteen">
                      <h4 className="panel-title">
                        Is Legably a law firm or legal client referral service?
                      </h4>
                    </div>
                  </a>
                  <div id="collapseFourteen" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFourteen">
                    <div className="panel-body">
                      No. Legably does not provide any legal advice to any party, for any reason. Legably does not connect clients to attorneys, and is in no way involved in any attorney-client relationships. Legably profiles may only be created by licensed attorneys in good standing with their licensing jurisdictions.
                    </div>
                  </div>
                </div>
                <div className="panel panel-default">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFifteen" aria-expanded="false" aria-controls="collapseTwelve">
                    <div className="panel-heading" role="tab" id="headingFifteen">
                      <h4 className="panel-title">
                        Who can I ask if I have any questions?
                      </h4>
                    </div>
                  </a>
                  <div id="collapseFifteen" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFifteen">
                    <div className="panel-body">
                      Feel free to contact our customer support team at <a className="contact-link" href={"mailto:" + constant['SUPPORT_ID']}>support@legably.com</a> at any time, day or night, to have any of your questions answered. We will always respond to user comments and concerns (if any) - so send them along as well!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {!this.state.token && <LegablyLargeFooter />}
      </div>
    );
  }
}
