
export const gherkinData =[
        {
            "requirement_id": "REQ-001",
            "feature": "User Registration",
            "scenarios": [
                {
                    "name": "Successful registration with valid email and phone number",
                    "steps": [
                        "Given the user enters a valid email address",
                        "And the user enters a valid phone number",
                        "When the user submits the registration form",
                        "Then a confirmation message is displayed"
                    ]
                },
                {
                    "name": "Prevent duplicate registration with existing email",
                    "steps": [
                        "Given the user tries to register with an existing email address",
                        "When the user submits the registration form",
                        "Then an error message is displayed indicating duplicate registration"
                    ]
                }
            ],
            "confidence_score": 0.95
        },
        {
            "requirement_id": "REQ-002",
            "feature": "KYC Document Upload",
            "scenarios": [
                {
                    "name": "Successful upload of PDF document",
                    "steps": [
                        "Given the user selects a PDF document",
                        "When the user uploads the document",
                        "Then the document is uploaded successfully",
                        "And a progress indicator is displayed during upload"
                    ]
                },
                {
                    "name": "Error handling for invalid file format",
                    "steps": [
                        "Given the user selects a DOCX document",
                        "When the user uploads the document",
                        "Then an error message is displayed indicating invalid file format"
                    ]
                }
            ],
            "confidence_score": 0.9
        },
        {
            "requirement_id": "REQ-003",
            "feature": "Account Verification Email",
            "scenarios": [
                {
                    "name": "Verification email sent after registration",
                    "steps": [
                        "Given a user has successfully registered",
                        "Then a verification email is sent to the user's email address",
                        "And the email contains a unique activation link"
                    ]
                },
                {
                    "name": "Resend verification email",
                    "steps": [
                        "Given the user did not receive the verification email",
                        "When the user requests a resend",
                        "Then a new verification email is sent"
                    ]
                }
            ],
            "confidence_score": 0.85
        },
        {
            "requirement_id": "REQ-004",
            "feature": "Password Recovery with OTP",
            "scenarios": [
                {
                    "name": "Successful password recovery using OTP",
                    "steps": [
                        "Given the user initiates password recovery",
                        "And the user receives an OTP",
                        "When the user enters the correct OTP",
                        "Then the user can reset their password"
                    ]
                },
                {
                    "name": "OTP request limit",
                    "steps": [
                        "Given the user requests multiple OTPs within a short time",
                        "Then the system blocks further requests for a certain period"
                    ]
                }
            ],
            "confidence_score": 0.9
        }
    ]
