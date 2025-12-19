-- CodeLearn Database Setup Script
-- Run this script to manually set up the database (optional)
-- Note: Hibernate will auto-create tables if spring.jpa.hibernate.ddl-auto=update

-- Create database
CREATE DATABASE code_learn_test;

-- Connect to the database (run this in psql after connecting)
\c code_learn_test

-- Create a dedicated user (optional)
CREATE USER codelearn_user WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE code_learn_test TO codelearn_user;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO codelearn_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO codelearn_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO codelearn_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO codelearn_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO codelearn_user;

-- Note: Tables will be created automatically by Hibernate when you start the Spring Boot application
-- No need to create tables manually unless you want to customize the schema

