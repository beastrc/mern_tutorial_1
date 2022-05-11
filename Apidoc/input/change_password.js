/**
* @api {post} /changePassword Change Password
* @apiVersion 0.0.1
* @apiName changePassword
* @apiGroup Authentication
* @apiPermission User
*
* @apiDescription User can change password
* 
* @apiHeader {String} token      * A token send by header as token

* @apiParam {String} old_password     * Old password required in body.
* @apiParam {String} password         * New password required in body.
* @apiParam {String} confirm_password * Confirm password required in body.

*
* @apiSuccess {Number} Code 200.
* @apiSuccess {Boolean} status true.
* @apiSuccess {String} message The request is OK.

* @apiExample Example usage:
*
*{
*	"old_password":"Qwer@123",
*	"password": "Qwer@12345",
*	"confirm_password": "Qwer@12345"
*}
*
* @apiSuccessExample Success-Response-Example:
*     HTTP/1.1 success 
{
    "Code": 200,
    "Status": true,
    "Message": "You have successfully reset your password"
}
 *
*
* @apiError {Object} Error-Response Returns a json Object.
* @apiError (Error-Response Object){Boolean} status false.
* @apiError (Error-Response Object){String} message Message.
* @apiErrorExample Sample Error-Response:

*   
{
    "Code": 400,
    "Status": false,
    "Message": "Password does not match the confirm password"
}
*/

