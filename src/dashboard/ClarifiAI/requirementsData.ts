export const requirementsData =[
  {
    "Functional Requirements": [
      {
        "requirement_id": "FR001",
        "requirement_text": "System shall provide an option for the Card Operations team to register school details.",
        "original_text": "An option to be made available for card operations team to register the school details.",
        "source_section": "A. SCHOOL REGISTRATION",
        "page_number": 1,
        "line_number": 14,
        "confidence_score": 1.0,
        "stakeholders": [
          "Operations Team",
          "Admin"
        ]
      },
      {
        "requirement_id": "FR002",
        "requirement_text": "School registration screen shall capture School Name, Location, and School Account Number with NGB.",
        "original_text": "- School Name - Location - School Account Number with NGB",
        "source_section": "A. SCHOOL REGISTRATION",
        "page_number": 1,
        "line_number": 15,
        "confidence_score": 1.0,
        "stakeholders": [
          "Operations Team",
          "Admin"
        ]
      },
      {
        "requirement_id": "FR003",
        "requirement_text": "System shall allow configuration of NGB GL account number internally for GL settlement.",
        "original_text": "NGB GL account number to be configured internally in the system for GL settlement.",
        "source_section": "A. SCHOOL REGISTRATION",
        "page_number": 1,
        "line_number": 19,
        "confidence_score": 0.95,
        "stakeholders": [
          "Admin",
          "Operations Team",
          "NGB (Bank)"
        ]
      },
      {
        "requirement_id": "FR004",
        "requirement_text": "System shall provide an option to register different types of fee payments supported by each school (e.g., School Fee, Bus Fee).",
        "original_text": "An option should be available to register the different type of Fee payments supported by each school. For eg: School Fee, Bus Fee, etc.",
        "source_section": "A. SCHOOL REGISTRATION",
        "page_number": 1,
        "line_number": 20,
        "confidence_score": 1.0,
        "stakeholders": [
          "Operations Team",
          "Admin"
        ]
      },
      {
        "requirement_id": "FR005",
        "requirement_text": "Fee payment page shall list the registered fee types.",
        "original_text": "These fee types should be listed in the fee payment page.",
        "source_section": "A. SCHOOL REGISTRATION",
        "page_number": 1,
        "line_number": 20,
        "confidence_score": 1.0,
        "stakeholders": [
          "Customer",
          "End-user"
        ]
      },
      {
        "requirement_id": "FR006",
        "requirement_text": "System shall provide an option to register student details via Online Banking, Mobile Banking, and Contact Center (using E-Form).",
        "original_text": "An option to be made available to register the student details through Online banking, Mobile Banking and Contact center [using E-Form].",
        "source_section": "B. STUDENT REGISTRATION / AMENDMENT / DE-REGISTRATION",
        "page_number": 1,
        "line_number": 22,
        "confidence_score": 1.0,
        "stakeholders": [
          "Customer",
          "End-user",
          "Contact Center Agent"
        ]
      },
      {
        "requirement_id": "FR007",
        "requirement_text": "System shall allow customers to register more than one student.",
        "original_text": "More than one student can be registered for a customer",
        "source_section": "B. STUDENT REGISTRATION / AMENDMENT / DE-REGISTRATION",
        "page_number": 1,
        "line_number": 24,
        "confidence_score": 1.0,
        "stakeholders": [
          "Customer",
          "End-user"
        ]
      }
    
    ],
    "Non-Functional Requirements": [
      {
        "requirement_id": "NFR001",
        "requirement_text": "Registered student details shall be saved in a common repository to ensure availability across all channels (Online Banking, Mobile Banking, Contact Center).",
        "original_text": "The student registered through Online Banking / Mobile Banking / Contact center should be saved in a common repository so that registered details are available across the channels.",
        "source_section": "B. STUDENT REGISTRATION / AMENDMENT / DE-REGISTRATION",
        "page_number": 1,
        "line_number": 25,
        "confidence_score": 0.95,
        "stakeholders": [
          "IT/Vendor",
          "DevOps",
          "Operations Team"
        ]
      },
      {
        "requirement_id": "NFR002",
        "requirement_text": "System shall maintain transaction logs and details for previous transactions.",
        "original_text": "System should maintain previous transaction logs and transaction details with unique reference number and description.",
        "source_section": "C) FEE PAYMENT",
        "page_number": 2,
        "line_number": 62,
        "confidence_score": 0.95,
        "stakeholders": [
          "Compliance Officer",
          "Admin",
          "NGB (Bank)"
        ]
      },
      {
        "requirement_id": "NFR003",
        "requirement_text": "Last 6 months of fee payment history shall be available in the system.",
        "original_text": "Last 6 month history of fee payment should be available in the system.",
        "source_section": "FEE PAYMENT VIA ONLINE BANKING / MOBILE BANKING",
        "page_number": 2,
        "line_number": 78,
        "confidence_score": 0.95,
        "stakeholders": [
          "Customer",
          "End-user",
          "IT/Vendor"
        ]
      }
    ],
    "Business Rules": [
      {
        "requirement_id": "BR001",
        "requirement_text": "Product team shall send an approved email with necessary school registration details in excel format to the Operations team.",
        "original_text": "Product team should sent an approved email attaching necessary details for registration (mentioned above) in excel format to Operations team.",
        "source_section": "A. SCHOOL REGISTRATION",
        "page_number": 1,
        "line_number": 18,
        "confidence_score": 1.0,
        "stakeholders": [
          "Product Owner",
          "Operations Team"
        ]
      },
      {
        "requirement_id": "BR002",
        "requirement_text": "Customer must have an active credit card to proceed with student registration.",
        "original_text": "Customer should have an active credit card to proceed with the student registration.",
        "source_section": "B. STUDENT REGISTRATION / AMENDMENT / DE-REGISTRATION",
        "page_number": 1,
        "line_number": 23,
        "confidence_score": 1.0,
        "stakeholders": [
          "Customer",
          "NGB (Bank)"
        ]
      }
    ],
    "Ambiguous or Subjective Requirements": [
      {
        "requirement_id": "Q001",
        "requirement_text": "The student name can be voiced out but will require to implement a new IVR module (text to speech) which requires to be checked for cost and feasibility from IT/vendor.",
        "original_text": "The student name can be voiced out but will require to implement a new IVR module(text to speech) which requires to be checked for cost and feasibility from IT/vendor)",
        "reason": "This is a conditional requirement that needs a decision on cost and feasibility. It's not a committed requirement yet.",
        "source_section": "FEE PAYMENT VIA IVR",
        "page_number": 3,
        "line_number": 88,
        "confidence_score": 0.6,
        "stakeholders": [
          "IT/Vendor",
          "Product Owner",
          "NGB (Bank)"
        ]
      }
    ],
    "Other Observations": [
      {
        "observation_id": "OBS001",
        "observation_text": "Repetition of requirement: SMS sending for student registration/amendment/de-registration is mentioned multiple times (Line 27, 36, 51). While triggered by different channels, the core requirement is identical for the SMS content and purpose.",
        "page_number": 1,
        "line_number": 27,
        "confidence_score": 0.9
      },
      {
        "observation_id": "OBS002",
        "observation_text": "Repetition of business rule: Student ID entered twice for verification and no copy-paste is stated multiple times (Line 34, 47a).",
        "page_number": 1,
        "line_number": 34,
        "confidence_score": 0.9
      }
     
    ]
  }
]
