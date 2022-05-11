define({ "api": [
  {
    "type": "post",
    "url": "/changePassword",
    "title": "Change Password",
    "version": "0.0.1",
    "name": "changePassword",
    "group": "Authentication",
    "permission": [
      {
        "name": "User"
      }
    ],
    "description": "<p>User can change password</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<ul> <li>A token send by header as token</li> </ul>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "old_password",
            "description": "<ul> <li>Old password required in body.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<ul> <li>New password required in body.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirm_password",
            "description": "<ul> <li>Confirm password required in body.</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>true.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The request is OK.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": "    HTTP/1.1 success \n{\n    \"Code\": 200,\n    \"Status\": true,\n    \"Message\": \"You have successfully reset your password\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "\n{\n\t\"old_password\":\"Qwer@123\",\n\t\"password\": \"Qwer@12345\",\n\t\"confirm_password\": \"Qwer@12345\"\n}",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>false.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": "  \n{\n    \"Code\": 400,\n    \"Status\": false,\n    \"Message\": \"Password does not match the confirm password\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./input/change_password.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/forgotPassword",
    "title": "Forgot Password",
    "version": "0.0.1",
    "name": "forgotPassword",
    "group": "Authentication",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>sent reset password link, if legably user forgot password.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<ul> <li>Registered email is required in body.</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>true.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The request is OK.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": "    HTTP/1.1 success\n{\n \"Code\": 200,\n \"Status\": true,\n \"Message\": \"Mail sent successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "\n{\n   \"email\" : \"test@yopmail.com\"\n}",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"400\"> <li></li> </ol>"
          },
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>Status.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": "  \n {\n        \"Code\": 401,\n\t\"Status\": false,\n\t\"Message\": \"Email does not exist\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "./input/forgot_password.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "/getUserProfile/:param1/:param2",
    "title": "Get User Profile",
    "name": "getUserProfile",
    "group": "Authentication",
    "description": "<p>Get User Profile</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "param1",
            "description": "<ul> <li>Value : job_seeker_info if getting data for seeker else value will be job_posters_info</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "param2",
            "description": "<ul> <li>Value : job_posters_info if getting data for seeker else value will be job_seeker_info</li> </ul>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "TOKEN",
            "description": "<ul> <li>A token send by header as TOKEN</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Status",
            "description": "<p>True.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>The request is OK.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Data",
            "description": "<p>State data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": " HTTP/1.1 success\n{\n    \"Code\": 200,\n    \"Status\": true,\n    \"Message\": \"The request is OK\",\n    \"Data\": {\n        \"__v\": 0,\n        \"_id\": \"59df3a79fcdd6f240a54846a\",\n        \"email\": \"test@yopmail.com\",\n        \"first_name\": \"rimpi\",\n        \"last_name\": \"garg\",\n        \"password\": \"$2a$10$tgNfzXsREAZMgh4GR/JFA.4LAFbhWxRzt9bVYmY1bLg3ooAGvL4hK\",\n        \"modified\": \"2017-10-12T09:48:41.825Z\",\n        \"created\": \"2017-10-12T09:48:41.825Z\",\n        \"status\": \"Y\",\n        \"job_posters_info\": {\n            \"basic_profile\": {\n                \"last_visited_page\": 0,\n                \"is_profile_completed\": \"N\",\n                \"intrested_in_id\": [],\n                \"practice_area_id\": [],\n                \"practice_location_id\": []\n            }\n        },\n        \"job_seeker_info\": {\n            \"last_visited_page\": 4,\n            \"is_profile_completed\": \"Y\",\n            \"job_profile\": {\n                \"willing_to_work_locally\": \"Y\",\n                \"willing_to_work_remotely\": \"N\",\n                \"willing_to_work_full_time\": \"Y\",\n                \"willing_to_work_part_time\": \"Y\",\n                \"desired_job_type\": [\n                    {\n                        \"employment_type_id\": \"599c055f775aea7c4b74646c\",\n                        \"min_amount\": 55040,\n                        \"max_amount\": 100030,\n                        \"selected\": \"Y\",\n                        \"_id\": \"59df3dfe87eaac25581e5d41\"\n                    },\n                    {\n                        \"employment_type_id\": \"599c0560775aea7c4b74646d\",\n                        \"min_amount\": 200,\n                        \"max_amount\": 300,\n                        \"selected\": \"N\",\n                        \"_id\": \"59df3dfe87eaac25581e5d40\"\n                    }\n                ],\n                \"willing_to_work_location_id\": [\n                    \"dfsfsfsfdsfsfsd\",\n                    \"adsasdadadadadad\"\n                ]\n            },\n            \"network\": {\n                \"writing_samples\": []\n            },\n            \"experience\": [\n                {\n                    \"_id\": \"59bb7513782867707b646afc\",\n                    \"company_name\": \"test\",\n                    \"designation\": \"test\",\n                    \"start_date\": \"2017-04-30T18:30:00.000Z\",\n                    \"end_date\": \"2017-06-13T18:30:00.000Z\",\n                    \"experience_additional_information\": \"\",\n                    \"present\": \"Y\",\n                    \"skill_used_id\": [],\n                    \"employment_type_id\": [\n                        \"599e8a3759bbb543d7a539dc\"\n                    ]\n                },\n                {\n                    \"_id\": \"59bb7513782867707b646afc\",\n                    \"company_name\": \"test\",\n                    \"designation\": \"test\",\n                    \"start_date\": \"2017-04-30T18:30:00.000Z\",\n                    \"end_date\": \"2017-06-13T18:30:00.000Z\",\n                    \"experience_additional_information\": \"\",\n                    \"present\": \"Y\",\n                    \"skill_used_id\": [],\n                    \"employment_type_id\": [\n                        \"599e8a3759bbb543d7a539dc\"\n                    ]\n                },\n                {\n                    \"others\": \"v bhngh\",\n                    \"showOthers\": \"true\",\n                    \"experience_additional_information\": \"Awasome\",\n                    \"designation\": \"Module Lead\",\n                    \"end_date\": \"2009-02-10T18:30:00.000Z\",\n                    \"start_date\": \"2008-06-03T18:30:00.000Z\",\n                    \"company_name\": \"ELI\",\n                    \"_id\": \"599c1d49495333156da0cf18\",\n                    \"present\": \"N\",\n                    \"skill_used_id\": [\n                        \"59b7d89dfae05a01e46532b8\"\n                    ],\n                    \"employment_type_id\": [\n                        \"1\"\n                    ]\n                }\n            ],\n            \"basic_profile\": {\n                \"do_you_have_malpractice_insurance\": \"N\",\n                \"skill_used_id\": [\n                    \"599fd7aac62430971a4e0d07\",\n                    \"599fd7aac62430971a4e0d07\"\n                ],\n                \"practice_area_id\": [\n                    \"599fd7aac62430971a4e0d07\"\n                ],\n                \"bar_admission\": [\n                    {\n                        \"bar_state_id\": \"599f0d07\",\n                        \"bar_registration_number\": 1234567890,\n                        \"_id\": \"59df3e0687eaac25581e5d43\"\n                    },\n                    {\n                        \"bar_state_id\": \"59db6a8aff17ca45b1f2e337\",\n                        \"bar_registration_number\": 1234567890,\n                        \"_id\": \"59df3e0687eaac25581e5d42\"\n                    }\n                ],\n                \"education\": [\n                    {\n                        \"school\": \"Boys Highs School\",\n                        \"degree_id\": \"59db6a8aff17ca45b1f2e337\",\n                        \"year\": \"0069\",\n                        \"education_additional_information\": \"Gold Medilist\",\n                        \"_id\": \"59df3e0687eaac25581e5d44\"\n                    }\n                ],\n                \"basic_info\": {\n                    \"street_address\": \"A-66\",\n                    \"city\": \"Noida\",\n                    \"state_id\": \"59db6a78ff17ca45b1f2e336\",\n                    \"zipcode\": \"02021\",\n                    \"phone_number\": \"d39811641985\"\n                }\n            }\n        }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>Status.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": " \n{\n   \"Code\": 400,\n\"Status\": false,\n\"Message\": \"Oops!! Something went wrong\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./input/get_user_profile.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/login",
    "title": "User Signin",
    "version": "0.0.1",
    "name": "login",
    "group": "Authentication",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>Signin with Legably system to authenticate.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<ul> <li>Registered email requried in body</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<ul> <li>Password is required in body.</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>true.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The request is OK.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "       HTTP/1.1 success\n{\n \"Code\": 200,\n \"Status\": true,\n \"Message\": \"You have successfully logged in\"\n \"Data\": {\n\t\"token\":  \"b6d54d94-4299-0e56-67e9-fccd69562466\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "\n{\n  \"email\": \"test@yopmail.com\",\n  \"password\" : \"YourP@ssword\"\n}",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"400\"> <li></li> </ol>"
          },
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "Status",
            "description": "<p>false.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": "  \n {\n        \"Code\": 400,\n\t\"Status\": false,\n\t\"Message\": \"Invalid User Credentials\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "./input/signin.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/logout",
    "title": "Logout",
    "name": "logout",
    "group": "Authentication",
    "description": "<p>Logout</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "TOKEN",
            "description": "<ul> <li>A token send by header as TOKEN</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Status",
            "description": "<p>True.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>You have successfully logout.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": " HTTP/1.1 success\n{\n    \"Code\": 200,\n    \"Status\": true,\n    \"Message\": \"You have successfully logout\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>Status.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": " \n{\n\t\"Code\": 400,\n\"Status\": false,\n\"Message\": \"Oops!! Something went wrong\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./input/logout.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/postJob",
    "title": "Post job",
    "version": "0.0.1",
    "name": "postJob",
    "group": "Authentication",
    "permission": [
      {
        "name": "User"
      }
    ],
    "description": "<p>Save Post Job Detail</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "TOKEN",
            "description": "<ul> <li>A token send by header as TOKEN</li> </ul>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "jobHeadline",
            "description": "<ul> <li>Job Headline</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "createdBy",
            "description": "<ul> <li>Created by user</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "practice_area_id",
            "description": "<ul> <li>Practice area</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "skillsNeeded",
            "description": "<ul> <li>Skills</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "jobDescription",
            "description": "<ul> <li>Job description</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<ul> <li>City.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state_id",
            "description": "<ul> <li>State ID</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zipcode",
            "description": "<ul> <li>Zip code</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "setting_id",
            "description": "<ul> <li>Setting</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "estimatedStartDate",
            "description": "<ul> <li>Estimated start date.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "duration",
            "description": "<ul> <li>Estimated Duration</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "durationPeriod",
            "description": "<ul> <li>DAYS/WEEKS/MONTHS</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "rate",
            "description": "<ul> <li>Target Rate</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rateType",
            "description": "<ul> <li>HOURLY/FIXED.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "hours",
            "description": "<ul> <li>Hours</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "HoursType",
            "description": "<ul> <li>Employment type id</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "subTotal",
            "description": "<ul> <li>Subtotal</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "total",
            "description": "<ul> <li>Total</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "currentRate",
            "description": "<ul> <li>Current Rate</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "paymentDetails",
            "description": "<ul> <li>Payment details</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "paymentDetails.rate",
            "description": "<ul> <li>Rate</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "paymentDetails.delivery",
            "description": "<ul> <li>Delivery detail</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "paymentDetails.dueDate",
            "description": "<ul> <li>Due Date</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<ul> <li>posted/saved</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "Status",
            "description": "<p>true.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>You have successfully updated your profile.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": "    HTTP/1.1 success\n{\n  \"Code\": 200,\n  \"Status\": true,\n  \"Message\": \"You have successfully updated your profile.\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "\n{\n                        \"jobHeadline\": \"Lawyer - IP Litigation\",\n                        \"createdBy\": \"Rimpi\",\n                        \"practiceArea\": [{\n                            \"name\": \"Admiralty and Maritime Law\",\n                            \"status\": true\n                        }],\n                        \"skillsNeeded\": [\"599c055f775aea7c4b74646b\"],\n                        \"jobDescription\": \"In volutpat ultrices ornare. Curabitur convallis ligula lorem, quis rhoncus mi efficitur ac. Mauris dictum sagittis auctor. Donec porttitor vel magna sed faucibus. Aenean blandit, mauris non dignissim aliquam, sapien sem sodales tortor, ac tincidunt sapien nunc efficitur lorem. Nullam feugiat felis ligula, at ultrices eros euismod eu. Nam ut ante sed dolor suscipit mattis. Phasellus justo erat, convallis a scelerisque non, vehicula id nunc. In non malesuada dui. Pellentesque habitant morbiquess. <br/><br/>Integer sed mattis risus, sit amet tempor augue. Suspendisse varius felis sed ipsum commodo, vel euismod urna euismod. Fusce id libero ac mauris iaculis porttitor. Phasellus consectetur orci et quam rutrum, non scelerisque mi ornare. Curabitur efficitur dolor at tempor cursus. Curabitur arcu lacus, semper eget vulputate a, blandit non felis. Donec volutpat, augue non dignissim auctor, dolor enim scelerisque quam, ac pellentesque felis est a justo.\",\n                        \"city\": \"Ny\",\n                        \"state\": \"AZ\",\n                        \"zipCode\": 12345,\n                        \"estimatedStartDate\": \"10/26/2017\",\n                        \"duration\": 11,\n                        \"durationPeriod\": \"WEEKS\",\n                        \"rate\": 10,\n                        \"rateType\": \"HOURLY\",\n                        \"hours\": 10,\n                        \"hoursType\": \"599c055f775aea7c4b74646b\",\n                        \"subTotal\": 100,\n                        \"total\": 115,\n                        \"setting_id\":\"599c055f775aea7c4b74646b\",\n                        \"currentRate\":15,\n                        \"paymentDetails\": [{\n                            \"rate\": 100,\n                            \"delivery\": \"1st delivery\",\n                            \"dueDate\" : \"8/26/2017\"\n                        }, {\n                            \"rate\": 15,\n                            \"delivery\": \"2nd delivery\",\n                            \"dueDate\" : \"8/26/2017\"\n                        }],\n                        \"status\": \"posted\"\n                    }",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"400\"> <li></li> </ol>"
          },
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "Status",
            "description": "<p>false.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": "  \n {\n        \"Code\": 400,\n\t\"Status\": false,\n\t\"Message\": \"Total amount calculation is not correct\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "./input/post_job.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/posterBasicProfile",
    "title": "Poster Basic profile",
    "version": "0.0.1",
    "name": "posterBasicProfile",
    "group": "Authentication",
    "permission": [
      {
        "name": "User"
      }
    ],
    "description": "<p>Basic profile of poster created with Legably system.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "TOKEN",
            "description": "<ul> <li>A token send by header as TOKEN</li> </ul>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "job_posters_info",
            "description": "<ul> <li>Job Poster Details</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "job_posters_info.basic_profile",
            "description": "<ul> <li>Job seeker basic profile details</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_posters_info.basic_profile.basic_info",
            "description": "<ul> <li>Job seeker basic details</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_posters_info.basic_profile.basic_info.first_name",
            "description": "<ul> <li>First Name.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_posters_info.basic_profile.basic_info.last_name",
            "description": "<ul> <li>Last Name.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_posters_info.basic_profile.basic_info.street_address",
            "description": "<ul> <li>Street address.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_posters_info.basic_profile.basic_info.city",
            "description": "<ul> <li>City.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_posters_info.basic_profile.basic_info.state_id",
            "description": "<ul> <li>State ID for user profile Details.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "job_posters_info.basic_profile.basic_info.zipcode",
            "description": "<ul> <li>Zip code of the user</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "job_posters_info.basic_profile.basic_info.phone_number",
            "description": "<ul> <li>Phone number of the user.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_posters_info.basic_profile.firm_name",
            "description": "<ul> <li>Firm Name</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_posters_info.basic_profile.title",
            "description": "<ul> <li>Title.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "job_posters_info.basic_profile.practice_location_id",
            "description": "<ul> <li>Practice locations</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "job_posters_info.basic_profile.practice_area_id",
            "description": "<ul> <li>Practice area</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_posters_info.basic_profile.intrested_in_id",
            "description": "<ul> <li>Interesting in hiring</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_posters_info.basic_profile.website_url",
            "description": "<ul> <li>Website path</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "Status",
            "description": "<p>true.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>You have successfully updated your profile.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": "    HTTP/1.1 success\n{\n  \"Code\": 200,\n  \"Status\": true,\n  \"Message\": \"You have successfully updated your profile.\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "\n{\n\t\"first_name\": \"Ashutosh\",\n\t \"last_name\": \"Agrawal\",\n\t \"job_posters_info\":{\n\t \t\"basic_profile\":{\n\t\t\t\"basic_info\":{\n\t\t\t\t\"street_address\": \"A-66\",\n\t\t\t\t \"city\": \"Noida\",\n\t\t\t\t \"state_id\": \"59db6a78ff17ca45b1f2e336\",\n\t\t\t\t \"zipcode\": \"02221\",\n\t\t\t\t \"phone_number\": \"d39116985222\"\n\t\t \t\n\t\t  \t },\n\t\t  \t \"firm_name\" : \"kiwitech\",\n\t\t\t \"title\":\"kiwitech\",\n\t\t\t \"practice_location_id\" : [\"59db6a78ff17ca45b1f2e336\"],\n\t\t\t \"practice_area_id\" : [\"599fd7aac62430971a4e0d07\"],\n\t\t\t \"intrested_in_id\" : [\"599fd7aac62430971a4e0d07\"],\n\t\t\t \"website_url\": \"http://www.google.com\"\n\t\t }\n\t\t \n\t\t}\t\t\n}",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"400\"> <li></li> </ol>"
          },
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "Status",
            "description": "<p>false.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": "  \n {\n        \"Code\": 400,\n\t\"Status\": false,\n\t\"Message\": \"Invalid Parameters\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "./input/poster_basic_profile.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/resetPassword/:secretId",
    "title": "Reset Password",
    "version": "0.0.1",
    "name": "resetPassword",
    "group": "Authentication",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>Reset your password by forgot password link sent on your registerd email.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<ul> <li>Password field is required in body</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirm_password",
            "description": "<ul> <li>Confirm password field is required in body</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>true</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The request is OK.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "       HTTP/1.1 success\n{\n    \"Code\": 200,\n    \"Status\": true,\n    \"Message\": \"You have successfully reset your password\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "\n{\n\t\"password\": \"Qwer@123\",\n\t\"confirm_password\": \"Qwer@123\"\n}",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>Status.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": "  \n{\n    \"Code\": 401,\n    \"Status\": false,\n    \"Message\": \"The link has been expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./input/reset_password.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/userBasicProfile",
    "title": "User Basic profile",
    "version": "0.0.1",
    "name": "userBasicProfile",
    "group": "Authentication",
    "permission": [
      {
        "name": "User"
      }
    ],
    "description": "<p>Basic profile of user created with Legably system.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "TOKEN",
            "description": "<ul> <li>A token send by header as TOKEN</li> </ul>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "job_seeker_info",
            "description": "<ul> <li>Job Seeker Details</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "job_seeker_info.basic_profile",
            "description": "<ul> <li>Job seeker basic profile details</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "job_seeker_info.basic_profile.basic_info",
            "description": "<ul> <li>Job seeker basic details</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.basic_profile.basic_info.first_name",
            "description": "<ul> <li>First Name.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.basic_profile.basic_info.last_name",
            "description": "<ul> <li>Last Name.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.basic_profile.basic_info.street_address",
            "description": "<ul> <li>Street address.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.basic_profile.basic_info.city",
            "description": "<ul> <li>City.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.basic_profile.basic_info.state_id",
            "description": "<ul> <li>State ID for user profile Details.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "job_seeker_info.basic_profile.basic_info.zipcode",
            "description": "<ul> <li>Zip code of the user</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "job_seeker_info.basic_profile.basic_info.phone_number",
            "description": "<ul> <li>Phone number of the user.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "job_seeker_info.basic_profile.education",
            "description": "<ul> <li>Education Details</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.basic_profile.education.school",
            "description": "<ul> <li>School</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.basic_profile.education.degree_id",
            "description": "<ul> <li>Degree ID.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.basic_profile.education.year",
            "description": "<ul> <li>Year.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.basic_profile.education.education_additional_information",
            "description": "<ul> <li>Additional information.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "job_seeker_info.basic_profile.bar_admission",
            "description": "<ul> <li>Bar admission detail.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.basic_profile.bar_admission.bar_state_id",
            "description": "<ul> <li>Bar state ID.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "job_seeker_info.basic_profile.bar_admission.bar_registration_number",
            "description": "<ul> <li>bar registration number.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "job_seeker_info.basic_profile.practice_area_id",
            "description": "<ul> <li>Practice area</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.basic_profile.do_you_have_malpractice_insurance",
            "description": "<ul> <li>Malpractice insurance.</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "Status",
            "description": "<p>true.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>You have successfully updated your profile.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": "    HTTP/1.1 success\n{\n  \"Code\": 200,\n  \"Status\": true,\n  \"Message\": \"You have successfully updated your profile.\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "\n{\n\t\"first_name\": \"Ashutoshh\",\n\t\"last_name\": \"Agrawal\",\n\t\"job_seeker_info\":{\n\t\"basic_profile\":{\n\t\t\"basic_info\":{\n\t\t\t\"street_address\": \"A-66\",\n\t\t\t\"city\": \"Noida\",\n\t\t\t\"state_id\": \"59db6a78ff17ca45b1f2e336\",\n\t\t\t\"zipcode\": \"02021\",\n\t\t\t\"phone_number\": \"234-234-2424\"\n\t\t},\n\t\t \"education\": [\n\t\t  {\n\t\t   \"school\": \"Boys Highs School\",\n\t\t   \"degree_id\": \"59db6a8aff17ca45b1f2e337\",\n\t\t   \"year\": \"2000\",\n\t\t   \"education_additional_information\": \"Gold Medilist\"\n\t\t  }\n\t\t ],\n\t\t \"bar_admission\": [\n\t\t  {\n\t\t   \"bar_state_id\": \"599f0d07\",\n\t\t   \"bar_registration_number\": 1234567890\n\t\t  },\n\t\t  {\n\t\t   \"bar_state_id\": \"59db6a8aff17ca45b1f2e337\",\n\t\t   \"bar_registration_number\": 1234567890\n\t\t  }\n\t\t ],\n\t\t \"practice_area_id\": [\"599fd7aac62430971a4e0d07\"],\n\t\t \"skill_used_id\": [\"599fd7aac62430971a4e0d07\",\"599fd7aac62430971a4e0d07\"],\n\t\t \"do_you_have_malpractice_insurance\": \"N\"\n\t\t}\n\t}\n}",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"400\"> <li></li> </ol>"
          },
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "Status",
            "description": "<p>false.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": "  \n {\n        \"Code\": 400,\n\t\"Status\": false,\n\t\"Message\": \"Invalid Parameters\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "./input/user_basic_profile.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/userExperienceProfile",
    "title": "User Experience profile",
    "version": "0.0.1",
    "name": "userExperienceProfile",
    "group": "Authentication",
    "permission": [
      {
        "name": "User"
      }
    ],
    "description": "<p>Experience profile of user created with Legably system.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "TOKEN",
            "description": "<ul> <li>A token send by header as TOKEN</li> </ul>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "job_seeker_info",
            "description": "<ul> <li>Job Seeker Details</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "job_seeker_info.experience",
            "description": "<ul> <li>Experience Details</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.experience.company_name",
            "description": "<ul> <li>Company name</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "job_seeker_info.experience.start_date",
            "description": "<ul> <li>Start date of company duration.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "job_seeker_info.experience.end_date",
            "description": "<ul> <li>End date of company duration.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.experience.designation",
            "description": "<ul> <li>Designation</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.experience.employment_type_id",
            "description": "<ul> <li>Employment type id.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "job_seeker_info.experience.skill_used_id",
            "description": "<ul> <li>Skill used  ID.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.skilled_used_other_text",
            "description": "<ul> <li>Other skill used (optional)</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.experience_additional_information",
            "description": "<ul> <li>Additional experience information(optional)</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "Status",
            "description": "<p>true.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>You have successfully updated your profile.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": "    HTTP/1.1 success\n{\n  \"Code\": 200,\n  \"Status\": true,\n  \"Message\": \"You have successfully updated your profile.\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "\n{\n  \"job_seeker_info\":{\n\n  \"experience\":[\n    {\n      \"_id\":\"59bb7513782867707b646afc\",\n      \"company_name\":\"test\",\n      \"designation\":\"test\",\n      \"start_date\":\"05/01/2017\",\n      \"end_date\":\"06/14/2017\",\n      \"experience_additional_information\":\"\",\n      \"skill_used_id\":[],\n      \"employment_type_id\":[\"599e8a3759bbb543d7a539dc\"],\n      \"present\":\"Y\"\n      \n    },{\n      \"others\":\"\",\n      \"showOthers\":\"\",\n      \"experience_additional_information\":\"\",\n      \"skillied_used_other_text\":\"\",\n      \"designation\":\"\",\n      \"end_date\":\"02/11/2009\",\n      \"start_date\":\"06/04/2008\",\n      \"company_name\":\"\",\"_id\":\"599c1d49495333156da0cf18\",\"skill_used_id\":[],\"employment_type_id\":[],\"present\":\"\"\n      \n    },\n      {\n      \"_id\":\"59bb7513782867707b646afc\",\n      \"company_name\":\"test\",\n      \"designation\":\"test\",\n      \"start_date\":\"05/01/2017\",\n      \"end_date\":\"06/14/2017\",\n      \"experience_additional_information\":\"\",\n      \"skill_used_id\":[],\n      \"employment_type_id\":[\"599e8a3759bbb543d7a539dc\"],\n      \"present\":\"Y\"\n      \n    },{\n      \"others\":\"v bhngh\",\n      \"showOthers\":\"true\",\n      \"experience_additional_information\":\"Awasome\",\n      \"skillied_used_other_text\":\"JS\",\n      \"designation\":\"Module Lead\",\n      \"end_date\":\"02/11/2009\",\n      \"start_date\":\"06/04/2008\",\n      \"company_name\":\"ELI\",\"_id\":\"599c1d49495333156da0cf18\",\"skill_used_id\":[\"59b7d89dfae05a01e46532b8\"],\"employment_type_id\":[\"1\"],\"present\":\"N\"}]}\n  }",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"400\"> <li></li> </ol>"
          },
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "Status",
            "description": "<p>false.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": "  \n {\n        \"Code\": 400,\n\t\"Status\": false,\n\t\"Message\": \"Invalid Parameters\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "./input/user_experience_profile.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/userJobProfile",
    "title": "User Job profile",
    "version": "0.0.1",
    "name": "userJobProfile",
    "group": "Authentication",
    "permission": [
      {
        "name": "User"
      }
    ],
    "description": "<p>Job profile of user created with Legably system.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "TOKEN",
            "description": "<ul> <li>A token send by header as TOKEN</li> </ul>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "job_seeker_info",
            "description": "<ul> <li>Job Seeker Details</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.willing_to_work_locally",
            "description": "<ul> <li>Willing to work locally</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "job_seeker_info.willing_to_work_location_id",
            "description": "<ul> <li>Willing to work locally within location</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.willing_to_work_remotely",
            "description": "<ul> <li>Willing to work remotely</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.willing_to_work_full_time",
            "description": "<ul> <li>Willing to work full time.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.willing_to_work_part_time",
            "description": "<ul> <li>Willing to work part time</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.desired_job_type",
            "description": "<ul> <li>Desired job type</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_seeker_info.desired_job_type.employment_type_id",
            "description": "<ul> <li>Employment type Id</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "job_seeker_info.desired_job_type.min_amount",
            "description": "<ul> <li>Minimum amount</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "job_seeker_info.desired_job_type.max_amount",
            "description": "<ul> <li>Maximum amount</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "Status",
            "description": "<p>true.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>You have successfully updated your profile.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": "    HTTP/1.1 success\n{\n  \"Code\": 200,\n  \"Status\": true,\n  \"Message\": \"You have successfully updated your profile.\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "\n{\n  \"job_seeker_info\":{\n    \"job_profile\":{\n       \"willing_to_work_locally\": \"Y\",\n       \"willing_to_work_location_id\":[\"dfsfsfsfdsfsfsd\",\"adsasdadadadadad\"],\n       \"willing_to_work_remotely\": \"N\",\n       \"willing_to_work_full_time\": \"Y\",\n       \"willing_to_work_part_time\": \"Y\",\n       \"desired_job_type\": [\n        {\n         \"employment_type_id\": \"599c055f775aea7c4b74646c\",\n         \"min_amount\": 55040,\n         \"max_amount\": 100030,\n         \"selected\":\"Y\"\n        },\n        {\n         \"employment_type_id\": \"599c0560775aea7c4b74646d\",\n         \"min_amount\": 200,\n         \"max_amount\": 300,\n         \"selected\":\"N\"\n        }\n       ]\n        }\n  }\n}",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"400\"> <li></li> </ol>"
          },
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "Status",
            "description": "<p>false.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": "  \n {\n        \"Code\": 400,\n\t\"Status\": false,\n\t\"Message\": \"Invalid Parameters\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "./input/user_job_profile.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/userNetworkProfile",
    "title": "User Network profile",
    "version": "0.0.1",
    "name": "userNetworkProfile",
    "group": "Authentication",
    "permission": [
      {
        "name": "User"
      }
    ],
    "description": "<p>Network profile of user created with Legably system.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "TOKEN",
            "description": "<ul> <li>A token send by header as TOKEN</li> </ul>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "network",
            "description": "<ul> <li>Network Details</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "network.lawyer_headline",
            "description": "<ul> <li>lawyer headline</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "network.about_lawyer",
            "description": "<ul> <li>About lawyer.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "network.linkdin_link",
            "description": "<ul> <li>linkedin link.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "network.clio_link",
            "description": "<ul> <li>Clio Link</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "Status",
            "description": "<p>true.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>You have successfully updated your profile.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": "    HTTP/1.1 success\n{\n  \"Code\": 200,\n  \"Status\": true,\n  \"Message\": \"You have successfully updated your profile.\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "\n{\n \n\t \"network\": {\n  \"lawyer_headline\": \"Law Headline..... Bla Bla\",\n  \"about_lawyer\": \"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged\",\n  \"linkedin_link\": \"https://www.linkedin.com/ashutosha/\",\n  \"clio_link\": \"https://www.clio.com/ashutosha/\"\n }\n\n}",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"400\"> <li></li> </ol>"
          },
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "Status",
            "description": "<p>false.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": "  \n {\n        \"Code\": 400,\n\t\"Status\": false,\n\t\"Message\": \"Invalid Parameters\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "./input/user_network_profile.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/signup",
    "title": "User Signup",
    "version": "0.0.1",
    "name": "userSignUp",
    "group": "Authentication",
    "permission": [
      {
        "name": "None"
      }
    ],
    "description": "<p>Signup user with Legably system.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "first_name",
            "description": "<ul> <li>First Name.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "last_name",
            "description": "<ul> <li>Last Name.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<ul> <li>Email Address of the user (Must be unique).</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<ul> <li>Password.</li> </ul>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirm_password",
            "description": "<ul> <li>Confirm Password.</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "Status",
            "description": "<p>true.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>You have successfully sign up.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": "    HTTP/1.1 success\n{\n  \"Code\": 200,\n  \"Status\": true,\n  \"Message\": \"You have successfully sign up\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "\n{\n  \"first_name\": \"test\",\n  \"last_name\": \"one\",\n  \"email\": \"test@kiwitech.com\",\n  \"password\": \"Qwer@123\",\n  \"confirm_password\": \"Qwer@123\"\n}",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"400\"> <li></li> </ol>"
          },
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "Status",
            "description": "<p>false.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": "  \n {\n        \"Code\": 400,\n\t\"Status\": false,\n\t\"Message\": \"Invalid Parameters\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "./input/signup.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "/getDegree",
    "title": "Get Degree",
    "name": "getDegree",
    "group": "Dropdown_Api",
    "description": "<p>Get degree</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "TOKEN",
            "description": "<ul> <li>A token send by header as TOKEN</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Status",
            "description": "<p>True.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>The request is OK.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Data",
            "description": "<p>State data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": " HTTP/1.1 success\n{\n    \"Code\": 200,\n    \"Status\": true,\n    \"Message\": \"Request is OK\",\n    \"Data\": [\n        {\n            \"_id\": \"599c0356775aea7c4b74645d\",\n            \"name\": \"Bachelor of Arts\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c035e775aea7c4b74645e\",\n            \"name\": \"Bachelor of Science\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c035e775aea7c4b74645f\",\n            \"name\": \"Master\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c035e775aea7c4b746460\",\n            \"name\": \"Juris Doctor\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c035e775aea7c4b746461\",\n            \"name\": \"Doctorate\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c035f775aea7c4b746462\",\n            \"name\": \"Other\",\n            \"status\": true\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>Status.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": " \n{\n   \"Code\": 400,\n\"Status\": false,\n\"Message\": \"Oops!! Something went wrong\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./input/get_degree.js",
    "groupTitle": "Dropdown_Api"
  },
  {
    "type": "get",
    "url": "/getEmploymentType",
    "title": "Get Employment Type",
    "name": "getEmploymentType",
    "group": "Dropdown_Api",
    "description": "<p>Get Employment Type</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "TOKEN",
            "description": "<ul> <li>A token send by header as TOKEN</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Status",
            "description": "<p>True.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>The request is OK.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Data",
            "description": "<p>State data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": " HTTP/1.1 success\n{\n    \"Code\": 200,\n    \"Status\": true,\n    \"Message\": \"Request is OK\",\n    \"Data\": [\n        {\n            \"_id\": \"599c055f775aea7c4b74646a\",\n            \"name\": \"Part-time\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c055f775aea7c4b74646b\",\n            \"name\": \"Full time\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c055f775aea7c4b74646c\",\n            \"name\": \"Permanent\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c0560775aea7c4b74646d\",\n            \"name\": \"Contract\",\n            \"status\": true\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>Status.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": " \n{\n   \"Code\": 400,\n\"Status\": false,\n\"Message\": \"Oops!! Something went wrong\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./input/get_employment_type.js",
    "groupTitle": "Dropdown_Api"
  },
  {
    "type": "get",
    "url": "/getInterestedInHiring",
    "title": "Get Interested in hiring dropdown",
    "name": "getInterestedInHiring",
    "group": "Dropdown_Api",
    "description": "<p>Get Interested in hiring dropdown</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "TOKEN",
            "description": "<ul> <li>A token send by header as TOKEN</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Status",
            "description": "<p>True.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>The request is OK.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Data",
            "description": "<p>State data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": " HTTP/1.1 success\n{\n    \"Code\": 200,\n    \"Status\": true,\n    \"Message\": \"Request is OK\",\n    \"Data\": [\n        {\n            \"_id\": \"599c05f2775aea7c4b74646e\",\n            \"name\": \"Attorneys\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c05f2775aea7c4b74646f\",\n            \"name\": \"Paralegals\",\n            \"status\": true\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>Status.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": " \n{\n   \"Code\": 400,\n\"Status\": false,\n\"Message\": \"Oops!! Something went wrong\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./input/get_interested_in_hiring.js",
    "groupTitle": "Dropdown_Api"
  },
  {
    "type": "get",
    "url": "/getPracticeArea",
    "title": "Get PracticeArea",
    "name": "getPracticeArea",
    "group": "Dropdown_Api",
    "description": "<p>Get Practice Area</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "TOKEN",
            "description": "<ul> <li>A token send by header as TOKEN</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Status",
            "description": "<p>True.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>The request is OK.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Data",
            "description": "<p>State data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": " HTTP/1.1 success\n{\n    \"Code\": 200,\n    \"Status\": true,\n    \"Message\": \"Request is OK\",\n    \"Data\": [\n        {\n            \"_id\": \"599c045e775aea7c4b746463\",\n            \"name\": \"Administrative Law\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c045e775aea7c4b746464\",\n            \"name\": \"Admiralty and Maritime Law\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c045e775aea7c4b746465\",\n            \"name\": \"Agricultural Law\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c045e775aea7c4b746466\",\n            \"name\": \"Alternative Dispute Resolution\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c045e775aea7c4b746467\",\n            \"name\": \"Antitrust and Trade Regulation\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c045e775aea7c4b746468\",\n            \"name\": \"Appellate Practice\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c0460775aea7c4b746469\",\n            \"name\": \"Aviation and Aerospace Law\",\n            \"status\": true\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>Status.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": " \n{\n   \"Code\": 400,\n\"Status\": false,\n\"Message\": \"Oops!! Something went wrong\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./input/get_practice_area.js",
    "groupTitle": "Dropdown_Api"
  },
  {
    "type": "get",
    "url": "/getSkills",
    "title": "Get Settings",
    "name": "getSettings",
    "group": "Dropdown_Api",
    "description": "<p>Get Settings</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "TOKEN",
            "description": "<ul> <li>A token send by header as TOKEN</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Status",
            "description": "<p>True.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>The request is OK.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Data",
            "description": "<p>State data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": " HTTP/1.1 success\n{\n    \"Code\": 200,\n    \"Status\": true,\n    \"Message\": \"The request is OK\",\n    \"Data\": [\n        {\n            \"_id\": \"59e0b147a8bcf9b0e1d0bfcc\",\n            \"name\": \"on-site\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"59e0b166a8bcf9b0e1d0bfcd\",\n            \"name\": \"off-site\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"59e0b171a8bcf9b0e1d0bfce\",\n            \"name\": \"on-site or off-site\",\n            \"status\": true\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>Status.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": " \n{\n   \"Code\": 400,\n\"Status\": false,\n\"Message\": \"Oops!! Something went wrong\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./input/get_setting.js",
    "groupTitle": "Dropdown_Api"
  },
  {
    "type": "get",
    "url": "/getSkills",
    "title": "Get Skills",
    "name": "getSkills",
    "group": "Dropdown_Api",
    "description": "<p>Get Skills</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "TOKEN",
            "description": "<ul> <li>A token send by header as TOKEN</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Status",
            "description": "<p>True.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>The request is OK.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Data",
            "description": "<p>State data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": " HTTP/1.1 success\n{\n    \"Code\": 200,\n    \"Status\": true,\n    \"Message\": \"Request is OK\",\n    \"Data\": [\n        {\n            \"_id\": \"599c05f2775aea7c4b74646e\",\n            \"name\": \"Legal Research\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c05f2775aea7c4b74646f\",\n            \"name\": \"Legal Writing\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c05f2775aea7c4b746470\",\n            \"name\": \"Legal Advice\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c05f2775aea7c4b746471\",\n            \"name\": \"Legal Assistance\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c05f2775aea7c4b746472\",\n            \"name\": \"Legal Document Preparation\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c05f2775aea7c4b746473\",\n            \"name\": \"Legal Compliance\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c05f2775aea7c4b746474\",\n            \"name\": \"Legal Translation\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c05f2775aea7c4b746475\",\n            \"name\": \"Legal Opinions\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c05f2775aea7c4b746476\",\n            \"name\": \"Contract Review\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c05f2775aea7c4b746477\",\n            \"name\": \"Litigation\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"599c05f3775aea7c4b746478\",\n            \"name\": \"Class Action Certification and Notice\",\n            \"status\": true\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>Status.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": " \n{\n   \"Code\": 400,\n\"Status\": false,\n\"Message\": \"Oops!! Something went wrong\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./input/get_skills.js",
    "groupTitle": "Dropdown_Api"
  },
  {
    "type": "get",
    "url": "/getState",
    "title": "Get State",
    "name": "getState",
    "group": "Dropdown_Api",
    "description": "<p>Get states</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "TOKEN",
            "description": "<ul> <li>A token send by header as TOKEN</li> </ul>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Code",
            "description": "<ol start=\"200\"> <li></li> </ol>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Status",
            "description": "<p>True.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Message",
            "description": "<p>The request is OK.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Data",
            "description": "<p>State data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response-Example:",
          "content": " HTTP/1.1 success\n{\n    \"Code\": 200,\n    \"Status\": true,\n    \"Message\": \"The request is OK\",\n    \"Data\": [\n        {\n            \"_id\": \"5996e018dfcc980e2e3cf9bd\",\n            \"name\": \"Alaska\",\n            \"abbrev\": \"AK\",\n            \"status\": true\n        },\n        {\n            \"_id\": \"5996e05fdfcc980e2e3cf9be\",\n            \"name\": \"Alabama\",\n            \"abbrev\": \"AL\",\n            \"status\": true\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "Error-Response",
            "description": "<p>Returns a json Object.</p>"
          }
        ],
        "Error-Response Object": [
          {
            "group": "Error-Response Object",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>Status.</p>"
          },
          {
            "group": "Error-Response Object",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sample Error-Response:",
          "content": " \n{\n   \"Code\": 400,\n\"Status\": false,\n\"Message\": \"Oops!! Something went wrong\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./input/get_states.js",
    "groupTitle": "Dropdown_Api"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./doc/main.js",
    "group": "_home_kiwitech_legably_Apidoc_doc_main_js",
    "groupTitle": "_home_kiwitech_legably_Apidoc_doc_main_js",
    "name": ""
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./output/main.js",
    "group": "_home_kiwitech_legably_Apidoc_output_main_js",
    "groupTitle": "_home_kiwitech_legably_Apidoc_output_main_js",
    "name": ""
  }
] });
