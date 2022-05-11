/**
* @api {post} /userBasicProfile User Basic profile 
* @apiVersion 0.0.1
* @apiName userBasicProfile
* @apiGroup Authentication
* @apiPermission User
*
* @apiDescription Basic profile of user created with Legably system.

* @apiHeader {String} TOKEN      * A token send by header as TOKEN
* 
* @apiParam {Object}  job_seeker_info            * Job Seeker Details
* @apiParam {Object}  job_seeker_info.basic_profile            * Job seeker basic profile details
* @apiParam {Object}  job_seeker_info.basic_profile.basic_info            * Job seeker basic details
* @apiParam {String} job_seeker_info.basic_profile.basic_info.first_name             * First Name.
* @apiParam {String} job_seeker_info.basic_profile.basic_info.last_name    	    * Last Name.
* @apiParam {String} job_seeker_info.basic_profile.basic_info.street_address		    * Street address.
* @apiParam {String} job_seeker_info.basic_profile.basic_info.city       * City.
* @apiParam {String} job_seeker_info.basic_profile.basic_info.state_id                                   * State ID for user profile Details.
* @apiParam {Number} job_seeker_info.basic_profile.basic_info.zipcode                                        * Zip code of the user
* @apiParam {Number} job_seeker_info.basic_profile.basic_info.phone_number                                 * Phone number of the user.
* @apiParam {Array}  job_seeker_info.basic_profile.education            * Education Details
* @apiParam {String}  job_seeker_info.basic_profile.education.school            * School
* @apiParam {String} job_seeker_info.basic_profile.education.degree_id   * Degree ID.
* @apiParam {String} job_seeker_info.basic_profile.education.year         * Year.
* @apiParam {String} job_seeker_info.basic_profile.education.education_additional_information * Additional information.
* @apiParam {Array}  job_seeker_info.basic_profile.bar_admission                           		* Bar admission detail.
* @apiParam {String} job_seeker_info.basic_profile.bar_admission.bar_state_id                           		* Bar state ID.
* @apiParam {Number} job_seeker_info.basic_profile.bar_admission.bar_registration_number                   * bar registration number.
* @apiParam {Array} job_seeker_info.basic_profile.practice_area_id                                   * Practice area
* @apiParam {String} job_seeker_info.basic_profile.do_you_have_malpractice_insurance                                   * Malpractice insurance.

*
*
* @apiSuccess {Number} Code 200.
* @apiSuccess {Boolean} Status true.
* @apiSuccess {String} Message You have successfully updated your profile.
*
* @apiExample Example usage:
*
*{
	"first_name": "Ashutoshh",
	"last_name": "Agrawal",
	"job_seeker_info":{
	"basic_profile":{
		"basic_info":{
			"street_address": "A-66",
			"city": "Noida",
			"state_id": "59db6a78ff17ca45b1f2e336",
			"zipcode": "02021",
			"phone_number": "234-234-2424"
		},
		 "education": [
		  {
		   "school": "Boys Highs School",
		   "degree_id": "59db6a8aff17ca45b1f2e337",
		   "year": "2000",
		   "education_additional_information": "Gold Medilist"
		  }
		 ],
		 "bar_admission": [
		  {
		   "bar_state_id": "599f0d07",
		   "bar_registration_number": 1234567890
		  },
		  {
		   "bar_state_id": "59db6a8aff17ca45b1f2e337",
		   "bar_registration_number": 1234567890
		  }
		 ],
		 "practice_area_id": ["599fd7aac62430971a4e0d07"],
		 "skill_used_id": ["599fd7aac62430971a4e0d07","599fd7aac62430971a4e0d07"],
		 "do_you_have_malpractice_insurance": "N"
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



