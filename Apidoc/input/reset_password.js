/**
* @api {post} /resetPassword/:secretId   Reset Password
* @apiVersion 0.0.1
* @apiName resetPassword
* @apiGroup Authentication
* @apiPermission None
*
* @apiDescription Reset your password by forgot password link sent on your registerd email.
* 
* @apiParam {String} password        		* Password field is required in body
* @apiParam {String} confirm_password 		* Confirm password field is required in body
*
*
* @apiSuccess {Number} Code 200.
* @apiSuccess {Boolean} status true
* @apiSuccess {String} message The request is OK.
*
* @apiExample Example usage:
*
*{
*	"password": "Qwer@123",
*	"confirm_password": "Qwer@123"
*}
*
*
* 
* @apiSuccessExample {json} Success-Response: 
*        HTTP/1.1 success
{
    "Code": 200,
    "Status": true,
    "Message": "You have successfully reset your password"
}
*
* @apiError {Object} Error-Response Returns a json Object.
* @apiError (Error-Response Object){Boolean} status Status.
* @apiError (Error-Response Object){String} message Message.
* @apiErrorExample Sample Error-Response:

*   
{
    "Code": 401,
    "Status": false,
    "Message": "The link has been expired"
}
*/

