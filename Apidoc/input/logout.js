/**
 * @api {post} /logout Logout
 * @apiName logout
 * @apiGroup Authentication
 *
 * @apiDescription Logout
 *
 * @apiHeader {String} TOKEN      * A token send by header as TOKEN
 *
 * @apiSuccess {Number} Code 200.
 * @apiSuccess {String} Status True.
 * @apiSuccess {String} Message You have successfully logout.
 
 *
 * @apiSuccessExample Success-Response-Example:
 *  HTTP/1.1 success
{
    "Code": 200,
    "Status": true,
    "Message": "You have successfully logout"
}
 *
 
 * @apiError {Object} Error-Response Returns a json Object.
 * @apiError (Error-Response Object){Boolean} status Status.
 * @apiError (Error-Response Object){String} message Message.
 * @apiErrorExample Sample Error-Response:
 *   
 *  {
 	"Code": 400,
 "Status": false,
 "Message": "Oops!! Something went wrong"
 }

 */