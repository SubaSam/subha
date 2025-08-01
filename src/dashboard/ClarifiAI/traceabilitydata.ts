
export const traceabilityData =[

        {
            "requirement_id": "REQ-001",
            "requirement_text": "The system must allow users to register using their email address and phone number.",
            "requirement_type": "Functional",
            "confidence_score": 1,
            "llm_check_passed": true,
            "validation_issues": [],
            "user_story": "As a new user, I want to register using my email address and phone number, so that I can create an account.",
            "acceptance_criteria": [
                "The system should accept valid email addresses.",
                "The system should accept valid phone numbers.",
                "A unique username should be automatically generated or chosen by user upon registration.",
                "The system should prevent duplicate email and phone number registrations."
            ],
            "gherkin_feature": "User Registration",
            "gherkin_scenarios": [
                {
                    "name": "Successful registration with valid email and phone number",
                    "steps": [
                        "Given the user enters a valid email address",
                        "And the user enters a valid phone number",
                        "When the user submits the registration form",
                        "Then the system confirms successful registration"
                    ]
                },
                {
                    "name": "Unsuccessful registration with duplicate email",
                    "steps": [
                        "Given the user enters an existing email address",
                        "And the user enters a valid phone number",
                        "When the user submits the registration form",
                        "Then the system displays an error message indicating duplicate email"
                    ]
                }
            ]
        },
        {
            "requirement_id": "REQ-002",
            "requirement_text": "Users shall be able to upload KYC documents in PDF or JPG format.",
            "requirement_type": "Functional",
            "confidence_score": 1,
            "llm_check_passed": true,
            "validation_issues": [],
            "user_story": "As a user, I want to upload KYC documents in PDF or JPG format, so that I can verify my identity.",
            "acceptance_criteria": [
                "The system should accept PDF and JPG files only.",
                "The system should display an error message if the file format is invalid.",
                "The system should have a file size limit for uploads.",
                "Uploaded files should be displayed to the user for verification"
            ],
            "gherkin_feature": "KYC Document Upload",
            "gherkin_scenarios": [
                {
                    "name": "Successful KYC document upload",
                    "steps": [
                        "Given the user selects a valid PDF file",
                        "When the user uploads the document",
                        "Then the system confirms successful upload"
                    ]
                },
                {
                    "name": "Unsuccessful KYC document upload with unsupported file type",
                    "steps": [
                        "Given the user selects a file with an unsupported format (e.g., DOC)",
                        "When the user uploads the document",
                        "Then the system displays an error message indicating unsupported file type"
                    ]
                }
            ]
        },
        {
            "requirement_id": "REQ-003",
            "requirement_text": "The portal should send verification emails after registration.",
            "requirement_type": "Functional",
            "confidence_score": 1,
            "llm_check_passed": true,
            "validation_issues": [],
            "user_story": "As a new user, I want to receive a verification email after registration, so that I can confirm my email address.",
            "acceptance_criteria": [
                "A verification email should be sent immediately after successful registration.",
                "The email should contain a unique verification link.",
                "The link should expire after 24 hours.",
                "The system should handle email delivery failures gracefully."
            ],
            "gherkin_feature": "Email Verification",
            "gherkin_scenarios": [
                {
                    "name": "Successful email verification",
                    "steps": [
                        "Given a new user has registered",
                        "When the user clicks the verification link in the email",
                        "Then the user's email is verified"
                    ]
                }
            ]
        },
        {
            "requirement_id": "REQ-004",
            "requirement_text": "The system must support password recovery via OTP.",
            "requirement_type": "Functional",
            "confidence_score": 1,
            "llm_check_passed": true,
            "validation_issues": [],
            "user_story": "As a user, I want to recover my password using an OTP, so that I can regain access to my account.",
            "acceptance_criteria": [
                "The system should send an OTP to the registered phone number.",
                "The user should be able to reset their password using the OTP.",
                "The OTP should expire after 5 minutes.",
                "The system should prevent brute-force attacks by limiting the number of OTP requests."
            ],
            "gherkin_feature": "Password Recovery",
            "gherkin_scenarios": [
                {
                    "name": "Successful password recovery with OTP",
                    "steps": [
                        "Given the user requests a password reset",
                        "And the user receives an OTP",
                        "When the user enters the correct OTP and sets a new password",
                        "Then the user can log in with the new password"
                    ]
                },
                {
                    "name": "Unsuccessful password recovery with incorrect OTP",
                    "steps": [
                        "Given the user requests a password reset",
                        "And the user receives an OTP",
                        "When the user enters an incorrect OTP",
                        "Then the system displays an error message"
                    ]
                }
            ]
        }
    ]
  
    