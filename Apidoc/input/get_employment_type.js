/**
 * @api {get} /getEmploymentType Get Employment Type
 * @apiName getEmploymentType
 * @apiGroup Dropdown Api
 *
 * @apiDescription Get Employment Type
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
            "_id": "599c055f775aea7c4b74646a",
            "name": "Part-time",
            "status": true
        },
        {
            "_id": "599c055f775aea7c4b74646b",
            "name": "Full time",
            "status": true
        },
        {
            "_id": "599c055f775aea7c4b74646c",
            "name": "Permanent",
            "status": true
        },
        {
            "_id": "599c0560775aea7c4b74646d",
            "name": "Contract",
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