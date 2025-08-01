export interface Requirement {
  requirement_id: string;
  requirement_text: string;
  original_text: string;
  source_section: string;
  page_number: number;
  line_number: number;
}

export const mockRequirements: Requirement[] = [
  {
        "requirement_id": "FR001",
        "requirement_text": "System shall enable NGB Credit Card holders to pay school fees.",
        "original_text": "Customers who have NGB credit card can easily pay for the student\u2019s school fee through Online banking, Mobile banking, IVR and E-Form [via Contact Center agent] and opt for converting the transaction to Easy Payment plan.",
        "source_section": "1. INTRODUCTION",
        "page_number": 1,
        "line_number": 3
      },
      {
        "requirement_id": "FR002",
        "requirement_text": "System shall support school fee payments via Online Banking.",
        "original_text": "Customers who have NGB credit card can easily pay for the student\u2019s school fee through Online banking...",
        "source_section": "1. INTRODUCTION",
        "page_number": 1,
        "line_number": 3
      },
      {
        "requirement_id": "FR003",
        "requirement_text": "System shall support school fee payments via Mobile Banking.",
        "original_text": "...Mobile banking...",
        "source_section": "1. INTRODUCTION",
        "page_number": 1,
        "line_number": 3
      },
      {
        "requirement_id": "FR004",
        "requirement_text": "System shall support school fee payments via IVR.",
        "original_text": "...IVR...",
        "source_section": "1. INTRODUCTION",
        "page_number": 1,
        "line_number": 3
      },
      {
        "requirement_id": "FR005",
        "requirement_text": "System shall support school fee payments via E-Form, facilitated by a Contact Center agent.",
        "original_text": "...E-Form [via Contact Center agent]...",
        "source_section": "1. INTRODUCTION",
        "page_number": 1,
        "line_number": 3
      },
      {
        "requirement_id": "FR006",
        "requirement_text": "System shall allow customers to convert school fee payments to an Easy Payment Plan (EPP).",
        "original_text": "...opt for converting the transaction to Easy Payment plan.",
        "source_section": "1. INTRODUCTION",
        "page_number": 1,
        "line_number": 3
      },
      {
        "requirement_id": "FR007",
        "requirement_text": "System shall provide an option for the Card Operations team to register school details.",
        "original_text": "An option to be made available for card operations team to register the school details.",
        "source_section": "A. SCHOOL REGISTRATION",
        "page_number": 1,
        "line_number": 14
      },
      {
        "requirement_id": "FR007-a",
        "requirement_text": "The school registration screen shall capture 'School Name'.",
        "original_text": "- School Name",
        "source_section": "A. SCHOOL REGISTRATION",
        "page_number": 1,
        "line_number": 15
      },
      {
        "requirement_id": "FR007-b",
        "requirement_text": "The school registration screen shall capture 'Location'.",
        "original_text": "- Location",
        "source_section": "A. SCHOOL REGISTRATION",
        "page_number": 1,
        "line_number": 16
      },
      {
        "requirement_id": "FR007-c",
        "requirement_text": "The school registration screen shall capture 'School Account Number with NGB'.",
        "original_text": "- School Account Number with NGB",
        "source_section": "A. SCHOOL REGISTRATION",
        "page_number": 1,
        "line_number": 17
      },
      {
        "requirement_id": "FR008",
        "requirement_text": "System shall allow internal configuration of NGB GL account numbers for GL settlement.",
        "original_text": "NGB GL account number to be configured internally in the system for GL settlement.",
        "source_section": "A. SCHOOL REGISTRATION",
        "page_number": 1,
        "line_number": 19
      },
      {
        "requirement_id": "FR009",
        "requirement_text": "System shall provide an option to register different types of fee payments supported by each school (e.g., School Fee, Bus Fee).",
        "original_text": "An option should be available to register the different type of Fee payments supported by each school. For eg: School Fee, Bus Fee, etc.",
        "source_section": "A. SCHOOL REGISTRATION",
        "page_number": 1,
        "line_number": 20
      },
      {
        "requirement_id": "FR010",
        "requirement_text": "System shall display registered fee types on the fee payment page.",
        "original_text": "These fee types should be listed in the fee payment page.",
        "source_section": "A. SCHOOL REGISTRATION",
        "page_number": 1,
        "line_number": 20
      },
      {
        "requirement_id": "FR011",
        "requirement_text": "System shall allow student registration via Online Banking.",
        "original_text": "An option to be made available to register the student details through Online banking...",
        "source_section": "B. STUDENT REGISTRATION / AMENDMENT / DE-REGISTRATION",
        "page_number": 1,
        "line_number": 22
      },
      {
        "requirement_id": "FR012",
        "requirement_text": "System shall allow student registration via Mobile Banking.",
        "original_text": "...Mobile Banking...",
        "source_section": "B. STUDENT REGISTRATION / AMENDMENT / DE-REGISTRATION",
        "page_number": 1,
        "line_number": 22
      },
      {
        "requirement_id": "FR013",
        "requirement_text": "System shall allow student registration via Contact Center using an E-Form.",
        "original_text": "...and Contact center [using E-Form].",
        "source_section": "B. STUDENT REGISTRATION / AMENDMENT / DE-REGISTRATION",
        "page_number": 1,
        "line_number": 22
      },
      {
        "requirement_id": "FR014",
        "requirement_text": "System shall allow a customer to register more than one student.",
        "original_text": "More than one student can be registered for a customer...",
        "source_section": "B. STUDENT REGISTRATION / AMENDMENT / DE-REGISTRATION",
        "page_number": 1,
        "line_number": 24
      },
      {
        "requirement_id": "FR015",
        "requirement_text": "System shall capture and associate registered student details under the customer's Relationship Information Management (RIM).",
        "original_text": "...and the student details provided should be captured under the customer RIM.",
        "source_section": "B. STUDENT REGISTRATION / AMENDMENT / DE-REGISTRATION",
        "page_number": 1,
        "line_number": 24
      },
      {
        "requirement_id": "FR016",
        "requirement_text": "System shall allow modification of registered student details.",
        "original_text": "Student details can be modified or de-registered from the registered student list.",
        "source_section": "B. STUDENT REGISTRATION / AMENDMENT / DE-REGISTRATION",
        "page_number": 1,
        "line_number": 26
      },
      {
        "requirement_id": "FR017",
        "requirement_text": "System shall allow de-registration of students from the registered student list.",
        "original_text": "Student details can be modified or de-registered from the registered student list.",
        "source_section": "B. STUDENT REGISTRATION / AMENDMENT / DE-REGISTRATION",
        "page_number": 1,
        "line_number": 26
      },
      {
        "requirement_id": "FR018",
        "requirement_text": "System shall send an SMS notification to the customer upon successful student registration.",
        "original_text": "SMS should be sent to customer during student registration / amendment / de-registration of a student. SMS should be in a predefined format with Student ID, Student Name and School Name.",
        "source_section": "B. STUDENT REGISTRATION / AMENDMENT / DE-REGISTRATION",
        "page_number": 1,
        "line_number": 27
      },
      {
        "requirement_id": "FR019",
        "requirement_text": "System shall send an SMS notification to the customer upon successful student amendment.",
        "original_text": "SMS should be sent to customer during student registration / amendment / de-registration of a student. SMS should be in a predefined format with Student ID, Student Name and School Name.",
        "source_section": "B. STUDENT REGISTRATION / AMENDMENT / DE-REGISTRATION",
        "page_number": 1,
        "line_number": 27
      },
      {
        "requirement_id": "FR020",
        "requirement_text": "System shall send an SMS notification to the customer upon successful student de-registration.",
        "original_text": "SMS should be sent to customer during student registration / amendment / de-registration of a student. SMS should be in a predefined format with Student ID, Student Name and School Name.",
        "source_section": "B. STUDENT REGISTRATION / AMENDMENT / DE-REGISTRATION",
        "page_number": 1,
        "line_number": 27
      },
      {
        "requirement_id": "FR021",
        "requirement_text": "SMS notifications for student registration, amendment, and de-registration shall be in a predefined format including Student ID, Student Name, and School Name.",
        "original_text": "SMS should be sent to customer during student registration / amendment / de-registration of a student. SMS should be in a predefined format with Student ID, Student Name and School Name.",
        "source_section": "B. STUDENT REGISTRATION / AMENDMENT / DE-REGISTRATION",
        "page_number": 1,
        "line_number": 27
      },
      {
        "requirement_id": "FR022",
        "requirement_text": "Online Banking portal shall include a new option for Student Registration.",
        "original_text": "New option should be provided in online banking / mobile banking for Student Registration/ Student Deregistration",
        "source_section": "STUDENT REGISTRATION / AMENDMENT / DEREGISTRATION VIA ONLINE BANKING / MOBILE BANKING",
        "page_number": 1,
        "line_number": 29
      },
      {
        "requirement_id": "FR023",
        "requirement_text": "Online Banking portal shall include a new option for Student De-registration.",
        "original_text": "New option should be provided in online banking / mobile banking for Student Registration/ Student Deregistration",
        "source_section": "STUDENT REGISTRATION / AMENDMENT / DEREGISTRATION VIA ONLINE BANKING / MOBILE BANKING",
        "page_number": 1,
        "line_number": 29
      },
      {
        "requirement_id": "FR024",
        "requirement_text": "Mobile Banking application shall include a new option for Student Registration.",
        "original_text": "New option should be provided in online banking / mobile banking for Student Registration/ Student Deregistration",
        "source_section": "STUDENT REGISTRATION / AMENDMENT / DEREGISTRATION VIA ONLINE BANKING / MOBILE BANKING",
        "page_number": 1,
        "line_number": 29
      },
      {
        "requirement_id": "FR025",
        "requirement_text": "Mobile Banking application shall include a new option for Student De-registration.",
        "original_text": "New option should be provided in online banking / mobile banking for Student Registration/ Student Deregistration",
        "source_section": "STUDENT REGISTRATION / AMENDMENT / DEREGISTRATION VIA ONLINE BANKING / MOBILE BANKING",
        "page_number": 1,
        "line_number": 29
      },
      
  // ...more requirements
];