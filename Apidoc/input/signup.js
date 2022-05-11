/**
* @api {post} /signup User Signup
* @apiVersion 0.0.1
* @apiName userSignUp
* @apiGroup Authentication
* @apiPermission None
*
* @apiDescription Signup user with Legably system.
* 
* @apiParam {String} first_name             * First Name.
* @apiParam {String} last_name    	    * Last Name.
* @apiParam {String} email		    * Email Address of the user (Must be unique).
* @apiParam {String} password               * Password.
* @apiParam {String} confirm_password       * Confirm Password.
*
*
* @apiSuccess {Number} Code 200.
* @apiSuccess {Boolean} Status true.
* @apiSuccess {String} Message You have successfully sign up.
*
* @apiExample Example usage:
*
*{
*   "first_name": "test",
*   "last_name": "one",
*   "email": "test@kiwitech.com",
*   "password": "Qwer@123",
*   "confirm_password": "Qwer@123"
*}
*
* 
* @apiSuccessExample Success-Response-Example:
*     HTTP/1.1 success
{
  "Code": 200,
  "Status": true,
  "Message": "You have successfully sign up"
}
*
*
 * @apiError {Object} Error-Response Returns a json Object.
 * @apiError (Error-Response Object){Number} Code 400.
 * @apiError (Error-Response Object){Boolean} Status false.
 * @apiError (Error-Response Object){String} Message error message.
 * @apiErrorExample Sample Error-Response:

 *   
 *  {
        "Code": 400,
	"Status": false,
	"Message": "Invalid Parameters"
    }
    
 */



