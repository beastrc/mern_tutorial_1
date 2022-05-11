const ROUTES_PATH = {
  HOME: '/',
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  THANKS: '/thanks',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CHANGE_PASSWORD: '/change-password',
  COMPANY_OVERVIEW: '/company-overview',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  FAQ: '/frequently-asked-questions',
  PRICING: '/pricing',
  SUBSCRIPTIONS: '/subscriptions',
  CHECKOUT: '/checkout',
  SUPPORT_CENTER: '/support-center',
  SEEKER_BASIC_INFO: '/attorney-profile-basic-info',
  SEEKER_EXEPERIENCE: '/attorney-profile-experience',
  SEEKER_HEADLINE: '/attorney-profile-headline',
  SEEKER_JOB_TYPE: '/attorney-profile-job-type',
  SEEKER_GET_STARTED: '/attorney-profile-get-started',
  POSTER_BASIC_INFO: '/post-job-basic-information',
  POSTER_THANK_YOU: '/post-job-thank-you',
  PROFILE: '/profile',
  JOB_SEARCH: '/job-search',
  PROJECT_SEARCH: '/project-search',
  MY_APPLIED_JOBS: '/my-applied-jobs',
  MY_POSTED_JOBS: '/my-posted-jobs',
  CANDIDATE_SEARCH: '/candidate-search',
  POST_JOB: '/post-job',
  POST_PROJECT: '/post-project',
  VERIFY_EMAIL: '/verify-email',
  CREATE_STRIPE_ACCOUNT: '/create-stripe-account',
  CHAT: '/messages',
  BLOG: 'https://blog.legably.com/',
};

const SUPPORT_ID = 'support@legably.com';

module.exports = {
  OOPS_ERROR: 'Oops!! Something went wrong',
  REQUEST_OK: 'The request is OK',
  AUTH_FAIL: 'Authentication failed',
  SUCCESS_UPDATE_PROFILE: 'You have successfully updated your profile',
  INVALID_LINKEDIN_LINK: 'Please enter a valid LinkedIn link',
  INVALID_FILE_FORMAT: 'Unsupported file format',
  ENTER_EMAIL: 'Please enter your email address',
  ENTER_PASSWORD: 'Please enter your password',
  INVALID_EMAIL_ADD: 'Please enter a valid email address',
  EMAIL_ALREADY_EXIST: 'Email already exists',
  ENTER_CURR_PASS: 'Please enter your current password',
  ENTER_NEW_PASS: 'Please enter your new password',
  ENTER_RETYPE_PASS: 'Please retype your password',
  ENTER_NEW_RETYPE_PASS: 'Please retype your new password',
  PASS_NOT_MATCH: 'Passwords do not match',
  INVALID_PASS_LENGTH: 'A valid password must be at least 8 characters long',
  INVALID_BAR_LENGTH: 'Bar registration number cannot be more than 15 digits',
  INVALID_SINGLE_CHAR_PASS:
    'The password can not consist of single characters, i.e. "11111111" or "aaaaaaaa"',
  INVALID_CONSECUTIVE_PASS:
    'The password can not consist of consecutive characters, i.e. "12345678" or "abcdefgh"',
  ENTER_FIRST_NAME: 'Please enter your first name',
  ENTER_LAST_NAME: 'Please enter your last name',
  ENTER_SUBJECT: 'Please enter your subject',
  ENTER_MESSAGE: 'Please enter your message',
  INVALID_FIRST_NAME_FORMAT:
    'First Name should contain only alphabetic characters',
  INVALID_FIRST_NAME_LENGTH: 'First Name must be less than 50 characters',
  INVALID_LAST_NAME_FORMAT:
    'Last Name should contain only alphabetic characters',
  INVALID_LAST_NAME_LENGTH: 'Last Name must be less than 50 characters',
  INVALID_SUB_LENGTH: 'Subject must be less than 50 characters',
  INVALID_MESSAGE_LENGTH: 'Message must be 1000 characters or less',
  CHECKBOX_ERROR: 'Please click the checkbox to verify',
  CONTACTUS_SUCCESS_MAIL_MESSAGE:
    "Thanks! Your message has been sent. We'll get back to you as soon as possible.",
  TERM_SERV_ERROR: "Please click here to accept Legably's Terms of Service",
  INVALID_LAWYER_HEADLINE_LENGTH:
    'My Headline must be less than 150 characters',
  INVALID_ABOUT_ME_LENGTH: 'About Me must be less than 700 characters',
  ENTER_PRACTICE_AREA: 'Please select your practice area',
  ENTER_STREET_ADD: 'Please enter your street address',
  INVALID_CITY_NAME: 'Please enter valid city name',
  ENTER_CITY: 'Please enter your city',
  ENTER_STATE: 'Please select your state',
  ENTER_ZIPCODE: 'Please enter zip code',
  ENTER_FIRM_NAME: 'Please enter firm name',
  ENTER_STATE_LICENSURE: 'Please enter state',
  ENTER_BAR_REGISTRATION_NUMBER: 'Please enter bar registration number',
  INVALID_PHONE_NO: 'Please enter valid mobile number',
  ENTER_PHONE_NO: 'Please enter your mobile number',
  ENTER_SCHOOL: 'Please enter your school',
  ENTER_DEGREE: 'Please enter your degree',
  ENTER_YEAR: 'Please enter your graduated year',
  ENTER_BAR_SKILL: 'Please enter skills',
  INVALID_ADD_INFO_LENGTH:
    'Additional Information must be less than 250 characters',
  ENTER_BAR_NO: 'Please enter your bar registration number',
  ONLY_NUMERIC_ERROR: 'Please enter numeric values only',
  INVALID_ZIPCODE: 'Zip Code should be numeric and only 5 digits',
  INVALID_YEAR: 'Please enter a valid year',
  INVALID_YEAR_RANGE: 'Year should be in range 1920 to current year',
  INVALID_COMPANY_NAME_LENGTH: 'Company name must be less than 100 characters',
  GREATER_START_DATE_ERROR: 'Start date is greater than end Date',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_FIRSTNAME: 'Please enter a valid First Name',
  INVALID_LASTNAME: 'Please enter a valid Last Name',
  INVALID_URL: 'Please enter a valid website url',
  IMAGE_SIZE_ERROR: 'Image size should not exceed 10MB',
  RESUME_SIZE_ERROR: 'File size should not exceed 3MB',
  ENTER_LOCATION: 'Please select state',
  DURATION_ERROR: 'Duration should be greater than zero',
  RATE_ERROR: 'Rate should be greater than zero',
  HOURS_ERROR: 'Hours should be greater than zero',
  ENTER_DURATION: 'Please enter duration',
  ENTER_RATE: 'Please enter rate',
  ENTER_HOURS: 'Please enter hours',
  ENTER_DUE_DATE: 'Please enter due date',
  INVALID_DUE_DATE: 'Due date can not be less than current date',
  PAYMENT_RATE: 'Please enter rate/hours',
  PAYMENT_RATE_ERROR: 'Rate should not exceed the total amount',
  FILE_UPLOAD_ERROR: 'Please upload file',
  FILE_SIZE_ERROR: 'File size should not exceed 5MB',
  MIN_JOB_AMOUNT: 'Amount Payable cannot be less than $100.00',
  ONLY_CAPS_ERROR: 'Please use uppercase letters',

  SUBSCRIPTION_TIERS: [
    {
      title: '1 to 5 Projects / Month',
      price: '$99',
      subtitle: '/ month + 2.5% of completed projects',
      details: [
        'Access to our platform of vetted attorneys',
        'Unlimited users',
        'Ability to search, sort, and view all attorneys on the platform',
        'Message attorneys who could work on your projects',
        'Invite specific attorneys to work on your Projects',
        'Manage the project workflow in one, centralized location',
        'Process payments seamlessly, with Legably managing all back-office tax compliance issues',
        'Access to 24/7 customer support through chat and email'
      ]
    },
    {
      title: '6 to 10 Projects / Month',
      price: '$149',
      subtitle: '/ month + 2.5% of completed projects',
      details: [
        'Access to our platform of vetted attorneys',
        'Unlimited users',
        'Ability to search, sort, and view all attorneys on the platform',
        'Message attorneys who could work on your projects',
        'Invite specific attorneys to work on your Projects',
        'Manage the project workflow in one, centralized location',
        'Process payments seamlessly, with Legably managing all back-office tax compliance issues',
        'Access to 24/7 customer support through chat and email'
      ]
    },
    {
      title: '10+ Projects / Month',
      price: '$199',
      subtitle: '/ month + 2.5% of completed projects',
      details: [
        'Access to our platform of vetted attorneys',
        'Unlimited users',
        'Ability to search, sort, and view all attorneys on the platform',
        'Message attorneys who could work on your projects',
        'Invite specific attorneys to work on your Projects',
        'Manage the project workflow in one, centralized location',
        'Process payments seamlessly, with Legably managing all back-office tax compliance issues',
        'Access to 24/7 customer support through chat and email'
      ]
    }
  ],

  VALIDATION_MSG: {
    FIELDS_NAME: {
      LEGAL_NAME: 'legal name',
      S_CASE_LEGAL_NAME: 'Legal Name',
      ADDRESS: 'address',
      S_CASE_ADDRESS: 'Address',
      CITY: 'city',
      S_CASE_CITY: 'City',
      STATE: 'state',
      ZIP_CODE: 'zip code',
      TAXPAYER_ID_NUMBER: 'taxpayer identification number',
      FEDERAL_TAX: 'federal tax classification',
      SUBJECT: 'subject',
      MSG: 'message',
      LIMIT_50: 50,
      LIMIT_150: 150,
      LIMIT_250: 250
    },

    REQUIRED_FIELD: 'Please enter your {fieldName}',
    REQUIRED_DROPDOWN: 'Please select your {fieldName}',
    REQUIRED_OTHER_FIELD: 'Please enter your other {fieldName}',
    ONLY_ALPHABETIC: '{fieldName} should contain only alphabetic characters',
    INVALID_MAX_CHAR_LIMIT:
      '{fieldName} must be less than {charLimit} characters',
    INVALID_ENTRY: 'Please enter a valid {fieldName}',
    INVALID_ZIPCODE: 'Zip Code should be numeric and only 5 digits'
  },
  POPUP_MSG: {
    VERIFY_EMAIL:
      'We cannot verify this email address because another Legably user account is currently logged in using this browser, probably in another browser tab.\n\nPlease log out of that account and also close that browser tab. Then click the Verify Email button in the original email message that was sent to you to complete the verification of that email address.\n\nIf you have any questions please reach out to us at support@legably.com.',
    RESET_PASS_SUCCESS: 'You have successfully reset your password.',
    CONFIRM_MSG: 'Are you sure you want to ',
    DELETE_PHOTO: 'delete this photo?',
    LEAVE_ROLE:
      'The information you have entered on this page may not have been saved. Are you sure you want to leave?',
    JOB_POST_SUCCESS:
      'Your job has been posted successfully.\nDo you want to create a new job?',
    JOB_SAVE_SUCCESS:
      'Your job has been saved successfully.\nDo you want to create a new job?',
    JOB_UPDATE_SUCCESS: 'Your job has been updated successfully.',
    INCOMPLETE_SEEKER_PROFILE:
      'You must complete the "I Want To Find A Job" section of your profile before you can access this option.',
    INCOMPLETE_POST_PROFILE:
      'You must complete the "I Want To Post A Job" section of your profile before you can access this option.',
    DECLINE_CANDIDATE: 'decline this candidate?',
    CANDIDATE_IN_NEGOTIATING_TERM:
      'You can negotiate terms with only one candidate at a time.',
    WITHDRAW_BY_POSTER:
      'remove this candidate from consideration for this job?',
    WITHDRAW_BY_SEEKER: 'remove yourself from consideration for this job?',
    REMAINING_AMOUNT_ERROR:
      'Remainder To Be Allocated amount must be zero before you can Submit Terms.',
    SUBMIT_TERMS_SUCCESS:
      'Your job terms have been submitted to the candidate.',
    SUBMIT_TERMS_FRAGMENT:
      '\nOnce a candidate accepts your terms you will be asked to create a Stripe account on the Start Pending screen so you can transfer funds and start work on the job.\nIf you have any additional questions please contact the Legably support team at <a href="mailto:' +
      SUPPORT_ID +
      '">support@legably.com</a>.',
    SEND_MSG_SUCCESS: 'Message sent successfully.',
    ACCEPT_TERMS: 'accept the proposed terms?',
    ACCEPT_TERMS_SUCCESS:
      'You have accepted the job terms proposed by the hiring manager.',
    ACCEPT_TERMS_FRAGMENT:
      '\nYou will be asked for additional financial information on the Start Pending screen so job payments can be released once job milestones are completed and approved by the hiring manager.\nIf you have any additional questions please contact the Legably support team at <a href="mailto:' +
      SUPPORT_ID +
      '">support@legably.com</a>.',
    INVALID_BAR_ID:
      'We’re sorry but we are having difficulty verifying your Bar certifications. Please contact support for further assistance.',
    CONFLICT: 'You cannot perform this action at the moment.',
    SIGN_IN_EMAIL_VERIFICATION_REQUIRED:
      '<span>Email Verification Required</span>\nBefore we can activate your account you must verify your email address by following the instructions in the veriﬁcation email that we sent to <b>{emailAddress}</b>.\nClick the Resend Email button below to resend the verification email to the email address above.',
    SIGN_UP_EMAIL_VERIFICATION_REQUIRED:
      '<span>One More Step</span>\nYou have successfully signed up for Legably. Before we can activate your account we need you to verify your email address.\nWe have sent a message to <b>{emailAddress}</b> with instructions on how to verify your email address.',
    SEND_EMAIL_SUCCESS: 'Email sent successfully.',
    ACCOUNT_FROZEN_SEEKER:
      'Your account has been temporarily frozen because there is a problem with the Bar ID information that you entered on your profile.\nWhile your account is frozen you will not be able to apply any new jobs or proceed with any existing job interviews.\nPlease make sure the Bar ID information on you profile is correct and contact Legably Support team at <a href="' +
      ROUTES_PATH['SUPPORT_CENTER'] +
      '" target="_blank">support@legably.com</a> for additional assistance in resolving this issue.',
    ACCOUNT_FROZEN_POSTER:
      'The candidate\'s account has been temporarily frozen because of a problem of Bar ID information on their profile.\nWhile their account is frozen you will not be able to move them through the job interview process. We are working with the candidate to resolve this situation as quickly as possible.\nIf you have any questions please contact the Legably Support team at <a href="' +
      ROUTES_PATH['SUPPORT_CENTER'] +
      '" target="_blank">support@legably.com</a>.',
    TRANSFER_FUND_SUCCESS: 'Funds have been transferred successfully.',
    DELIVERABLE_SEND_SUCCESS: 'Deliverable uploaded successfully.',
    DELIVERABLE_APPROVE_SUCCESS: 'Deliverable approved successfully.',
    DELIVERABLE_REJECT_SUCCESS: 'Deliverable rejected successfully.',
    CREATE_STRIPE_ACCOUNT:
      'You have not created your stripe account yet. Please do so before editing your W-9 information.',
    W_NINE_SUCCESS: 'W-9 Tax Information saved successfully.',
    SEQUENTIAL_ORDER_DUE_DATE:
      "Before submitting terms to the candidate you must correct the following items:\n\n<ul><li>Every milestone must have a due date assigned to it and should not be less than the current date.</li><li>Each milestone's due date must be greater than the previous milestone's due date.</li></ul>",
    RELEASE_PAYMENT_SUCCESS: 'Payment has been released successfully.',
    TRANSFER_FUNDS:
      'Are you sure you want to tranfer {amount} to Legably to start work on this job?',
    SEND_INVITE_SUBJECT: 'Invitation to Apply',
    SEND_INVITE_MSG:
      "I've reviewed your Legably profile and I think you would be an excellent candidate for this job that I've posted on Legably - <JOB_LINK> \n\nPlease click the job link to review the job details. If you agree with my assessment and would like to be considered for the job please click the job's Apply Now button.",
    CANCEL_SUBSCRIPTION: 'We are sorry to see you go! Why are you leaving, and what could we do to improve your experience on Legably?'
  },
  MESSAGES: {
    DECLINED_BY_CANDIDATE:
      'You have decided not to proceed with your application.',
    DECLINED_BY_HIRING_MANAGER:
      'The hiring manager has decided not to proceed with your application.'
  },
  ROUTES_PATH: ROUTES_PATH,
  SEO_META_INFO: {
    TITLE: {
      [ROUTES_PATH['HOME']]:
        'Hire the Best Attorney | Find the Best Legal Job | Free to Post & Search | Legably',
      [ROUTES_PATH['SIGN_UP']]: 'Sign-Up | Legably',
      [ROUTES_PATH['SIGN_IN']]: 'Sign-In | Legably',
      [ROUTES_PATH['COMPANY_OVERVIEW']]:
        'Company Overview | About Us | Legably',
      [ROUTES_PATH['PRIVACY_POLICY']]: 'Privacy Policy | Legably',
      [ROUTES_PATH['TERMS_OF_SERVICE']]: 'Terms of Service | Legably',
      [ROUTES_PATH['FAQ']]: 'Frequently Asked Questions | Legably',
      [ROUTES_PATH['SUPPORT_CENTER']]: 'Support Center | Contact Us | Legably',
      [ROUTES_PATH['SEEKER_BASIC_INFO']]:
        'Attorney Profile | Basic Info | Legably',
      [ROUTES_PATH['SEEKER_EXEPERIENCE']]:
        'Attorney Profile | Experience | Legably',
      [ROUTES_PATH['SEEKER_HEADLINE']]: 'Attorney Profile | Headline | Legably',
      [ROUTES_PATH['SEEKER_JOB_TYPE']]: 'Attorney Profile | Job Type | Legably',
      [ROUTES_PATH['POSTER_BASIC_INFO']]:
        'Post a Job | Basic Information | Legably',
      [ROUTES_PATH['POSTER_THANK_YOU']]: 'Post a Job | Thank You | Legably'
    },
    DESC: {
      [ROUTES_PATH['HOME']]:
        'Legably is a modern online platform connecting attorneys seeking jobs with hiring attorneys and law firms in need of their services. Free to post legal jobs and search for work.',
      [ROUTES_PATH['SIGN_UP']]: 'Sign-up for Legably.',
      [ROUTES_PATH['SIGN_IN']]: 'Sign-in to legably.',
      [ROUTES_PATH['COMPANY_OVERVIEW']]: 'Learn more about Legably.',
      [ROUTES_PATH['PRIVACY_POLICY']]: 'Legably Privacy Policy.',
      [ROUTES_PATH['TERMS_OF_SERVICE']]: 'Legably Terms of Service.',
      [ROUTES_PATH['FAQ']]:
        'Frequently asked questions about the Legably online legal staffing platform.  ',
      [ROUTES_PATH['SUPPORT_CENTER']]:
        'Contact the Legably team with questions, suggestions, or for technical support.'
    }
  },
  ROLE: {
    POSTER: 'poster',
    SEEKER: 'seeker'
  },
  // 'HTTP_METHODS': {
  //   'GET': 'GET',
  //   'POST': 'POST',
  // },
  API_URLS: {
    SIGN_UP: {
      name: '/signup',
      type: 'post',
      tokenEnabled: false
    },
    SIGN_IN: {
      name: '/login',
      type: 'post',
      tokenEnabled: false
    },
    SIGN_OUT: {
      name: '/logout',
      type: 'post'
    },
    FORGOT_PASSWORD: {
      name: '/forgotPassword',
      type: 'post',
      tokenEnabled: false
    },
    CHECK_RESET_PASSWORD_LINK: {
      name: '/checkResetLink',
      type: 'post',
      tokenEnabled: false
    },
    RESET_PASSWORD: {
      name: '/resetPassword',
      type: 'post',
      tokenEnabled: false
    },
    CHANGE_PASSWORD: {
      name: '/changePassword',
      type: 'post'
    },
    CONTACT_US: {
      name: '/contactus',
      type: 'post',
      tokenEnabled: false
    },
    GET_ALL_LISTS: {
      name: '/getAllLists',
      type: 'get',
      tokenEnabled: false,
      cacheEnabled: true
    },
    SUBSCRIBED_PLAN: {
      name: '/getSubscribedPlan',
      type: 'get'
    },
    CREATE_SUBSCRIPTION: {
      name: '/createSubscription',
      type: 'post'
    },
    CREATE_CHECKOUT_SESSION: {
      name: '/createCheckoutSession',
      type: 'post'
    },
    CANCEL_SUBSCRIPTION: {
      name: '/cancelSubscription',
      type: 'post'
    },
    GET_SERVICE_CHARGE: {
      name: '/getServiceCharge',
      type: 'get',
      tokenEnabled: false
    },
    SET_USER_BASIC_PROFILE: {
      name: '/userBasicProfile',
      type: 'post'
    },
    SET_USER_EXPERIENCE_PROFILE: {
      name: '/userExperienceProfile',
      type: 'post'
    },
    SET_USER_NETWORK_PROFILE: {
      name: '/userNetworkProfile',
      type: 'post'
    },
    SET_USER_JOB_PROFILE: {
      name: '/userJobProfile',
      type: 'post'
    },
    SET_POSTER_BASIC_PROFILE: {
      name: '/posterBasicProfile',
      type: 'post'
    },
    CREATE_JOB: {
      name: '/postJob',
      type: 'post'
    },
    GET_USER_PROFILE: {
      name: '/getUserProfile',
      type: 'get'
    },
    EXPORT_USERS: {
      name: '/exportUsers',
      type: 'get'
    },
    EXPORT_POST_JOBS: {
      name: '/exportPostJobs',
      type: 'get'
    },
    GET_POSTED_JOBS: {
      name: '/getPostJobByUserId',
      type: 'get'
    },
    GET_INVITABLE_JOBS: {
      name: '/getInvitablePostJobs',
      type: 'get'
    },
    GET_APPLIED_JOBS: {
      name: '/getAppliedJobs',
      type: 'get'
    },
    GET_JOB_STATUS: {
      name: '/getJobStatus',
      type: 'get'
    },
    GET_JOB: {
      name: '/getPostJob',
      type: 'get',
    },
    GET_JOBS: {
      name: '/getPostJobs',
      type: 'post'
    },
    GET_JOB_DETAIL: {
      name: '/getPostJobDetails',
      type: 'get'
    },
    GET_STEP_DATA: {
      name: '/getStepData',
      type: 'post'
    },
    UPDATE_JOB_STATUS: {
      name: '/updateJobStatus',
      type: 'post'
    },
    UPDATE_SAVED_JOB: {
      name: '/updateSavedJob',
      type: 'post'
    },
    UPDATE_POSTED_JOB_STATUS: {
      name: '/updatePostedJobStatus',
      type: 'post'
    },
    UPDATE_N_TERMS: {
      name: '/updateNegotiateTerms',
      type: 'post'
    },
    SEND_MESSAGE: {
      name: '/sendMessage',
      type: 'post'
    },
    UPDATE_DELIVERABLE_STATUS: {
      name: '/updateDeliverableStatus',
      type: 'post'
    },
    UPDATE_HOURLY_FIXED_TERMS: {
      name: '/updateHourlyFixedTerms',
      type: 'post'
    },
    DOWNLOAD_DELIVERABLE_FILE: {
      name: '/downloadDeliverableFile',
      type: 'post'
    },
    RESEND_EMAIL: {
      name: '/resendEmail',
      type: 'get',
      tokenEnabled: false
    },
    VERIFY_EMAIL: {
      name: '/verifyEmail',
      type: 'get',
      tokenEnabled: false
    },
    ADD_PAYMENT: {
      name: '/addPayment',
      type: 'post'
    },
    SET_W_NINE_INFO: {
      name: '/setWNineInfo',
      type: 'post'
    },
    GET_RELEASE_FUND_URL: {
      name: '/getReleaseFundUrl',
      type: 'post'
    },
    SET_STRIPE_ACCOUNT_INFO: {
      name: '/setStripeAccountInfo',
      type: 'post'
    },
    TRANSFER_FUNDS: {
      name: '/transferFunds',
      type: 'post'
    },
    GET_STRIPE_DASHBOARD_LINK: {
      name: '/getStripeDashboardLink',
      type: 'post'
    },
    GET_CREATE_STRIPE_ACCOUNT_LINK: {
      name: '/getCreateStripeAccountLink',
      type: 'post'
    },
    RELEASE_FUND: {
      name: '/realeaseFund',
      type: 'post'
    },
    SAVE_RATING: {
      name: '/saveRating',
      type: 'post'
    },
    GET_CANDIDATES_DATA: {
      name: '/getCandidatesData',
      type: 'get'
    },
    CREATE_CHAT_ROOM: {
      name: '/createChatRoom',
      type: 'post'
    },
    GET_CHAT_ROOMS: {
      name: '/getChatRooms',
      type: 'post'
    },
    GET_MESSAGES: {
      name: '/getMessages',
      type: 'get',
    },
    CREATE_MESSAGE: {
      name: '/createMessage',
      type: 'post'
    },
    GET_MESSAGES_BY_ID: {
      name: '/getMessages',
      type: 'get',
    },
    DELETE_MESSAGES: {
      name: 'deleteMessage',
      type: 'get',
    }
  },
  HTTP_STATUS_CODES: {
    SUCCESS: 200,
    IM_USED: 226,
    FAIL: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    INVALID_BAR_ID: 417,
    UNPROCESSABLE: 422,
    LOCKED: 423,
    FAILED_DEPENDENCY: 424,
    PRECONDITION_REQUIRED: 428
  },
  JOB_STEPS: {
    APPLY: 100,
    APPLIED: 101,
    INTERVIEWING: 102,
    N_TERMS: 103,
    S_PENDING: 104,
    IN_PROGRESS: 105,
    J_COMPLETE: 106
  },
  STEP_WORDS: {
    101: 'Applied For Job',
    102: 'Interviewing Candidates',
    103: 'Negatiate Job terms',
    104: 'Start Job',
    105: 'Job in Progress',
    106: 'Job Complete'
  },
  N_TERMS_STATUS: {
    NOT_SENT: 0,
    SENT: 1,
    ACCEPTED: 2,
    DECLINED_BY_POSTER_BEFORE_SENT: -10,
    DECLINED_BY_POSTER_AFTER_SENT: -11,
    DECLINED_BY_SEEKER_BEFORE_ACCEPTED: -20,
    DECLINED_BY_SEEKER_AFTER_ACCEPTED: -21
  },
  DELIVERABLE_STATUS: {
    PENDING: 0,
    SUBMITTED: 1,
    APPROVED: 2,
    RELEASED: 3,
    PAID: 4,
    DECLINED: -1
  },
  POPUP_TYPES: {
    INFO: 'info_popup',
    CONFIRM: 'confirm_popup',
    VIEW_FILE: 'view_file_popup',
    SEND_MSG: 'send_msg_popup',
    SUBMIT_DELIVERABLE: 'submit_deliverable_popup',
    RELEASE_PAYMENT: 'release_payment_popup',
    PROMO_CODE: 'promo_code_popup',
    TRANSFER_FUNDS: 'transfer_funds_popup'
  },
  STATUS: {
    ACTIVE: 1,
    INACTIVE: 0,
    SOFT_DELETED: -1,
    DELETED: -2
  },
  STRIPE_ACCOUNT_STATUS: {
    NOT_CREATED: 0,
    CREATED: 1,
    ACTIVATED: 2
  },
  PAYMENT_STATUS: {
    FUND_TRANSFER_REQUEST_NOT_SENT: 0,
    FUND_TRANSFER_REQUEST_SENT: 1,
    FUND_TRANSFER_SUCCESSFUL: 2,
    CANCELLED: -1
  },
  IMG_PATH: '/images/',
  NO_DATA_SYMBOL: '-',
  SUPPORT_ID: SUPPORT_ID,
  MAX_UPLOAD_FILE_SIZE: 5000000,
  DATE_FORMAT: 'MM/DD/YYYY',
  JOB_DATE_FORMAT: 'MMM DD, YYYY',
  STRIPE_KEY: "pk_test_swti9d8WagPHyfv0lb7qdCzF",
  PLANS: [
    'price_1HVCnXFbAQZVGJj6HTntMaiY', 
    'price_1HVCpmFbAQZVGJj6x4oLXrcl', 
    'price_1HVCqAFbAQZVGJj68mUDHyzK'
  ]
};
