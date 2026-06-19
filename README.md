# 📄 Document Signature App

A full-stack digital document signing platform inspired by DocuSign that enables users to upload PDF documents, assign signature fields to signers, collect signatures digitally, generate signed PDFs, and maintain a complete audit trail.

---

## 📖 Abstract

The Document Signature App is a full-stack web application that enables users to digitally sign PDF documents. The platform allows document owners to upload PDF files, assign signature fields to multiple signers, generate signing links, and collect signatures electronically. Signed documents are automatically generated and stored with a complete audit trail.

---

## ❗ Problem Statement

Traditional document signing processes are time-consuming and require physical presence. Businesses require a secure digital solution to manage signatures remotely while maintaining document integrity, security, and traceability.

---

## 🎯 Objectives

* Enable digital document signing
* Eliminate manual paper-based workflows
* Provide secure signer authentication
* Generate legally traceable audit logs
* Create signed PDF documents automatically

---

## ✨ Features

### 🔐 Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

### 📄 Document Management

* Upload PDF Documents
* View Uploaded Documents
* Delete Documents
* Download Signed Documents
* View Signed PDFs

### 👥 Signer Management

* Add Multiple Signers
* Generate Secure Signing Links
* Track Signer Status

### ✍️ Signature Fields

* Place Signature Fields on PDF
* Assign Fields to Specific Signers
* Delete Signature Fields
* Field Validation

### 🔄 Signing Workflow

* Draw Signature
* Upload Signature Image
* Sign Assigned Fields
* Prevent Completion Until All Required Fields Are Signed

### 📑 PDF Processing

* Embed Signatures into PDF
* Generate Signed PDFs
* Download Signed PDFs

### 📜 Audit Trail

* Document Upload Logs
* Signer Activity Logs
* Signature Completion Logs

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS
* React PDF
* React Signature Canvas

### Backend

* Node.js
* Express.js
* Prisma ORM
* JWT Authentication
* Multer

### Database

* PostgreSQL

### PDF Processing

* PDF-Lib

---

## 🏗️ System Architecture

```text
Frontend (React.js)
        │
        ▼
Backend (Node.js + Express.js)
        │
        ▼
PostgreSQL Database (Prisma ORM)
        │
        ▼
PDF Processing (PDF-Lib)
```

---

## 📂 Project Structure

```text
document-signature-app/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── routes/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── uploads/
│   ├── signed/
│   └── prisma/
│
└── README.md
```

---

## 🗄️ Database Design

### Main Tables

* User
* Document
* Signer
* SignatureField
* Signature
* AuditLog

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Pranav-Reddy29/document-signature-app.git
cd document-signature-app
```

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
DATABASE_URL=your_postgresql_connection

JWT_SECRET=your_secret_key

PORT=5000

EMAIL_USER=your_email

EMAIL_PASS=your_password
```

---

## 🧩 Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev
```

---

## 🚀 Running the Application

### Start Backend

```bash
npm run dev
```

### Start Frontend

```bash
npm run dev
```

---

## 🔄 Application Workflow

1. Upload PDF Document
2. Add Signers
3. Place Signature Fields
4. Generate Signing Links
5. Signer Opens Link
6. Sign Assigned Fields
7. Complete Signing
8. Generate Signed PDF
9. Create Audit Logs
10. Download Signed PDF

---

# 📚 API Documentation

## Base URL

```text
/api
```

---

## 🔐 Authentication APIs

### Register

```http
POST /auth/register
```

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Login

```http
POST /auth/login
```

Request:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

---

## 📄 Document APIs

### Upload Document

```http
POST /documents/upload
```

### Get Documents

```http
GET /documents
```

### Get Document By ID

```http
GET /documents/:id
```

### Delete Document

```http
DELETE /documents/:id
```

### Download Signed Document

```http
GET /documents/download/:id
```

### View Signed Document

```http
GET /documents/view-signed/:id
```

---

## 👥 Signer APIs

### Add Signer

```http
POST /signers
```

### Get Signers

```http
GET /signers/:documentId
```

### Get Signer

```http
GET /signers/public/:signerId
```

### Complete Signing

```http
PUT /signers/complete/:signerId
```

---

## ✍️ Signature Field APIs

### Create Field

```http
POST /signature-fields
```

Request:

```json
{
  "documentId": "document_id",
  "signerId": "signer_id",
  "page": 1,
  "x": 100,
  "y": 200,
  "width": 180,
  "height": 80
}
```

### Get Document Fields

```http
GET /signature-fields/document/:documentId
```

### Get Signer Fields

```http
GET /signature-fields/document/:documentId/signer/:signerId
```

### Delete Field

```http
DELETE /signature-fields/:fieldId
```

---

## ✒️ Signature APIs

### Create Signature

```http
POST /signatures
```

Request:

```json
{
  "documentId": "document_id",
  "signerId": "signer_id",
  "fieldId": "field_id",
  "imageData": "base64_image"
}
```

### Get Signatures

```http
GET /signatures/:documentId
```

### Delete Signature

```http
DELETE /signatures/:signatureId
```

---

## 📜 Audit Log APIs

### Get Logs

```http
GET /documents/audit/:documentId
```

Returns all document activity logs.

---

## ⚠️ Challenges Faced

* PDF coordinate mapping
* Signature placement accuracy
* Multi-signer workflow implementation
* Prisma relational constraints
* PDF regeneration after updates
* Secure signer access handling

---

## ✅ Outcomes

Successfully developed a production-ready digital signature platform featuring:

* Secure authentication
* PDF document management
* Multi-signer workflows
* Signature field assignment
* Signed PDF generation
* Audit trail tracking
* Scalable architecture

---

## 🚀 Future Enhancements

* Email Notifications
* Reminder Emails
* Initial Fields
* Date Fields
* Text Fields
* AWS S3 Storage
* Multi-Tenant Support
* Role-Based Access Control
* Document Templates
* Advanced Audit Reporting

---

## 📷 Screenshots

Add screenshots here:

* Dashboard
* Upload PDF
* Manage Signers
* Place Signature Fields
* Sign Document
* Signed PDF
* Audit Logs

---

## 👨‍💻 Author

**Pranav Kumar Reddy**

GitHub: https://github.com/Pranav-Reddy29

---

## 📝 Conclusion

The Document Signature App demonstrates full-stack development capabilities including authentication, file handling, database design, PDF processing, digital signature workflows, and audit tracking. The platform provides a strong foundation for enterprise-grade electronic document signing solutions similar to DocuSign.
