CREATE DATABASE IF NOT EXISTS interapt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE interapt;

-- One row per learning module (e.g. 'pohl', 'precession').
-- module_name in api/config.php selects which row is active.
CREATE TABLE IF NOT EXISTS modules (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users are unique per module — same username is allowed in different modules.
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  module_id   INT NOT NULL,
  username    VARCHAR(100) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_per_module (module_id, username),
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- One row per page visit. The unique key makes saving idempotent: a visit sent twice is stored once.
-- started_at comes from the browser, in UTC with milliseconds; received_at is the server's clock.
CREATE TABLE IF NOT EXISTS page_visits (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  route       VARCHAR(100) NOT NULL,
  subpage     VARCHAR(20),
  query       VARCHAR(255) NOT NULL DEFAULT '',
  duration_s  DECIMAL(10, 2),
  started_at  DATETIME(3) NOT NULL,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_visit (user_id, route, started_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- One row per submitted answer, for learning questions and tests alike.
-- unit_id is the learning section or the test (e.g. 'e2-damped-oscillation-module').
-- The unique key makes saving idempotent, and as tests always use attempt_no 1
-- it also enforces their single submission.
CREATE TABLE IF NOT EXISTS question_attempts (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  kind           ENUM('learning', 'test') NOT NULL,
  unit_id        VARCHAR(100) NOT NULL,
  question_id    VARCHAR(100) NOT NULL,
  attempt_no     INT NOT NULL,
  is_correct     BOOLEAN NOT NULL,
  points_awarded INT,
  max_points     INT,
  answer         JSON,
  correct_answer JSON,
  texts          JSON,
  answered_at    DATETIME(3) NOT NULL,
  received_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_attempt (user_id, unit_id, question_id, attempt_no),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
