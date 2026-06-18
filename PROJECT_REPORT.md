# Document Signature App - Project Report

## Abstract

The Document Signature App is a full-stack web application that enables users to digitally sign PDF documents. The platform allows document owners to upload PDF files, assign signature fields to multiple signers, generate signing links, and collect signatures electronically. Signed documents are automatically generated and stored with a complete audit trail.

## Problem Statement

Traditional document signing processes are time-consuming and require physical presence. Businesses need a secure digital solution to manage signatures remotely while maintaining document integrity and traceability.

## Objectives

* Enable digital document signing
* Eliminate manual paper-based workflows
* Provide secure signer authentication
* Generate legally traceable audit logs
* Create signed PDF documents automatically

## System Architecture

Frontend:
React.js + Tailwind CSS

Backend:
Node.js + Express.js

Database:
PostgreSQL + Prisma ORM

PDF Processing:
PDF-Lib

Authentication:
JWT

## Modules

### Authentication Module

Handles registration, login, JWT generation, and protected routes.

### Document Module

Handles PDF upload, retrieval, deletion, and signed document downloads.

### Signer Module

Manages signer invitations and tracks signing status.

### Signature Field Module

Allows document owners to place signature fields and assign them to specific signers.

### Signature Module

Captures signatures and embeds them into PDF documents.

### Audit Module

Tracks all actions performed on documents.

## Database Design

Main Tables:

* User
* Document
* Signer
* SignatureField
* Signature
* AuditLog

## Workflow

1. Upload PDF
2. Add Signer
3. Place Signature Fields
4. Generate Signing Link
5. Signer Opens Link
6. Sign Assigned Fields
7. Complete Signing
8. Generate Signed PDF
9. Download Signed PDF

## Challenges Faced

* PDF coordinate mapping
* Signature placement accuracy
* Multi-signer workflow
* Prisma relational constraints
* PDF regeneration after updates

## Outcomes

Successfully developed a production-ready digital signature platform with document management, signer assignment, PDF generation, audit tracking, and secure authentication.

## Conclusion

The project demonstrates full-stack development capabilities, database design, authentication, file handling, PDF processing, and real-world workflow implementation. It provides a scalable foundation for enterprise-level document signing systems similar to DocuSign.