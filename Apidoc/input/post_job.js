/**
* @api {post} /postJob Post job
* @apiVersion 0.0.1
* @apiName postJob
* @apiGroup Authentication
* @apiPermission User
*
* @apiDescription Save Post Job Detail

* @apiHeader {String} TOKEN      * A token send by header as TOKEN
* 
* @apiParam {String}  jobHeadline            * Job Headline
* @apiParam {String}  createdBy            * Created by user 
* @apiParam {Array} practice_area_id                                   * Practice area
* @apiParam {Array}  skillsNeeded                           		* Skills
* @apiParam {String} jobDescription            * Job description
* @apiParam {String} city       * City.
* @apiParam {String} state_id                                   * State ID 
* @apiParam {String} zipcode                                        * Zip code 
* @apiParam {String} setting_id                                 * Setting
* @apiParam {String} estimatedStartDate             * Estimated start date.
* @apiParam {Number} duration    	    * Estimated Duration
* @apiParam {String} durationPeriod		    * DAYS/WEEKS/MONTHS
* @apiParam {Number}  rate            * Target Rate
* @apiParam {String} rateType   * HOURLY/FIXED.
* @apiParam {Number} hours                                   * Hours
* @apiParam {String} HoursType         * Employment type id
* @apiParam {Number} subTotal * Subtotal
* @apiParam {Number} total * Total
* @apiParam {Number} currentRate * Current Rate
* @apiParam {Array} paymentDetails * Payment details
* @apiParam {Number} paymentDetails.rate * Rate
* @apiParam {String} paymentDetails.delivery * Delivery detail
* @apiParam {String} paymentDetails.dueDate * Due Date
* @apiParam {String} status * posted/saved


*
*
* @apiSuccess {Number} Code 200.
* @apiSuccess {Boolean} Status true.
* @apiSuccess {String} Message You have successfully updated your profile.
*
* @apiExample Example usage:
*
*{
                        "jobHeadline": "Lawyer - IP Litigation",
                        "createdBy": "Rimpi",
                        "practiceArea": [{
                            "name": "Admiralty and Maritime Law",
                            "status": true
                        }],
                        "skillsNeeded": ["599c055f775aea7c4b74646b"],
                        "jobDescription": "In volutpat ultrices ornare. Curabitur convallis ligula lorem, quis rhoncus mi efficitur ac. Mauris dictum sagittis auctor. Donec porttitor vel magna sed faucibus. Aenean blandit, mauris non dignissim aliquam, sapien sem sodales tortor, ac tincidunt sapien nunc efficitur lorem. Nullam feugiat felis ligula, at ultrices eros euismod eu. Nam ut ante sed dolor suscipit mattis. Phasellus justo erat, convallis a scelerisque non, vehicula id nunc. In non malesuada dui. Pellentesque habitant morbiquess. <br/><br/>Integer sed mattis risus, sit amet tempor augue. Suspendisse varius felis sed ipsum commodo, vel euismod urna euismod. Fusce id libero ac mauris iaculis porttitor. Phasellus consectetur orci et quam rutrum, non scelerisque mi ornare. Curabitur efficitur dolor at tempor cursus. Curabitur arcu lacus, semper eget vulputate a, blandit non felis. Donec volutpat, augue non dignissim auctor, dolor enim scelerisque quam, ac pellentesque felis est a justo.",
                        "city": "Ny",
                        "state": "AZ",
                        "zipCode": 12345,
                        "estimatedStartDate": "10/26/2017",
                        "duration": 11,
                        "durationPeriod": "WEEKS",
                        "rate": 10,
                        "rateType": "HOURLY",
                        "hours": 10,
                        "hoursType": "599c055f775aea7c4b74646b",
                        "subTotal": 100,
                        "total": 115,
                        "setting_id":"599c055f775aea7c4b74646b",
                        "currentRate":15,
                        "paymentDetails": [{
                            "rate": 100,
                            "delivery": "1st delivery",
                            "dueDate" : "8/26/2017"
                        }, {
                            "rate": 15,
                            "delivery": "2nd delivery",
                            "dueDate" : "8/26/2017"
                        }],
                        "status": "posted"
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
	"Message": "Total amount calculation is not correct"
    }
    
 */



