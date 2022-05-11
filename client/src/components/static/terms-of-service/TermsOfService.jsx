import React from 'react';
import { Link, browserHistory } from 'react-router';

import { LegablyLargeFooter } from '../../index';
import { utils } from '../../../shared/index';

export default class TermsOfService extends React.Component {
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
	        <h1>Terms of Service</h1>
	      </div>

	      <div className="content-wrapper container terms-of-service">

        <div className="static-panel-div">
          These Terms of Service constitute a legally binding agreement between you and Legably
          Inc. (“Legably”) and govern your use of the Legably website (the “Site”) and all related web
          and mobile services, including those from third parties that are incorporated or used in
          conjunction with the Legably website and service (collectively, with the Site, the “Service”). A
          breach or violation of any of these Terms of Service will result in an immediate termination of
          your services at the sole discretion of Legably. Legably reserves the right to change these
          Terms of Service at any time. The most current Terms of Service will always be available on
          this page. All Site visitors and users of the Service should routinely visit this page to view the
          most up-to- date Terms of Service governing the Service.<br/><br/>
          By using the Service, you agree to be bound by these Terms of Service. Your Legably
          account may be used only after acknowledging and agreeing to abide by these Terms of
          Service.<br/><br/>
          <h1>Using the Service</h1>
          Legably is neither a law firm nor a referral service. Legably does not interfere, in any way,
          with any independent attorney-client relationship that any Legably attorney may have at any
          time. Legably is strictly a professional service, operated for attorneys to manage their work.
          Legably does not participate in any attorney fee sharing, and neither solicits nor receives any
          fees paid by any client to any attorney for legal work performed. Legably does not
          recommend or endorse any specific attorneys or offer any legal advice of any kind, to any
          party.<br/><br/>
          All attorneys using Legably agree to adhere to all rules of professional conduct in all
          jurisdictions in which they are licensed and/or practicing law. All attorneys using Legably are
          solely responsible for properly vetting all legal work for potential conflicts-of- interest, and
          adhering to all relevant and applicable rules regarding the handling of any and all conflicts-of-
          interest. Legably is not responsible for any apparent or actual conflicts-of- interest that may or
          may not exist.<br/><br/>
          To use Legably, all users must be:<br/>
          1. At least 18 years of age; and<br/>
          2. An attorney in good standing in your respective bar or jurisdiction or a law firm, legal
          department or licensed attorney of a business entity using Legably to find and retain
          freelance legal assistance on a contract basis.<br/><br/>
          All Legably users must:<br/>
          <ul>
            <li>Provide your full legal name, a valid email address, your valid attorney identification information where applicable and any other information requested in order to complete the signup process accurately.</li>
            <li>Accurately and proactively report any previous, current or pending disciplinary action.</li>
            <li>Use only a single username and password (&quot;login&quot;). You cannot share an account.</li>
            <li>Keep your password secure—Legably cannot and will not be liable for any loss or damage from your failure to maintain the security of your account and password.</li>
            <li>Notify Legably immediately if you suspect any security breaches to your account or the Legably system.</li>
            <li>Be responsible for all activity and content (including, but not limited to, data, graphics, photos, and links) that is uploaded under your Service account.</li>
            <li>Read, understand, agree to and abide by all parts of these Terms of Service.</li>
            <li>Perform obligations as specified by this agreement and agreements that you enter into through the Service when not in conflict with these Terms of Service or prohibited by law.</li>
            <li>Represent and warrant that your user content and Legably’s use thereof in the context of these Terms of Service and the Service will not infringe upon the Intellectual Property Rights, Privacy Rights or Publicity rights of any third party.</li>
            <li>Represent and warrant that you have the written consent of each and every identifiable natural person in the user content to use such person’s name or likeness in the manner contemplated by the Service and these Terms of Service, and each such person has released you from any liability that may arise in relation to such use.</li>
          </ul><br/>
          Legably users MAY NOT:<br/>
          <ul>
            <li>Be a recruiter, including attorneys that are engaged in the businesses of staffing employees, or otherwise a third party to the retaining or hiring of attorneys unless expressly permitted by Legably.</li>
            <li>Register and explore the software service for the purpose of reproducing, replicating, or otherwise copying the software service and business model.</li>
            <li>Be an attorney disbarred for disciplinary action.</li>
            <li>Use Legably to contact attorneys looking for work off of the Legably platform.</li>
            <li>Upload, post, host or transmit unsolicited e-mail, SMS, Instant Messenger, Twitter or other &quot;spam&quot; messages.</li>
            <li>Transmit worms or viruses or any other code of a destructive nature.</li>
            <li>Use Legably to contact any other users outside of seeking or responding to a particular job posting, unless otherwise permitted.</li>
            <li>Reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without the express written permission by Legably.</li>
            <li>Use this service for any illegal or unauthorized purpose.</li>
          </ul><br/>
          Legably retains the right to pursue legal action and damages for any violations of any of these restricted uses.<br/><br/>
          Legably retains the right to refuse, suspend or terminate service to any user, for any time and for any reason.<br/><br/>
          <h1>The Relationship Between Attorneys and Legably</h1>
          When attorneys create engagements through the Service, they are creating a contract for professional services between each other. Legably does not have any responsibility to provide the agreed services or enforce an attorney’s provision of those services.<br/><br/>
          Once attorneys agree to an engagement, the attorney receiving services (the “Receiving
          Attorney”) will pay Legably the agreed fee for those services (the “Attorney Fee”), plus
          Legably’s service fee (the “Legably Service Fee”). Legably will then hold both the Attorney
          Fee and the Legably Service Fee in escrow, releasing funds only under the following
          circumstances:<br/><br/>
          <ul>
            <li>Legably will release the entire Attorney Fee to the attorney providing the service (the “Providing Attorney”) and the Legably Service Fee to Legably if:
              <ul>
                <li>The Receiving Attorney indicates, through the Service, that the agreed-to service has been completed by the Providing Attorney;</li>
                <li>Legably receives joint written instructions from both the Receiving Attorney and the Providing Attorney to release the entire Attorney Fee to the Providing Attorney; or</li>
                <li>Legably receives an order from a court of competent jurisdiction specifying that the Providing Attorney is entitled to the Attorney Fee.</li>
              </ul>
            </li>
            <li>Legably will release portions of the Attorney Fee to the Providing Attorney if:
              <ul>
                <li>The Receiving Attorney indicates, through the Service, that the portion of the agreed-to service corresponding to that portion has been completed by the Providing Attorney;</li>
                <li>Legably receives joint written instructions from both the Receiving Attorney and the Providing Attorney to release that portion of the Attorney Fee to the Providing Attorney; or</li>
                <li>Legably receives an order from a court of competent jurisdiction specifying that the Providing Attorney is entitled to that portion of the Attorney Fee.</li>
              </ul>
            </li>
            <li>Legably will release the entire Attorney Fee and the Legably Service Fee to the Receiving Attorney if:
              <ul>
                <li>Legably receives joint written instructions from both the Receiving Attorney and the Providing Attorney to release the entire Attorney Fee back to the Receiving Attorney; or</li>
                <li>Legably receives an order from a court of competent jurisdiction specifying that the Receiving Attorney is entitled to return of the Attorney Fee.</li>
              </ul>
            </li>
          </ul><br/>
          For purposes of clarification, the Legably Service Fee is the consideration that Legably receives for providing the Service. Legably will not, however, be entitled to the Legably Service Fee until the Receiving Attorney (or a court of competent jurisdiction) indicates that the Providing Attorney has performed all agreed-to services.<br/><br/>
          Legably takes no responsibility for resolving disputes between Receiving Attorneys and Providing Attorneys and will not intervene in any such disputes. You specifically agree to indemnify Legably against any reasonably legal fees incurred in connection with any dispute between yourself and another attorney.<br/><br/>
          <h1>Payments:</h1>
          Legably currently uses secure third-party payment processors to facilitate the payment of fees by and to users. Our third-party payment processors accept payments through methods detailed on the applicable payment screen, which may include, but not be limited to, Automated Clearing House (ACH), various credit cards and PayPal. Information that you supply to our payment processors is not stored by us or within our control, and is subject to each of our third-party payment processors’ own privacy policies and terms and conditions. Third-party payment processors may charge a fee to process payments and Legably is not responsible for any fees charged by them. Third-party payment processors may maintain dispute management policies and/or services for users of their services. Legably does not provide such services, and does not mediate disputes that may arise between users.<br/><br/>
          Some of our Services are billed on a subscription basis (we call these “Subscriptions”). This means that you will be billed in advance on a recurring, periodic basis (each period is called a “billing cycle”).
          Billing cycles are typically monthly or annual, depending on what subscription plan you select when purchasing a Subscription. Your Subscription will automatically renew at the end of each billing cycle unless you cancel auto-renewal through your online account management page, or by <a href="mailto:support@legably.com">contacting our customer support team.</a>
          While we will be sad to see you go, you may cancel auto-renewal on your Subscription at any time, in which case your Subscription will continue until the end of that billing cycle before terminating. You may cancel auto-renewal on your Subscription immediately after the Subscription starts if you do not want it to renew.
          <br/><br/>
          Our prices listed do not include any taxes, levies, duties or similar governmental assessments of any nature such as value-added, sales, use or withholding taxes, assessable by any jurisdiction (collectively, “Taxes”) unless otherwise indicated. You are responsible for paying Taxes associated with your purchase and keeping your billing information up to date.
          <br/><br/>
          &nbsp;&nbsp;&nbsp;(a) United States Sales Tax. If we have a legal obligation to pay or collect sales tax for which you    are responsible, we will calculate the sales tax based upon the billing information we have about you and charge you that amount (which, if your billing information is incomplete or inaccurate, may be the highest prevailing rate then in effect), unless you provide us with a valid tax exemption certificate acceptable to the appropriate taxing authority.
          <br/><br/>
          <ul>
            <li>If you provide us with a tax exemption certificate, you represent and warrant that it accurately reflects your tax status and that you will keep such document current and accurate.</li>
            <li>If we subsequently determine in our sole discretion that your tax exemption document is valid, we will refund the sales tax collected.</li>
          </ul>
          <br/>
          &nbsp;&nbsp;&nbsp;(b) Non-United States Sales Tax. If applicable, we will charge you VAT, GST or any other sales, consumption or use taxes that arise in connection with your purchases of Legably products unless you provide us with a tax identification number that entitles you to an exemption, a valid tax exemption certificate or other documentary proof issued by an appropriate taxing authority that tax should not be charged. If you are located in a jurisdiction with multiple sales, consumption or use taxes, we may charge you the highest prevailing rate if your billing information is incomplete or inaccurate.
          <br/><br/>
          If you are required by law to withhold any Taxes from your payments to Legably, you must provide Legably with an official tax receipt or other appropriate documentation to support such payments.
          <br/><br/>
          Legably may change the fees charged to you for the Services at any time, provided that, for Services billed on a subscription basis, the change will become effective only at the end of the then-current billing cycle of your Subscription. Legably will provide you with advance notice of any change in fees.
          <br/><br/>
          <h1>Digital Millennium Copyright Act [DCMA] Notice:</h1>
          Legably respects the intellectual property of others and asks that users of the Service do the
          same. We have adopted and implemented a policy respecting copyright law that provides
          for the removal of any infringing materials and for the termination, in appropriate
          circumstances, of users of the Service who are repeat infringers of intellectual property
          rights, including copyrights. If you believe that one of our users is, through the use of the
          Service, unlawfully infringing the copyright(s) in a work, and wish to have the allegedly
          infringing material removed, the following information in the form of a written notification
          (pursuant to 17 U.S.C. § 512(c)) must be provided to our designated Copyright Agent:<br/><br/>
          1. your physical or electronic signature;<br/>
          2. identification of the copyrighted work(s) that you claim to have been infringed;<br/>
          3. identification of the material on our services that you claim is infringing and that you request us to remove;<br/>
          4. sufficient information to permit us to locate such material;<br/>
          5. your address, telephone number, and e-mail address;<br/>
          6. a statement that you have a good faith belief that use of the objectionable material is not authorized by the copyright owner, its agent, or under the law; and<br/>
          7. a statement that the information in the notification is accurate, and under penalty of
          perjury, that you are either the owner of the copyright that has allegedly been
          infringed or that you are authorized to act on behalf of the copyright owner.<br/><br/>
          Please note that, pursuant to 17 U.S.C. § 512(f), any misrepresentation of material fact (falsities) in a written notification automatically subjects the complaining party to liability for any damages, costs and attorney’s fees incurred by us in connection with the written notification and allegation of copyright infringement.<br/><br/>
          The designated Copyright Agent for Company is: Daniel P. Reilly<br/><br/>
          Address of Agent: Legably Inc., 225 Dyer Street, Second Floor, Providence, RI 02903<br/><br/>
          Telephone: 401-619-8734<br/><br/>
          Email: dreilly@legably.com<br/><br/>
          <h1>Communications from Legably to you:</h1>
          Unless you otherwise indicate in writing to the address listed under “Communications from
          you to Legably,” Legably will communicate with you by email or by posting communications
          on the Site. You consent to receive communications from us electronically and you agree
          that these electronic communications satisfy any legal requirement that such
          communications be in writing. You will be considered to have received communication when
          Legably sends it to the email address you have provided to Legably on the Site, or when
          Legably posts such communication on the Site. You must keep your email address updated
          on this Site and you must regularly check this Site for postings.<br/><br/>
          <h1>Communications from you to Legably:</h1>
          All notices to Legably intended to have a legal effect concerning these Terms of Service
          must be in writing and delivered either in person or by a means evidenced by a delivery
          receipt, to the following address:<br/><br/>
          Legably, Inc.<br/>
          2 Regency Plaza<br/>
          Suite 410<br/>
          Providence, Rhode Island 02903<br/><br/>
          Such notices to Legably, Inc. are deemed effective upon receipt.<br/><br/>
          <h1>Privacy Policy:</h1>
          All information we collect through the Service is subject to our Privacy Policy, which is
          located at http://www.legably.com/privacy and incorporation into these Terms of Service by reference. By using the
          Service, you consent to all actions taken by us with respect to your information in compliance
          with the Privacy Policy.<br/><br/>
          <h1>Links to Third Party Sites:</h1>
          The Service may contain links to third-party websites and services, and/or display
          advertisements for third parties (collectively, “Third-Party Links &amp; Ads”). Such Third-Party
          Links &amp; Ads are not under Legably’s control, and Legably is not responsible for any Third-
          Party Links &amp; Ads. Company provides access to these Third-Party Links &amp; Ads only as a
          convenience to you, and does not review, approve, monitor, endorse, warrant, or make any
          representations with respect to Third-Party Links &amp; Ads. You and your guests use all Third-
          Party Links &amp; Ads at your own risk, and should apply a suitable level of caution and
          discretion in doing so. When you or your guests click on any of the Third-Party Links &amp; Ads,
          the applicable third party’s terms and policies apply, including the third party’s privacy and
          data gathering practices.<br/><br/>
          <h1>Indemnification:</h1>
          You agree to indemnify and hold Legably (and its officers, employees, and agents) harmless,
          including for costs and attorneys’ fees, from any claim or demand made by any third party
          due to or arising out of (a) your use of the Service, (b) your violation of these Terms of
          Service, (c) your violation of applicable laws or regulations. Company reserves the right, at
          your expense, to assume the exclusive defense and control of any matter for which you are
          required to indemnify us, and you agree to cooperate with our defense of these claims. You
          agree not to settle any matter without Legably’s prior written consent. Legably will use
          reasonable efforts to notify you of any such claim, action or proceeding upon becoming
          aware of it.<br/><br/>
          <h1>Disclaimer:</h1>
          The Service is provided on an “as-is” and “as available” basis, and Legably expressly
          disclaims any and all warranties and conditions of any kind, whether express, implied, or
          statutory, including all warranties or conditions of merchantability, fitness for a particular
          purpose, title, quiet enjoyment, accuracy, or non-infringement. Legably makes no warranty
          that the Service will meet your requirements, will be available on an uninterrupted, timely,
          secure, or error-free basis, or will be accurate, reliable, free of viruses or other harmful code,
          complete, legal, or safe. If applicable law requires any warranties with respect to the
          Service, all such warranties are limited in duration to ninety (90) days from the date of first
          use.<br/><br/>
          Some jurisdictions do not allow the exclusion of implied warranties, so the above exclusion
          may not apply to you. Some jurisdictions do not allow limitations on how long an implied
          warranty lasts, so the above limitation may not apply to you.<br/><br/>
          Legably specifically disclaims any representation or warranty regarding any Providing
          Attorney or the services that they may provide.<br/><br/>
          <h1>Limitation of Liability:</h1>
          To the maximum extent permitted by law, in no event will Legably be liable to you or any
          third party for any lost profits, lost data, costs of procurement of substitute products, or any
          indirect, consequential, exemplary, incidental, special or punitive damages arising from or
          relating to these terms or your use of, or inability to use, the Service, even if Legably has
          been advised of the possibility of such damages. Access to, and use of, the Service is at
          your own discretion and risk, and you will be solely responsible for any damage to your
          device or computer system, or loss of data resulting therefrom.<br/><br/>
          to the maximum extent permitted by law, notwithstanding anything to the contrary contained
          herein, our liability to you for any damages arising from or related to these Terms of Service
          (for any cause whatsoever and regardless of the form of the action), will at all times be
          limited to the greater of (a) any fees that you have paid Legably for use of services or tools
          provided through the Service and (b) fifty US dollars (U.S. $50). The existence of more than
          one claim will not enlarge this limit. You agree that Legably’s suppliers will have no liability
          of any kind arising from or relating to these Terms of Service.<br/><br/>
          Some jurisdictions do not allow the limitation or exclusion of liability for incidental or
          consequential damages, so the above limitation or exclusion may not apply to you.<br/><br/>
          <h1>Governing Law and Venue:</h1>
          All matters relating to your use of the Service and any dispute or claim arising therefrom or
          related thereto (in each case, including non-contractual disputes or claims), shall be
          governed by and construed in accordance with the internal laws of the State of Rhode Island
          without giving effect to any choice or conflict of law provision or rule (whether of the State of
          Rhode Island or any other jurisdiction).<br/><br/>
          Any legal suit, action or proceeding arising out of, or related to, your use of the Service shall
          be instituted exclusively in the federal courts of the United States or the courts of the State of
          Rhode Island, in each case located in the City of Providence and County of Providence. You
          waive any and all objections to the exercise of jurisdiction over you by such courts and to
          venue in such courts.<br/><br/>
          <h1>Miscellaneous:</h1>
          These Terms of Service constitute the entire agreement between you and Legably regarding
          the use of the Service. Our failure to exercise or enforce any right or provision of these
          Terms shall not operate as a waiver of such right or provision. The section titles in these

          Terms of Service are for convenience only and have no legal or contractual effect. The word
          “including” means “including without limitation”. If any provision of these Terms of Service is,
          for any reason, held to be invalid or unenforceable, the other provisions of these Terms of
          Service will be unimpaired and the invalid or unenforceable provision will be deemed
          modified so that it is valid and enforceable to the maximum extent permitted by law. Your
          relationship to Legably is that of an independent contractor, and neither party is an agent or
          partner of the other. These Terms of Service, and your rights and obligations herein, may
          not be assigned, subcontracted, delegated, or otherwise transferred by you without Legably’s
          prior written consent, and any attempted assignment, subcontract, delegation, or transfer in
          violation of the foregoing will be null and void. Legably may freely assign these Terms of
          Service. The terms and conditions set forth in these Terms of Service shall be binding upon
          your assignees and successors.
        </div>
      </div>
      {!this.state.token && <LegablyLargeFooter />}
    </div>
    );
  }
}
