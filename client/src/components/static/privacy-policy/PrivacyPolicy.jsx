import React from 'react';
import { Link, browserHistory } from 'react-router';

import { LegablyLargeFooter } from '../../index';
import { constant, utils } from '../../../shared/index';

export default class PrivacyPolicy extends React.Component {
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

	render(){
    return (
    	<div className="bg-white">
       	<div className="static-heading">
	        <h1>Privacy Policy</h1>
	      </div>

	      <div className="content-wrapper container privacy-policy">

        <div className="static-panel-div">
          This privacy policy sets out how Legably uses and protects any information that you give Legably when you use this website.<br/><br/>
          Legably is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.<br/><br/>
          Legably may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes. This policy is effective from August 1, 2017.<br/><br/>
          <h1>What we collect</h1>
          Information collected by Legably includes, but is not limited to, the following:<br/>
          <ul>
            <li>Name, title and education;</li>
            <li>Law firm information;</li>
            <li>Disciplinary and malpractice insurance information;</li>
            <li>Contact information including but not limited to your email address;</li>
            <li>Demographic information such as postcode, preferences and interests;</li>
            <li>Payment information, including, but not limited to, credit card, bank account, ACH and PayPal information;</li>
            <li>Other information relevant to customer surveys and/or offers;</li>
          </ul><br/>
          <h1>What we do with the information we gather</h1>
          We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:<br/>
          <ul>
            <li>Internal record keeping.</li>
            <li>We may use the information to improve our products and services.</li>
            <li>We may periodically send promotional email about new products, special offers or other information which we think you may find interesting using the email address which you have provided. </li>
            <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail.</li>
            <li>We may use the information to customize the website according to your interests.</li>
            <li>We may provide your information to our third party partners for marketing or promotional purposes.</li>
            <li>We will never sell your information.</li>
            <li>Banking information is encrypted and transmitted via 2048-bit encryption for your protection. </li>
          </ul><br/>
          <h1>Sharing Your Information</h1>
          Legably will not share any information collected on the site unless provided for under this policy. Legably may provide personal information to Legably employees, contractors, sub-contractors, professional advisors and other third parties as may be necessary. This may be necessary for, among other reasons, providing product improvements and enhancing communication between our users and Legably.<br/><br/>
          Legably, from time-to-time, may engage in partnerships or other affiliate agreements with other entities. Legably may share your information with these entities. Any partner or affiliate of Legably shall be required to adhere to this Privacy Policy.<br/><br/>
          <h1>Public Information</h1>
          As a part of the profile creation process, Legably users create a profile and provide information including, but not limited to, contact and firm information, career preferences and past experience. Any other registered user of Legably can view this information. Legably maintains no obligations as to your profile or any information provided to other registered users of the site.<br/><br/>
          <h1>Security</h1>
          We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online. This includes secure 2048-bit SSL encryption.<br/><br/>
          <h1>How we use cookies</h1>
          A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.<br/><br/>
          We use traffic log cookies to identify which pages are being used. This helps us analyze data about web page traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.<br/><br/>
          Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.<br/><br/>
          You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.<br/><br/>
          <h1>Links to other websites</h1>
          Our website may contain links to enable you to visit other websites of interest easily. However, once you have used these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question.<br/><br/>
          <h1>Controlling your personal information</h1>
          We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.<br/><br/>
          Legably users may review any personal information maintained by Legably by contacting us at <a className="contact-link" href={"mailto:" + constant['SUPPORT_ID']}>support@legably.com</a>.<br/><br/>
          If you believe that any information we are holding on you is incorrect or incomplete, please contact us at <a className="contact-link" href={"mailto:" + constant['SUPPORT_ID']}>support@legably.com</a>. We will promptly correct any information found to be incorrect.<br/><br/>
          <h1>Contact Information</h1>
          Please feel free to contact us via email at <a className="contact-link" href={"mailto:" + constant['SUPPORT_ID']}>support@legably.com</a> for any information on Legably’s privacy policy and initiatives.
        </div>
      </div>
      {!this.state.token && <LegablyLargeFooter />}
    </div>
    );
  }
}
