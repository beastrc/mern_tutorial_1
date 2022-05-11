/**
 * @api {get} /getUserProfile/:param1/:param2 Get User Profile
 * @apiName getUserProfile
 * @apiGroup Authentication
 *
 * @apiDescription Get User Profile
 *
 * @apiParam {String} param1      * Value : job_seeker_info if getting data for seeker else value will be job_posters_info

 * @apiParam {String} param2     * Value : job_posters_info if getting data for seeker else value will be job_seeker_info
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
    "Data": {
        "__v": 0,
        "_id": "59df3a79fcdd6f240a54846a",
        "email": "test@yopmail.com",
        "first_name": "rimpi",
        "last_name": "garg",
        "password": "$2a$10$tgNfzXsREAZMgh4GR/JFA.4LAFbhWxRzt9bVYmY1bLg3ooAGvL4hK",
        "modified": "2017-10-12T09:48:41.825Z",
        "created": "2017-10-12T09:48:41.825Z",
        "status": "Y",
        "job_posters_info": {
            "basic_profile": {
                "last_visited_page": 0,
                "is_profile_completed": "N",
                "intrested_in_id": [],
                "practice_area_id": [],
                "practice_location_id": []
            }
        },
        "job_seeker_info": {
            "last_visited_page": 4,
            "is_profile_completed": "Y",
            "job_profile": {
                "willing_to_work_locally": "Y",
                "willing_to_work_remotely": "N",
                "willing_to_work_full_time": "Y",
                "willing_to_work_part_time": "Y",
                "desired_job_type": [
                    {
                        "employment_type_id": "599c055f775aea7c4b74646c",
                        "min_amount": 55040,
                        "max_amount": 100030,
                        "selected": "Y",
                        "_id": "59df3dfe87eaac25581e5d41"
                    },
                    {
                        "employment_type_id": "599c0560775aea7c4b74646d",
                        "min_amount": 200,
                        "max_amount": 300,
                        "selected": "N",
                        "_id": "59df3dfe87eaac25581e5d40"
                    }
                ],
                "willing_to_work_location_id": [
                    "dfsfsfsfdsfsfsd",
                    "adsasdadadadadad"
                ]
            },
            "network": {
                "writing_samples": []
            },
            "experience": [
                {
                    "_id": "59bb7513782867707b646afc",
                    "company_name": "test",
                    "designation": "test",
                    "start_date": "2017-04-30T18:30:00.000Z",
                    "end_date": "2017-06-13T18:30:00.000Z",
                    "experience_additional_information": "",
                    "present": "Y",
                    "skill_used_id": [],
                    "employment_type_id": [
                        "599e8a3759bbb543d7a539dc"
                    ]
                },
                {
                    "_id": "59bb7513782867707b646afc",
                    "company_name": "test",
                    "designation": "test",
                    "start_date": "2017-04-30T18:30:00.000Z",
                    "end_date": "2017-06-13T18:30:00.000Z",
                    "experience_additional_information": "",
                    "present": "Y",
                    "skill_used_id": [],
                    "employment_type_id": [
                        "599e8a3759bbb543d7a539dc"
                    ]
                },
                {
                    "others": "v bhngh",
                    "showOthers": "true",
                    "experience_additional_information": "Awasome",
                    "designation": "Module Lead",
                    "end_date": "2009-02-10T18:30:00.000Z",
                    "start_date": "2008-06-03T18:30:00.000Z",
                    "company_name": "ELI",
                    "_id": "599c1d49495333156da0cf18",
                    "present": "N",
                    "skill_used_id": [
                        "59b7d89dfae05a01e46532b8"
                    ],
                    "employment_type_id": [
                        "1"
                    ]
                }
            ],
            "basic_profile": {
                "do_you_have_malpractice_insurance": "N",
                "skill_used_id": [
                    "599fd7aac62430971a4e0d07",
                    "599fd7aac62430971a4e0d07"
                ],
                "practice_area_id": [
                    "599fd7aac62430971a4e0d07"
                ],
                "bar_admission": [
                    {
                        "bar_state_id": "599f0d07",
                        "bar_registration_number": 1234567890,
                        "_id": "59df3e0687eaac25581e5d43"
                    },
                    {
                        "bar_state_id": "59db6a8aff17ca45b1f2e337",
                        "bar_registration_number": 1234567890,
                        "_id": "59df3e0687eaac25581e5d42"
                    }
                ],
                "education": [
                    {
                        "school": "Boys Highs School",
                        "degree_id": "59db6a8aff17ca45b1f2e337",
                        "year": "0069",
                        "education_additional_information": "Gold Medilist",
                        "_id": "59df3e0687eaac25581e5d44"
                    }
                ],
                "basic_info": {
                    "street_address": "A-66",
                    "city": "Noida",
                    "state_id": "59db6a78ff17ca45b1f2e336",
                    "zipcode": "02021",
                    "phone_number": "d39811641985"
                }
            }
        }
    }
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