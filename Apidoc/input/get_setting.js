/**
 * @api {get} /getSkills Get Settings
 * @apiName getSettings
 * @apiGroup Dropdown Api
 *
 * @apiDescription Get Settings
 *
 * @apiHeader {String} TOKEN      * A token send by header as TOKEN
 *
 * @apiSuccess {Number} Code 200.
 * @apiSuccess {String} Status True.
 * @apiSuccess {String} Message The request is OK.
 * @apiSuccess {Object} Data State data.
 
 *
 * @apiSuccessExample Success-Response-Example:
 *  HTTP/1.1 success
{
    "Code": 200,
    "Status": true,
    "Message": "The request is OK",
    "Data": [
        {
            "_id": "59e0b147a8bcf9b0e1d0bfcc",
            "name": "on-site",
            "status": true
        },
        {
            "_id": "59e0b166a8bcf9b0e1d0bfcd",
            "name": "off-site",
            "status": true
        },
        {
            "_id": "59e0b171a8bcf9b0e1d0bfce",
            "name": "on-site or off-site",
            "status": true
        }
    ]
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