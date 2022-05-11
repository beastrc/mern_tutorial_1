/**
* @api {post} /userNetworkProfile User Network profile 
* @apiVersion 0.0.1
* @apiName userNetworkProfile
* @apiGroup Authentication
* @apiPermission User
*
* @apiDescription Network profile of user created with Legably system.

* @apiHeader {String} TOKEN      * A token send by header as TOKEN
* 

* @apiParam {Object}  network            * Network Details
* @apiParam {String}  network.lawyer_headline            * lawyer headline
* @apiParam {String} network.about_lawyer   * About lawyer.
* @apiParam {String} network.linkdin_link         * linkedin link.
* @apiParam {String} network.clio_link * Clio Link
*
*
* @apiSuccess {Number} Code 200.
* @apiSuccess {Boolean} Status true.
* @apiSuccess {String} Message You have successfully updated your profile.
*
* @apiExample Example usage:
*
*{
 
	 "network": {
  "lawyer_headline": "Law Headline..... Bla Bla",
  "about_lawyer": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged",
  "linkedin_link": "https://www.linkedin.com/ashutosha/",
  "clio_link": "https://www.clio.com/ashutosha/"
 }

}
*
* 
* @apiSuccessExample Success-Response-Example:
*     HTTP/1.1 success
{
  "Code": 200,
  "Status": true,
  "Message": "You have successfully updated your profile."
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



