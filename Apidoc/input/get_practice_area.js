/**
 * @api {get} /getPracticeArea Get PracticeArea
 * @apiName getPracticeArea
 * @apiGroup Dropdown Api
 *
 * @apiDescription Get Practice Area 
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
            "_id": "599c045e775aea7c4b746463",
            "name": "Administrative Law",
            "status": true
        },
        {
            "_id": "599c045e775aea7c4b746464",
            "name": "Admiralty and Maritime Law",
            "status": true
        },
        {
            "_id": "599c045e775aea7c4b746465",
            "name": "Agricultural Law",
            "status": true
        },
        {
            "_id": "599c045e775aea7c4b746466",
            "name": "Alternative Dispute Resolution",
            "status": true
        },
        {
            "_id": "599c045e775aea7c4b746467",
            "name": "Antitrust and Trade Regulation",
            "status": true
        },
        {
            "_id": "599c045e775aea7c4b746468",
            "name": "Appellate Practice",
            "status": true
        },
        {
            "_id": "599c0460775aea7c4b746469",
            "name": "Aviation and Aerospace Law",
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