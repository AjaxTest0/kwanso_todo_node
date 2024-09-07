# Todo List

## Overview

This project is a TypeScript-based application that utilizes Sequelize CLI for database management, including migrations and seeders. The application follows a service pattern for data manipulation and provides a robust API versioning system for better organization.

## Technology Stack

- **TypeScript**
- **Sequelize CLI**: For database management, migrations, and seeders.

## Installation

1. **Clone the Repository**


## Install Dependencies

```bash
npm install
```

## Database Setup

Create the Database

Make sure you have a database named kawanso set up. You can create it using your preferred database management tool or command line.

Run Migrations
Run Seeders

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

## Email and Password for Admin

Email: admin@admin.com
Password: adminpassword

```bash 
npm run dev
```
## Project Structure

src

├── migrations

├── controllers

├── services

└── etc


## Features
Service Pattern: Used for saving and manipulating data.
API Versioning: Ensures proper version control for APIs.
Response Handling: Custom helper functions for bulk sending responses.

