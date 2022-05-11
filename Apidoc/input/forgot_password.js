/**
* @api {post} /forgotPassword Forgot Password
* @apiVersion 0.0.1
* @apiName forgotPassword
* @apiGroup Authentication
* @apiPermission None
*
* @apiDescription sent reset password link, if legably user forgot password.
*
* @apiParam {String} email    * Registered email is required in body.
*
*
* @apiSuccess {Number} Code 200.
 * @apiSuccess {Boolean} status true.
 * @apiSuccess {String} message The request is OK.
*
* @apiExample Example usage:
*
*{
*    "email" : "test@yopmail.com"
*}
*

* @apiSuccessExample Success-Response-Example:
*     HTTP/1.1 success
*{
*  "Code": 200,
*  "Status": true,
*  "Message": "Mail sent successfully"
*}
*
 * @apiError {Object} Error-Response Returns a json Object.
 * @apiError (Error-Response Object){Number} Code 400.
 * @apiError (Error-Response Object){Boolean} status Status.
 * @apiError (Error-Response Object){String} message Message.
 * @apiErrorExample Sample Error-Response:

 *   
 *  {
        "Code": 401,
	"Status": false,
	"Message": "Email does not exist"
    }
 */

