-- KodBank database schema (run against your Aiven MySQL instance)

CREATE TABLE IF NOT EXISTS customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100),
  customer_password VARCHAR(255),
  balance DECIMAL(10,2) DEFAULT 1000,
  email VARCHAR(150) UNIQUE
);

CREATE TABLE IF NOT EXISTS jwt_tokens (
  token_id INT AUTO_INCREMENT PRIMARY KEY,
  token_value TEXT,
  customer_id INT,
  expiry_time DATETIME,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
