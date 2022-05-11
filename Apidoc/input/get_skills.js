/**
 * @api {get} /getSkills Get Skills
 * @apiName getSkills
 * @apiGroup Dropdown Api
 *
 * @apiDescription Get Skills
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
            "name": "Legal Research",
            "status": true
        },
        {
            "_id": "599c05f2775aea7c4b74646f",
            "name": "Legal Writing",
            "status": true
        },
        {
            "_id": "599c05f2775aea7c4b746470",
            "name": "Legal Advice",
            "status": true
        },
        {
            "_id": "599c05f2775aea7c4b746471",
            "name": "Legal Assistance",
            "status": true
        },
        {
            "_id": "599c05f2775aea7c4b746472",
            "name": "Legal Document Preparation",
            "status": true
        },
        {
            "_id": "599c05f2775aea7c4b746473",
            "name": "Legal Compliance",
            "status": true
        },
        {
            "_id": "599c05f2775aea7c4b746474",
            "name": "Legal Translation",
            "status": true
        },
        {
            "_id": "599c05f2775aea7c4b746475",
            "name": "Legal Opinions",
            "status": true
        },
        {
            "_id": "599c05f2775aea7c4b746476",
            "name": "Contract Review",
            "status": true
        },
        {
            "_id": "599c05f2775aea7c4b746477",
            "name": "Litigation",
            "status": true
        },
        {
            "_id": "599c05f3775aea7c4b746478",
            "name": "Class Action Certification and Notice",
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