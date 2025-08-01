export const userStoriesData =[
 {
    "requirement_id": "FR-002",
    "requirement": "School registration screen shall capture School Name, Location, and School Account Number with NGB.",
    "confidence_score": 0.9,
    "stories": [
      {
        "story_type": "User Story",
        "user_story": "As a New School Administrator, I want to register our school by providing its name, location, and NGB account number, so that our school can be officially recognized and access system features.",
        "acceptance_criteria": [
          "Given I am on the school registration screen and all required fields are visible and editable,",
          "When I enter a valid 'School Name', a valid 'Location', and a valid 'NGB School Account Number', and submit the form,",
          "Then the school registration details should be successfully saved and I am notified of the successful registration.",
          "Given I am on the school registration screen,",
          "When I attempt to submit the form with 'School Name' left blank,",
          "Then I should see a clear error message indicating that 'School Name' is a required field.",
          "Given I am on the school registration screen,",
          "When I attempt to submit the form with 'Location' left blank,",
          "Then I should see a clear error message indicating that 'Location' is a required field.",
          "Given I am on the school registration screen,",
          "When I attempt to submit the form with an 'NGB School Account Number' that does not meet the specified NGB format/rules,",
          "Then I should see a clear error message indicating that the 'NGB School Account Number' is invalid."
        ],
        "tshirt_size": "XL",
        "questions_for_po": [
          "What are the precise validation rules or format requirements for the 'NGB School Account Number'?",
          "Does 'with NGB' imply an external API call or integration for real-time verification of the School Account Number, or is it purely format/pattern validation?",
          "What level of detail is required for 'Location' (e.g., just city, full address, specific format)?",
          "What is the expected user experience immediately after a successful school registration submission (e.g., redirect to dashboard, confirmation page, email notification)?",
          "Are there any specific security or privacy requirements for the captured school data?"
        ]
      }
    ]
  },
  {
    "requirement_id": "FR-003",
    "requirement": "System shall provide an option to register different types of fee payments supported by each school (e.g., School Fee, Bus Fee).",
    "confidence_score": 0.95,
    "stories": [
      {
        "story_type": "User Story",
        "user_story": "As a School Administrator, I want to define a new type of fee payment, so that I can categorize incoming payments accurately.",
        "acceptance_criteria": [
          "Given I am logged in as a School Administrator and navigate to the fee type management section,",
          "When I provide a unique fee type name (e.g., 'School Fee') and a description, and then save,",
          "Then the new fee type is successfully created and becomes available in the system.",
          "Given I am logged in as a School Administrator and attempt to define a new fee type,",
          "When I provide a fee type name that already exists,",
          "Then an error message is displayed, preventing the creation of duplicate fee type names."
        ],
        "tshirt_size": "S",
        "questions_for_po": [
          "Are there any other mandatory or optional fields required for a fee type, such as a default amount, frequency, or a specific accounting code?",
          "What are the character limits or validation rules for the fee type name and description?"
        ]
      },
      {
        "story_type": "User Story",
        "user_story": "As a School Administrator, I want to view and edit existing fee payment types, so that I can maintain accurate and up-to-date payment categories.",
        "acceptance_criteria": [
          "Given I am logged in as a School Administrator,",
          "When I navigate to the fee type management section,",
          "Then I see a list of all defined fee types, including their names and descriptions.",
          "Given I am viewing the list of fee types and select an existing fee type,",
          "When I modify its name or description and save the changes,",
          "Then the fee type's information is updated successfully.",
          "Given I am editing a fee type,",
          "When I attempt to save a name that conflicts with another existing fee type,",
          "Then an message is displayed, and the changes are not saved."
        ],
        "tshirt_size": "S",
        "questions_for_po": [
          "Can fee types be deleted? If so, what are the implications for historical payment data associated with a deleted fee type?",
          "Should there be an audit trail for changes made to fee types?"
        ]
      },
      {
        "story_type": "User Story",
        "user_story": "As a School Administrator, I want to associate and disassociate specific fee payment types with individual schools, so that each school only offers relevant payment options.",
        "acceptance_criteria": [
          "Given I am managing the settings for a specific school,",
          "When I select an available fee type from a list and associate it with the school,",
          "Then the fee type is successfully linked to that school and appears as an option for it.",
          "Given I am managing the settings for a specific school and viewing its associated fee types,",
          "When I select an associated fee type and choose to disassociate it,",
          "Then the fee type is no longer linked to that school.",
          "Given I am managing the settings for a specific school,",
          "When I attempt to associate a fee type that is already linked to the school,",
          "Then the system prevents the duplicate association or indicates that it is already associated."
        ],
        "tshirt_size": "XL",
        "questions_for_po": [
          "Is there a need to associate multiple fee types with multiple schools simultaneously (bulk association)?",
          "How will a School Administrator navigate to a specific school's settings to perform this action (e.g., via a school list, search)?"
        ]
      }
    ]
  }
]
