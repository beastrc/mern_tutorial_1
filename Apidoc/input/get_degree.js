/**
 * @api {get} /getDegree Get Degree
 * @apiName getDegree
 * @apiGroup Dropdown Api
 *
 * @apiDescription Get degree
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
            "_id": "599c0356775aea7c4b74645d",
            "name": "Bachelor of Arts",
            "status": true
        },
        {
            "_id": "599c035e775aea7c4b74645e",
            "name": "Bachelor of Science",
            "status": true
        },
        {
            "_id": "599c035e775aea7c4b74645f",
            "name": "Master",
            "status": true
        },
        {
            "_id": "599c035e775aea7c4b746460",
            "name": "Juris Doctor",
            "status": true
        },
        {
            "_id": "599c035e775aea7c4b746461",
            "name": "Doctorate",
            "status": true
        },
        {
            "_id": "599c035f775aea7c4b746462",
            "name": "Other",
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