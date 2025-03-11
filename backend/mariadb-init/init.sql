-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS book_exchange;

-- Grant privileges to root from any host
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION;

-- Create bookuser and grant privileges
CREATE USER IF NOT EXISTS 'bookuser'@'%' IDENTIFIED BY 'bookpassword';
GRANT ALL PRIVILEGES ON book_exchange.* TO 'bookuser'@'%';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;
