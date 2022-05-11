/**
* @api {post} /posterBasicProfile Poster Basic profile
* @apiVersion 0.0.1
* @apiName posterBasicProfile
* @apiGroup Authentication
* @apiPermission User
*
* @apiDescription Basic profile of poster created with Legably system.

* @apiHeader {String} TOKEN      * A token send by header as TOKEN
*
* @apiParam {Object}  job_posters_info            * Job Poster Details
* @apiParam {Object}  job_posters_info.basic_profile            * Job seeker basic profile details
* @apiParam {String}  job_posters_info.basic_profile.basic_info            * Job seeker basic details
* @apiParam {String} job_posters_info.basic_profile.basic_info.first_name             * First Name.
* @apiParam {String} job_posters_info.basic_profile.basic_info.last_name    	    * Last Name.
* @apiParam {String} job_posters_info.basic_profile.basic_info.street_address		    * Street address.
* @apiParam {String} job_posters_info.basic_profile.basic_info.city       * City.
* @apiParam {String} job_posters_info.basic_profile.basic_info.state_id                                   * State ID for user profile Details.
* @apiParam {Number} job_posters_info.basic_profile.basic_info.zipcode                                        * Zip code of the user
* @apiParam {Number} job_posters_info.basic_profile.basic_info.phone_number                                 * Phone number of the user.
* @apiParam {String}  job_posters_info.basic_profile.firm_name            * Firm Name
* @apiParam {String} job_posters_info.basic_profile.title   * Title.
* @apiParam {Array}  job_posters_info.basic_profile.practice_location_id                           		* Practice locations
* @apiParam {Array} job_posters_info.basic_profile.practice_area_id                                   * Practice area
* @apiParam {String} job_posters_info.basic_profile.intrested_in_id         * Interesting in hiring
* @apiParam {String} job_posters_info.basic_profile.website_url * Website path
* @apiParam {Array}  job_posters_info.basic_profile.bar_admission                           		* Bar admission detail.
* @apiParam {String} job_posters_info.basic_profile.bar_admission.bar_state_id                           		* Bar state ID.
* @apiParam {Number} job_posters_info.basic_profile.bar_admission.bar_registration_number                   * bar registration number.
*
*
* @apiSuccess {Number} Code 200.
* @apiSuccess {Boolean} Status true.
* @apiSuccess {String} Message You have successfully updated your profile.
*
* @apiExample Example usage:
*
*{
	"first_name": "Ashutosh",
	 "last_name": "Agrawal",
	 "job_posters_info":{
	 	"basic_profile":{
			"basic_info":{
				"street_address": "A-66",
				 "city": "Noida",
				 "state_id": "59db6a78ff17ca45b1f2e336",
				 "zipcode": "02221",
				 "phone_number": "d39116985222"

		  	 },
		  	 "firm_name" : "kiwitech",
			 "title":"kiwitech",
			 "practice_location_id" : ["59db6a78ff17ca45b1f2e336"],
			 "practice_area_id" : ["599fd7aac62430971a4e0d07"],
			 "intrested_in_id" : ["599fd7aac62430971a4e0d07"],
			 "website_url": "http://www.google.com"
		 }

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



