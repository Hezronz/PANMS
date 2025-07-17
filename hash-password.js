const bcrypt = require('bcrypt');

bcrypt.hash("student123", 10).then((hash) => {
  console.log("Hashed password:", hash);
});

bcrypt.hash("admin123", 10). then((hash) => {
  console.log("Admin Hashed password:", hash);
})
