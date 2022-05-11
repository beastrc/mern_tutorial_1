/**
 * @api {get} /getState Get State
 * @apiName getState
 * @apiGroup Dropdown Api
 *
 * @apiDescription Get states
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
            "_id": "5996e018dfcc980e2e3cf9bd",
            "name": "Alaska",
            "abbrev": "AK",
            "status": true
        },
        {
            "_id": "5996e05fdfcc980e2e3cf9be",
            "name": "Alabama",
            "abbrev": "AL",
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