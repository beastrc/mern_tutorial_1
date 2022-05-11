/**
* @api {post} /userExperienceProfile User Experience profile 
* @apiVersion 0.0.1
* @apiName userExperienceProfile
* @apiGroup Authentication
* @apiPermission User
*
* @apiDescription Experience profile of user created with Legably system.

* @apiHeader {String} TOKEN      * A token send by header as TOKEN
* 
* @apiParam {Object}  job_seeker_info            * Job Seeker Details
* @apiParam {Array}  job_seeker_info.experience            * Experience Details
* @apiParam {String}  job_seeker_info.experience.company_name            * Company name
* @apiParam {Date} job_seeker_info.experience.start_date   * Start date of company duration.
* @apiParam {Date} job_seeker_info.experience.end_date         * End date of company duration.
* @apiParam {String} job_seeker_info.experience.designation * Designation
* @apiParam {String}  job_seeker_info.experience.employment_type_id                           		* Employment type id.
* @apiParam {Array} job_seeker_info.experience.skill_used_id                           		* Skill used  ID.
* @apiParam {String} job_seeker_info.skilled_used_other_text                   * Other skill used (optional)
* @apiParam {String} job_seeker_info.experience_additional_information                                   * Additional experience information(optional)

*
*
* @apiSuccess {Number} Code 200.
* @apiSuccess {Boolean} Status true.
* @apiSuccess {String} Message You have successfully updated your profile.
*
* @apiExample Example usage:
*
*{
  "job_seeker_info":{

  "experience":[
    {
      "_id":"59bb7513782867707b646afc",
      "company_name":"test",
      "designation":"test",
      "start_date":"05/01/2017",
      "end_date":"06/14/2017",
      "experience_additional_information":"",
      "skill_used_id":[],
      "employment_type_id":["599e8a3759bbb543d7a539dc"],
      "present":"Y"
      
    },{
      "others":"",
      "showOthers":"",
      "experience_additional_information":"",
      "skillied_used_other_text":"",
      "designation":"",
      "end_date":"02/11/2009",
      "start_date":"06/04/2008",
      "company_name":"","_id":"599c1d49495333156da0cf18","skill_used_id":[],"employment_type_id":[],"present":""
      
    },
      {
      "_id":"59bb7513782867707b646afc",
      "company_name":"test",
      "designation":"test",
      "start_date":"05/01/2017",
      "end_date":"06/14/2017",
      "experience_additional_information":"",
      "skill_used_id":[],
      "employment_type_id":["599e8a3759bbb543d7a539dc"],
      "present":"Y"
      
    },{
      "others":"v bhngh",
      "showOthers":"true",
      "experience_additional_information":"Awasome",
      "skillied_used_other_text":"JS",
      "designation":"Module Lead",
      "end_date":"02/11/2009",
      "start_date":"06/04/2008",
      "company_name":"ELI","_id":"599c1d49495333156da0cf18","skill_used_id":["59b7d89dfae05a01e46532b8"],"employment_type_id":["1"],"present":"N"}]}
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



