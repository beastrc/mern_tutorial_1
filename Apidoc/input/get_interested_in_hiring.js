/**
 * @api {get} /getInterestedInHiring Get Interested in hiring dropdown
 * @apiName getInterestedInHiring
 * @apiGroup Dropdown Api
 *
 * @apiDescription Get Interested in hiring dropdown
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
    "Message": "Request is OK",
    "Data": [
        {
            "_id": "599c05f2775aea7c4b74646e",
            "name": "Attorneys",
            "status": true
        },
        {
            "_id": "599c05f2775aea7c4b74646f",
            "name": "Paralegals",
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