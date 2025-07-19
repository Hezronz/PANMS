USE panms_db;

INSERT INTO users (name, email, password, role)
VALUES (
  'Hezron',
  'hezron569@gmail.com',
  '$2b$10$EJ6UQqf3QrjH7K1ZcE6gLeX9fQWyNBTayC.thn7aV3bmgbFjBZ7PK',
  'student'
);

DELETE FROM users WHERE email = 'admin@panms.com';

INSERT INTO users (name, email, password, role)
VALUES ('Site Admin2', 'admin123@gmail.com',
        '$2b$10$cKSBHlLEtwETXwwrjhFWBOpFrU6jO8P.DXsbSfDGm.S2uAmPsNHyG',
        'admin');

