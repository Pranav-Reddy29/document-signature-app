# API Documentation

Base URL

http://localhost:5000/api

---

## Authentication

### Register

POST /auth/register

Request

{
"name": "John Doe",
"email": "[john@example.com](mailto:john@example.com)",
"password": "123456"
}

Response

{
"id": "user_id",
"name": "John Doe",
"email": "[john@example.com](mailto:john@example.com)",
"token": "jwt_token"
}

---

### Login

POST /auth/login

Request

{
"email": "[john@example.com](mailto:john@example.com)",
"password": "123456"
}

Response

{
"id": "user_id",
"name": "John Doe",
"email": "[john@example.com](mailto:john@example.com)",
"token": "jwt_token"
}

---

## Documents

### Upload Document

POST /documents/upload

Headers

Authorization: Bearer TOKEN

Body

multipart/form-data

file: pdf_file

---

### Get Documents

GET /documents

Headers

Authorization: Bearer TOKEN

---

### Get Document By Id

GET /documents/:id

---

### Delete Document

DELETE /documents/:id

Headers

Authorization: Bearer TOKEN

---

### Download Signed Document

GET /documents/download/:id

---

### View Signed Document

GET /documents/view-signed/:id

---

## Signers

### Add Signer

POST /signers

Request

{
"email": "[signer@example.com](mailto:signer@example.com)",
"documentId": "document_id"
}

---

### Get Signers

GET /signers/:documentId

---

### Get Signer

GET /signers/public/:signerId

---

### Complete Signing

PUT /signers/complete/:signerId

---

## Signature Fields

### Create Field

POST /signature-fields

Request

{
"documentId": "document_id",
"signerId": "signer_id",
"page": 1,
"x": 100,
"y": 200,
"width": 180,
"height": 80
}

---

### Get Document Fields

GET /signature-fields/document/:documentId

---

### Get Signer Fields

GET /signature-fields/document/:documentId/signer/:signerId

---

### Delete Field

DELETE /signature-fields/:fieldId

---

## Signatures

### Create Signature

POST /signatures

Request

{
"documentId": "document_id",
"signerId": "signer_id",
"fieldId": "field_id",
"imageData": "base64_image"
}

---

### Get Signatures

GET /signatures/:documentId

---

### Delete Signature

DELETE /signatures/:signatureId

---

## Audit Logs

### Get Logs

GET /documents/audit/:documentId

Returns all document activity logs.
