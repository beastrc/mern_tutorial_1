/**
* @api {post} /login User Signin
* @apiVersion 0.0.1
* @apiName login
* @apiGroup Authentication
* @apiPermission None
*
* @apiDescription Signin with Legably system to authenticate.
* 
* @apiParam {String} email           * Registered email requried in body
* @apiParam {String} password        * Password is required in body.

*
*
* @apiSuccess {Number} Code 200.
* @apiSuccess {Boolean} status true.
* @apiSuccess {String} message The request is OK.
*
* @apiExample Example usage:
*
*{
*   "email": "test@yopmail.com",
*   "password" : "YourP@ssword"
*}
*
*
* 
* @apiSuccessExample {json} Success-Response: 
*        HTTP/1.1 success
*{
*  "Code": 200,
*  "Status": true,
*  "Message": "You have successfully logged in"
*  "Data": {
*	"token":  "b6d54d94-4299-0e56-67e9-fccd69562466"
*   }
*}

*
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
	"Message": "Invalid User Credentials"
    }
*/


