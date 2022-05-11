var rfr = require('rfr'),
constant = rfr('/server/shared/constant');

const _isFloat = (num) => {
  return (!isNaN(num) && num % 1 !== 0);
}

/** Method for validate email address **/
const emailValidation = (email) => {
  //regex for a valid email
  const EMAIL_REGEXP = /^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/;
  return (!!email && EMAIL_REGEXP.test(email.trim()));
}

/** Method for validate password **/
const passwordValidation = (password) => {
  const PASSWORD_REGEXP = /^(?=.{8,})(?=.*[a-zA-Z0-9!@#$%^&*()]).*$/;
  if(!!password && PASSWORD_REGEXP.test(password)){
    var count = 1, counter = 1;
    for (var i = 0; i < password.length; i++) {
      if (password[i] == password[i+1]) {
        count++;
      } else {
        if (Math.abs(password.charCodeAt(i+1) - password.charCodeAt(i)) === 1) {
          counter++;
        } else {
          return true;
        }
      }

      if(count == password.length || counter == password.length){
        return false;
      }
    }
  }else{
    return false;
  }
}

/** Method for check text string only having alphabets and - **/
const alphaWithDashOnly = (text) => {
  //regex for a alphabets only
  const ALPHA_REGEXP = /^[a-zA-Z -]+$/;
  return (!!text && ALPHA_REGEXP.test(text));
}

/** Method for check text string only having alphabets **/
const alphaOnly = (text) => {
  //regex for a alphabets only
  const ALPHA_REGEXP = /^[a-zA-Z ]+$/;
  return (!!text && ALPHA_REGEXP.test(text));
}

/** Method for check text string have a valid website url **/
const websiteValidation = (text) => {
  //regex for a valid url
  const URL_REGEXP = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  return (!!text && URL_REGEXP.test(text));
}

/** Method for validate linkedin link **/
export const linkedinLinkValidation = (link, mandate) => {
  link = !!link && link.toLowerCase();
  return mandate ? (!!link && link.indexOf('linkedin') >= 0) : (!link || link.indexOf('linkedin') >= 0);
}

/** Method for maximun text limit **/
const maxLength = (text, length, mandate) => {
  text = !!text && text.toString();
  if(_isFloat(text)) {
    text = text.replace(/^0+/, '');
  }
  return mandate ? (!!text && text.length <= length) : (!text || text.length <= length);
}

/** Method for minimum text limit **/
const minLength = (text, length, mandate) => {
  text = !!text && text.toString();
  if(_isFloat(text)) {
    text = text.replace(/^0+/, '');
  }
  return mandate ? (!!text && text.length >= length) : (!text || text.length >= length);
}

const missingParameters = (reqBody, requiredParameters) => {
  var validateObj = {
    isValid: true
  }

  for (var i = 0; i < requiredParameters.length; i++) {
    var param = requiredParameters[i];
    if (!reqBody[param]) {
      validateObj['isValid'] = false;
      validateObj['message'] = constant['EMPTY_FIELD_ERROR'];
      break;
    }
  }
  return validateObj;
}

const returnFileExtAndSize = (fileObj) => {
  var dataExp = fileObj['dataUrl'].split(';');
  var ext = dataExp[0].split('/');
  var encodeData = dataExp[1].split(',');
  var name = fileObj.name.split('.');
  return {
    'ext': ext.length > 1 ? ext[ext.length - 1] : name[name.length - 1],
    'size': fileObj.size,
    'encodedData': encodeData[encodeData.length - 1]
  }
}

const validateFile = (from, fileObject) => {
  let fileObj = returnFileExtAndSize(fileObject);
  let validFormats = ['pdf', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'msword'];
  if (from === 'photo') {
    validFormats = ['jpg', 'jpeg', 'png'];
  } else if (from === 'deliverables' || from === 'attachments') {
    !fileObj['ext'] && (fileObj['ext'] = fileObject['type']);
    validFormats = [ 'msword',
      'vnd.openxmlformats-officedocument.wordprocessingml.document',
      'vnd.openxmlformats-officedocument.wordprocessingml.template',
      'vnd.ms-word.document.macroEnabled.12',
      'vnd.ms-word.template.macroEnabled.12',
      'vnd.ms-powerpoint',
      'vnd.openxmlformats-officedocument.presentationml.presentation',
      'vnd.openxmlformats-officedocument.presentationml.template',
      'vnd.openxmlformats-officedocument.presentationml.slideshow',
      'vnd.ms-powerpoint.addin.macroEnabled.12',
      'vnd.ms-powerpoint.presentation.macroEnabled.12',
      'vnd.ms-powerpoint.template.macroEnabled.12',
      'vnd.ms-powerpoint.slideshow.macroEnabled.12',
      'vnd.ms-excel',
      'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'vnd.openxmlformats-officedocument.spreadsheetml.template',
      'vnd.ms-excel.sheet.macroEnabled.12',
      'vnd.ms-excel.template.macroEnabled.12',
      'vnd.ms-excel.addin.macroEnabled.12',
      'vnd.ms-excel.sheet.binary.macroEnabled.12', 'x-zip-compressed',
      'pdf', 'ppt', 'zip', 'xlsx', 'xls','doc','docx','zip','octet-stream','pptx' ];
  }

  let rtrnObj = {
    isValidFile: false,
    file: null,
    msg: constant['INVALID_FILE_FORMAT']
  }
  if (validFormats.indexOf(fileObj['ext']) !== -1) {
    if ((from === 'resume' && fileObj['size'] <= constant['MAX_UPLOAD_RESUME_SIZE']) || (from === 'photo' && fileObj['size'] <= constant['MAX_UPLOAD_PHOTO_SIZE']) || ((from === 'deliverables' || from === 'attachments') && fileObj['size'] <= constant['MAX_UPLOAD_FILE_SIZE'])) {
      rtrnObj['isValidFile'] = true;
      rtrnObj['file'] = fileObj;
      rtrnObj['msg'] = '';
    } else {
      rtrnObj['msg'] = constant['FILE_SIZE_ERROR'];
    }
  }
  return rtrnObj;
}

module.exports = {
  emailValidation: emailValidation,
  passwordValidation: passwordValidation,
  alphaWithDashOnly: alphaWithDashOnly,
  alphaOnly: alphaOnly,
  websiteValidation: websiteValidation,
  linkedinLinkValidation: linkedinLinkValidation,
  maxLength: maxLength,
  minLength: minLength,
  missingParameters: missingParameters,
  returnFileExtAndSize: returnFileExtAndSize,
  validateFile: validateFile,
}
