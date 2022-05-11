import React from 'react';
import {
  Router,
  Route,
  IndexRoute,
  browserHistory
} from 'react-router';

import { constant } from './shared/index';

import Layout from './components/Layout';
import Authenticated from './components/Authenticated';
import Unauthenticated from './components/Unauthenticated';

import Home from './components/home/Home';

import User from './components/user/User';
import SignIn from './components/user/sign-in/SignIn';
import SignUp from './components/user/sign-up/SignUp';
import ForgotPassword from './components/user/forgot-password/ForgotPassword';
import ResetPassword from './components/user/reset-password/ResetPassword';
import VerifyEmail from './components/user/verify-email/VerifyEmail';
import ChangePassword from './components/user/change-password/ChangePassword';

import AboutUs from './components/static/about-us/AboutUs';
import PrivacyPolicy from './components/static/privacy-policy/PrivacyPolicy';
import Pricing from './components/static/pricing/Pricing';
import TermsOfService from './components/static/terms-of-service/TermsOfService';
import Faqs from './components/static/faqs/Faqs';
import ContactUs from './components/static/contact-us/ContactUs';
import SignUpThanks from './components/static/sign-up-thanks/SignUpThanks';
import PageNotFound from './components/static/404/PageNotFound';

import SeekerBasicInfo from './components/role/seeker/basic-info/BasicInfo';
import Experience from './components/role/seeker/experience/Experience';
import Headline from './components/role/seeker/headline/Headline';
import JobType from './components/role/seeker/job-type/JobType';
import GetStarted from './components/role/seeker/get-started/GetStarted';

import PosterBasicInfo from './components/role/poster/basic-info/BasicInfo';
import ThankYou from './components/role/poster/thank-you/ThankYou';
import Subscriptions from './components/subscriptions/Subscriptions';
import Checkout from './components/checkout/Checkout';

import AdminDashboard from './components/admin/Dashboard';

import Profile from './components/dashboard/profile/Profile';
import JobSearch from './components/dashboard/seeker-jobs/Search';
import JobDetail from './components/dashboard/shared/JobDetail';
import AppliedJobs from './components/dashboard/seeker-jobs/AppliedJobs';
import PostedJobs from './components/dashboard/poster-jobs/PostedJobs';
import EditAJob from './components/dashboard/poster-jobs/EditAJob';
import PostAJob from './components/dashboard/poster-jobs/PostAJob';
import CandidateSearch from './components/dashboard/poster-jobs/CandidateSearch';
import CreateStripeAccount from './components/dashboard/shared/CreateStripeAccount';

import MessageView from './components/chat/index'

var routesPath = constant['ROUTES_PATH'];

module.exports = (
  <Router history={browserHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Home} />
      <Route path={routesPath['HOME']} component={Home} />
      <Route path={routesPath['COMPANY_OVERVIEW']} component={AboutUs} />
      <Route path={routesPath['PRIVACY_POLICY']} component={PrivacyPolicy} />
      <Route path={routesPath['TERMS_OF_SERVICE']} component={TermsOfService} />
      <Route path={routesPath['FAQ']} component={Faqs} />
      <Route path={routesPath['PRICING']} component={Pricing} />
      <Route path={routesPath['SUPPORT_CENTER']} component={ContactUs} />

      <Route component={Unauthenticated}>
        <Route component={User}>
          <Route path={routesPath['SIGN_UP']} component={SignUp} />
          <Route path={routesPath['SIGN_IN']} component={SignIn} />
          <Route path={routesPath['FORGOT_PASSWORD']} component={ForgotPassword} />
          <Route path={routesPath['RESET_PASSWORD'] + '/:secretId'} component={ResetPassword} />
        </Route>
        <Route path={routesPath['VERIFY_EMAIL'] + '/:secretId'} component={VerifyEmail} />
      </Route>

      <Route component={Authenticated}>
        <Route path={routesPath['THANKS']} component={SignUpThanks} />
        <Route path={routesPath['SUBSCRIPTIONS']} component={Subscriptions} />
        <Route path={routesPath['CHECKOUT'] + '/:plan'} component={Checkout} />
        <Route path={routesPath['CHANGE_PASSWORD']} component={ChangePassword} />
        <Route path={routesPath['SEEKER_BASIC_INFO']} component={SeekerBasicInfo} />
        <Route path={routesPath['SEEKER_EXEPERIENCE']} component={Experience} />
        <Route path={routesPath['SEEKER_HEADLINE']} component={Headline} />
        <Route path={routesPath['SEEKER_JOB_TYPE']} component={JobType} />
        <Route path={routesPath['SEEKER_GET_STARTED']} component={GetStarted} />
        <Route path={routesPath['POSTER_BASIC_INFO']} component={PosterBasicInfo} />
        <Route path={routesPath['POSTER_THANK_YOU']} component={ThankYou} />
        <Route path={routesPath['PROFILE'] + '/:section'} component={Profile} />
        <Route path={routesPath['JOB_SEARCH']} component={JobSearch} />
        <Route path={routesPath['PROJECT_SEARCH']} component={JobSearch} />
        <Route path={routesPath['JOB_SEARCH'] + '/:jobId'} component={JobDetail} />
        <Route path={routesPath['MY_APPLIED_JOBS']} component={AppliedJobs} />
        <Route path={routesPath['MY_APPLIED_JOBS'] + '/:jobId'} component={JobDetail} />
        <Route path={routesPath['MY_POSTED_JOBS']} component={PostedJobs} />
        <Route path={routesPath['MY_POSTED_JOBS'] + '/:jobId'} component={JobDetail} />
        <Route path={routesPath['MY_POSTED_JOBS'] + '/:jobId/edit'} component={EditAJob} />
        <Route path={routesPath['CANDIDATE_SEARCH']} component={CandidateSearch} />
        <Route path={routesPath['POST_JOB']} component={PostAJob} />
        <Route path={routesPath['POST_PROJECT']} component={PostAJob} />
        <Route path={routesPath['CREATE_STRIPE_ACCOUNT']} component={CreateStripeAccount} />
        <Route path={routesPath['CHAT']} component={MessageView} />

      </Route>

      <Route path="*" component={PageNotFound} />
    </Route>
  </Router>
);
