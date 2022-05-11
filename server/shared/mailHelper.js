var rfr = require('rfr');

var constant = rfr('/server/shared/constant'),
  config = rfr('/server/shared/config'),
  utils = rfr('/server/shared/utils');

const _getMailTmplHeader = () => {
  return `<tr style='border: 0; border-collapse: collapse; background-color: #013759; height: 60px;'>
    <td style='text-align: center; margin: 0; padding: 20px; color: #fff;'>
      <img style='width: 150px;' src='${config.hostPath}/images/logo-white@2x.png' alt='logo' />
    </td>
  </tr>`;
};

const _getMailTmplSignature = () => {
  return `<p style='line-height: 18px;'>
    <b>The Legably Support Team</b>
    <br />
    <a style='color: #013759;' href='mailto:${constant['MAIL_OBJ']['SUPPORT_ID']}'>support@legably.com</a>
    <br />
    <a style='color: #013759;' href='${config.hostPath}'>www.legably.com</a>
  </p>`;
};

const _getMailTmplFooter = () => {
  return `<tr>
    <td align='center' style='border-bottom: 1px solid #979797; width: 100%;opacity: 0.15;'></td>
  </tr>
  <tr>
    <td>
      <p style='margin-bottom: 0; font-family: Arial;font-size: 14px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.86;letter-spacing: normal;color: #6c6c6c;'>For general inquries or to request support with your account, please email
        <br />
        <a style='color: #013759;' href='mailto:${constant['MAIL_OBJ']['SUPPORT_ID']}'>support@legably.com</a>
      </p>
    </td>
  </tr>`;
};

const _getMailContent = (key, dataObj) => {
  let content = null;
  let type = constant['MAIL_OBJ']['MAIL_TYPE'][key];
  switch (type) {
    case 1:
      content = _getContactUsMailContentForSupport(dataObj);
      break;
    case 2:
      content = _getContactUsMailContentForUser(dataObj);
      break;
    case 3:
      content = _getUserEmailVerificationMailContent(dataObj);
      break;
    case 4:
      content = _getForgotPasswordMailContent(dataObj);
      break;
    case 5:
      content = _getSendMsgMailContent(dataObj);
      break;
    case 6:
      content = _getJobPostedMailContent(dataObj);
      break;
    case 7:
      content = _getJobAppliedMailContent(dataObj);
      break;
    case 8:
      content = _getAcceptedJobTermsMailContentForPoster(dataObj);
      break;
    case 9:
      content = _getAcceptedJobTermsMailContentForSeeker(dataObj);
      break;
    case 10:
      content = _getPaymantTransferedInEscrowMailContentForPoster(dataObj);
      break;
    case 11:
      content = _getPaymantTransferedInEscrowMailContentForSeeker(dataObj);
      break;
    case 12:
      content = _getMilestoneUploadedMailContent(dataObj);
      break;
    case 13:
      content = _getMilestoneRejectedMailContent(dataObj);
      break;
    case 14:
      content = _getMilestoneApprovedMailContent(dataObj);
      break;
    case 15:
      content = _getPaymantReleasedFromEscrowMailContentForPoster(dataObj);
      break;
    case 16:
      content = _getPaymantReleasedFromEscrowMailContentForSeeker(dataObj);
      break;
    case 17:
      content = _getJobCompletedMailContent(dataObj);
      break;
    case 18:
      content = _getCandidateAppliedToJobMailContent(dataObj);
      break;
  }
  return content;
};

const _getContactUsMailContentForSupport = dataObj => {
  return `<p><b>Name: </b>${dataObj.firstName} ${dataObj.lastName},</p>
  <p><b>Subject: </b>${dataObj.subject}</p>
  <p><b>Email: </b>${dataObj.email}</p>
  <p style='margin-bottom: 0; white-space: pre-wrap;'><b>Message: </b>${dataObj.message}</p>`;
};

const _getContactUsMailContentForUser = dataObj => {
  return `<p>Hi ${dataObj.firstName} ${dataObj.lastName},</p>
  <p>Thanks! We’re working on your request, and will get back to you as soon as possible.</p>`;
};

const _getUserEmailVerificationMailContent = dataObj => {
  return `<p>Hi ${dataObj.firstName} ${dataObj.lastName},</p>
  <p style='margin-bottom: 0px;'>Thank you for creating your Legably account. Please verify your email address by clicking the button below so you can get started creating your Legably profile.</p>
  <p style="padding:0; margin: 20px 40px;height: 38px;line-height: 38px;">
  <a style='color: #ffffff; background-color: #3270b2; font-size: 15px; text-decoration: none; padding: 10px 35px;' href='${config.hostPath}/verify-email/${dataObj.guid}' target='_blank'>Verify Email</a>
  </p>
  <p style='margin-top: 0px;'>If you didn't create this account, have any questions about using Legably, or have suggestions for improving our platform, please don't hesitate to reach out to us at
    <a style='color: #013759;' href='mailto:${constant['MAIL_OBJ']['SUPPORT_ID']}'>support@legably.com</a>.
  </p>`;
};

const _getForgotPasswordMailContent = dataObj => {
  return `<p>Dear ${dataObj.firstName} ${dataObj.lastName},</p>
  <p>This e-mail is in response to your recent request to recover a forgotten password. Password security features are in place to ensure the security of your profile information. To reset your password, please click the link below and follow the instructions provided.</p>
  <p>
    <a href='${config.hostPath}/reset-password/${dataObj.forgotPassToken}' target='_blank'>${config.hostPath}/reset-password/${dataObj.forgotPassToken}</a>
  </p>
  <p>This link will remain active for the next 3 hours.</p>
  <p>Please do not reply to this e-mail.</p>`;
};

const _getSendMsgMailContent = dataObj => {
  // <h6 style='font-family: Arial; font-size: 16px; line-height: 1.5; color: #333333; margin: 0; display: none;'>Hi,</h6>
  let senderName = 'hiring manager';
  let newSenderName = `the ${senderName}`;
  if (dataObj.role === constant['ROLE']['SEEKER']) {
    senderName = `${dataObj.senderFirstName} ${dataObj.senderLastName}`;
    newSenderName = `<b>${senderName}</b>`;
  }
  return `<p>${dataObj.receiverFirstName},</p>
  <p>Below is a message from ${newSenderName} for the <b>${
    dataObj.jobName
  }</b> job. You can reply directly to them by viewing the job details on the Legably site and clicking the Send Message button.</p>
  <p>Please do not send your reply to ${
    dataObj.role === constant['ROLE']['SEEKER'] ? senderName : newSenderName
  } by simply replying to this email message. Your reply will not be received if it is sent this way.</p>
  <div style="background-color: #073759;padding: 0 15px 15px;color: #fff;">
    <span>Message From ${utils.toTitleCase(senderName)}</span>
    <div style='background-color: #fff; font-family: Arial; font-size: 14px; line-height: 1.71; color: #000000; padding: 15px; white-space: pre-wrap;'>${
      dataObj.msg
    }</div>
  </div>`;
};

const _getJobPostedMailContent = dataObj => {
  return `<p><p> Hi ${dataObj.posterName},</p>
    <p>This email is being sent to let you know that your job <b>${dataObj.jobName}</b>, has been posted successfully.</p>`;
};

const _getJobAppliedMailContent = dataObj => {
  return `<p> Hi ${dataObj.seekerName},</p>
    <p>This email is being sent to let you know that your application to the job <b>${dataObj.jobName}</b> has been successful.</p>`;
};

const _getAcceptedJobTermsMailContentForPoster = dataObj => {
  return `<p>Hi ${dataObj.posterName},</p>
    <p>This email is being sent to let you know that ${dataObj.seekerName} has accepted the proposed terms for the job <b>${dataObj.jobName}</b>.</p>`;
};

const _getAcceptedJobTermsMailContentForSeeker = dataObj => {
  return `<p> Hi ${dataObj.seekerName},</p>
    <p>This email is being sent to let you know that you have accepted the proposed terms for the job <b>${dataObj.jobName}</b>.</p>`;
};

const _getPaymantTransferedInEscrowMailContentForPoster = dataObj => {
  return `<p> Hi ${dataObj.recieverFirstName},</p>
    <p>This email is being sent to let you know that processing for the transfer of the job payment for <b>${dataObj.jobName}</b> has started and should be completed within 24-48 hours.</p>`;
};

const _getPaymantTransferedInEscrowMailContentForSeeker = dataObj => {
  return `<p> Hi ${dataObj.recieverFirstName},</p>
  <p>This email is being sent to let you know that processing of the job payment for <b>${dataObj.jobName}</b> has started and should be completed within 24-48 hours. Please check the Legably site after that time has elapsed to see if you can start work on this job.</p>`;
};

const _getMilestoneUploadedMailContent = dataObj => {
  return `<p> Hi ${dataObj.recieverFirstName},</p>
    <p>This email is being sent to let you know that a milestone deliverable for <b>${dataObj.jobName}</b> has been uploaded and requires your review.</p>`;
};

const _getMilestoneRejectedMailContent = dataObj => {
  return `<p> Hi ${dataObj.recieverFirstName},</p>
    <p>This email is being sent to let you know that the deliverable for <b>${dataObj.jobName}</b> milestone has been rejected.</p>`;
};

const _getMilestoneApprovedMailContent = dataObj => {
  return `<p> Hi ${dataObj.recieverFirstName},</p>
    <p>This email is being sent to let you know that a milestone deliverable for <b>${dataObj.jobName}</b> has been accepted.</p>`;
};

const _getPaymantReleasedFromEscrowMailContentForPoster = dataObj => {
  return `<p> Hi ${dataObj.recieverFirstName},</p>
    <p>This email is being sent to let you know that a milestone payment for <b>${dataObj.jobName}</b> has been approved and released from escrow.</p>`;
};

const _getPaymantReleasedFromEscrowMailContentForSeeker = dataObj => {
  return `<p> Hi ${dataObj.recieverFirstName},</p>
    <p>This email is being sent to let you know that a milestone payment for <b>${dataObj.jobName}</b> has been released from escrow and transferred to your account. You should see the funds within 24 hours.</p>`;
};

const _getJobCompletedMailContent = dataObj => {
  return `<p> Hi ${dataObj.recieverFirstName},</p>
    <p>This email is being sent to let you know that <b>${dataObj.jobName}</b> has been completed.</p>`;
};

const _getCandidateAppliedToJobMailContent = dataObj => {
  return `<p> Hi ${dataObj.posterName},</p>
    <p>This email is being sent to you to let you know that <b>${dataObj.seekerName}</b> has applied for the job <b>${dataObj.jobName}</b>.</p>`;
};

const getInviteMsgWithLink = (message, jobId, jobName) => {
  const convertedMessage = message.replace(
    '<JOB_LINK>',
    `<a href=${config.hostPath}/job-search/${jobId}>${jobName}</a>`
  );
  return convertedMessage;
};

const getMailTmpl = (mailTypeKey, dataObj, options = {}) => {
  return `<body bgcolor='#f2f2f2' style='font-family: arial; font-size: 13px; color:#000;'>
    <div style='width: 100%'>
      <table width='100%' cellspacing='0' cellpadding='0' border='0' align='center' style='background-color: #fff; max-width: 600px;'>
        <tbody>
          ${_getMailTmplHeader()}
          <tr>
            <td style='background: #fff; border: 1px solid #e3e3e3; padding: 15px;'>
              <table width='100%;' style='font-size: 14px;'>
                <tbody>
                  <tr>
                    <td style='line-height: 23px;'>
                      <div style='color: #4d4d4d;'>
                        ${_getMailContent(mailTypeKey, dataObj)}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      ${
                        options['hideSignature'] === true
                          ? ''
                          : _getMailTmplSignature()
                      }
                    </td>
                  </tr>
                  ${options['showFooter'] === true ? _getMailTmplFooter() : ''}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>`;
};

const sendMailInBackground = (to, subject, mailTypeKey, mailObj, cb) => {
  utils.writeInsideFunctionLog('mailHelper', 'sendMailInBackground', {
    to: to,
    mailTypeKey: mailTypeKey
  });

  let mailOpt = config.mailOptions;
  mailOpt.to = to; // For dynamic list of recievers
  mailOpt.subject = `${subject} | ${constant['MAIL_OBJ']['SUBJECT_FRAGMENT']}`;
  mailOpt.html = getMailTmpl(mailTypeKey, mailObj);
  config.transporter.sendMail(mailOpt, (error, info) => {
    if (error) {
      utils.log(`${mailTypeKey} Send Mail Error -->`, error);
      utils.writeErrorLog(
        'mailHelper',
        'sendMailInBackground',
        `Error while sending email for ${mailTypeKey}`,
        error,
        { email: to }
      );
    }
    typeof cb === 'function' && cb(error, info);
  });
};

module.exports = {
  getMailTmpl,
  getInviteMsgWithLink,
  sendMailInBackground
};
