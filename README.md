Document Signature App
A full-stack digital document signing platform inspired by DocuSign that allows users to upload PDF documents, assign signature fields to signers, collect signatures digitally, generate signed PDFs, and maintain a complete audit trail.
Features
Authentication
•	User Registration
•	User Login
•	JWT Authentication
•	Protected Routes
Document Management
•	Upload PDF Documents
•	View Uploaded Documents
•	Delete Documents
•	Download Signed Documents
Signer Management
•	Add Multiple Signers
•	Generate Secure Signing Links
•	Track Signer Status
Signature Fields
•	Place Signature Fields on PDF
•	Assign Fields to Specific Signers
•	Delete Signature Fields
•	Field Validation
Signing Workflow
•	Draw Signature
•	Upload Signature Image
•	Sign Assigned Fields
•	Prevent Completion Until All Required Fields Are Signed
PDF Processing
•	Embed Signatures into PDF
•	Generate Signed PDFs
•	Download Signed PDFs
•	View Signed PDFs
Audit Trail
•	Document Upload Logs
•	Signer Activity Logs
•	Signature Completion Logs
Tech Stack
Frontend
•	React.js
•	React Router DOM
•	Axios
•	Tailwind CSS
•	React PDF
•	React Signature Canvas
Backend
•	Node.js
•	Express.js
•	Prisma ORM
•	JWT Authentication
•	Multer
Database
•	PostgreSQL
PDF Processing
•	PDF-Lib
Project Structure
document-signature-app/
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── services/
│ │ └── routes/
│
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── services/
│ ├── uploads/
│ ├── signed/
│ └── prisma/
│
└── README.md
Installation
Clone Repository
git clone https://github.com/yourusername/document-signature-app.git
cd document-signature-app
Backend Setup
cd backend
npm install
Frontend Setup
cd frontend
npm install
Environment Variables
Backend .env
DATABASE_URL=your_postgresql_connection
JWT_SECRET=your_secret_key
PORT=5000
EMAIL_USER=your_email
EMAIL_PASS=your_password
Prisma Setup
npx prisma generate
npx prisma migrate dev
Run Backend
npm run dev
Run Frontend
npm run dev
Workflow
1.	User uploads PDF
2.	User adds signer(s)
3.	User places signature fields
4.	Signer opens signing link
5.	Signer creates signature
6.	Signer signs assigned fields
7.	Signed PDF is generated
8.	Audit logs are created
9.	Owner downloads signed PDF
Screenshots
Add screenshots here:
•	Dashboard
•	Upload PDF
•	Manage Signers
•	Place Signature Fields
•	Sign Document
•	Signed PDF
Future Enhancements
•	Email Notifications
•	Reminder Emails
•	Initial Fields
•	Date Fields
•	Text Fields
•	AWS S3 Storage
•	Multi-Tenant Support
Author
Pranav Kumar Reddy
GitHub: https://github.com/Pranav-Reddy29