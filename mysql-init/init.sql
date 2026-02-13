-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Problems table
CREATE TABLE IF NOT EXISTS problems (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    input_format TEXT,
    output_format TEXT,
    constraints TEXT,
    sample_input TEXT,
    sample_output TEXT,
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TestCases table
CREATE TABLE IF NOT EXISTS test_cases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    problem_id INT NOT NULL,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    INDEX idx_problem (problem_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    problem_id INT NOT NULL,
    language VARCHAR(50) NOT NULL,
    code TEXT NOT NULL,
    verdict VARCHAR(50) DEFAULT 'Pending',
    judge_token VARCHAR(255),
    runtime INT,
    memory INT,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_problem (problem_id),
    INDEX idx_verdict (verdict),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample problems
INSERT INTO problems (title, slug, description, input_format, output_format, constraints, sample_input, sample_output, difficulty) VALUES
('Two Sum', 'two-sum', 'Given an array of integers nums and an integer target, return the sum of the two numbers.

Write a program that reads the array and target, then outputs the sum of any two numbers that add up to the target.', 'First line contains n (size of array)
Second line contains n space-separated integers
Third line contains target integer', 'Single integer - the sum of two numbers that add up to target', '2 ≤ n ≤ 10^4
-10^9 ≤ nums[i] ≤ 10^9
-10^9 ≤ target ≤ 10^9', '4
2 7 11 15
9', '9', 'Easy'),

('Reverse String', 'reverse-string', 'Given a string, reverse it and print the result.

Write a program that reads a string and outputs it in reverse order.', 'Single line containing a string (no spaces)', 'Reversed string', '1 ≤ length ≤ 1000
String contains only alphanumeric characters', 'hello', 'olleh', 'Easy'),

('Factorial', 'factorial', 'Calculate the factorial of a given number n.

Write a program that reads an integer n and outputs n! (n factorial).', 'Single integer n', 'Single integer representing n!', '0 ≤ n ≤ 20', '5', '120', 'Easy');

-- Insert test cases for Two Sum
INSERT INTO test_cases (problem_id, input, expected_output, is_hidden) VALUES
(1, '4\n2 7 11 15\n9', '9', FALSE),
(1, '3\n1 2 3\n4', '4', FALSE),
(1, '5\n-1 -2 -3 -4 -5\n-8', '-8', TRUE);

-- Insert test cases for Reverse String
INSERT INTO test_cases (problem_id, input, expected_output, is_hidden) VALUES
(2, 'hello', 'olleh', FALSE),
(2, 'world', 'dlrow', FALSE),
(2, 'abc', 'cba', TRUE);

-- Insert test cases for Factorial
INSERT INTO test_cases (problem_id, input, expected_output, is_hidden) VALUES
(3, '5', '120', FALSE),
(3, '0', '1', FALSE),
(3, '10', '3628800', TRUE);
