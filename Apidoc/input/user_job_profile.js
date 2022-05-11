/**
* @api {post} /userJobProfile User Job profile 
* @apiVersion 0.0.1
* @apiName userJobProfile
* @apiGroup Authentication
* @apiPermission User
*
* @apiDescription Job profile of user created with Legably system.

* @apiHeader {String} TOKEN      * A token send by header as TOKEN
* 
* @apiParam {Object}  job_seeker_info            * Job Seeker Details
* @apiParam {String}  job_seeker_info.willing_to_work_locally            * Willing to work locally
* @apiParam {Number}  job_seeker_info.willing_to_work_location_id            * Willing to work locally within location
* @apiParam {String} job_seeker_info.willing_to_work_remotely   * Willing to work remotely
* @apiParam {String} job_seeker_info.willing_to_work_full_time         * Willing to work full time.
* @apiParam {String} job_seeker_info.willing_to_work_part_time * Willing to work part time
@apiParam {String} job_seeker_info.desired_job_type * Desired job type
@apiParam {String} job_seeker_info.desired_job_type.employment_type_id * Employment type Id
@apiParam {Number} job_seeker_info.desired_job_type.min_amount * Minimum amount
@apiParam {Number} job_seeker_info.desired_job_type.max_amount * Maximum amount

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
    "job_profile":{
       "willing_to_work_locally": "Y",
       "willing_to_work_location_id":["dfsfsfsfdsfsfsd","adsasdadadadadad"],
       "willing_to_work_remotely": "N",
       "willing_to_work_full_time": "Y",
       "willing_to_work_part_time": "Y",
       "desired_job_type": [
        {
         "employment_type_id": "599c055f775aea7c4b74646c",
         "min_amount": 55040,
         "max_amount": 100030,
         "selected":"Y"
        },
        {
         "employment_type_id": "599c0560775aea7c4b74646d",
         "min_amount": 200,
         "max_amount": 300,
         "selected":"N"
        }
       ]
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



