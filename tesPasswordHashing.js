const User = require('./models/users');

User.hashPassword('myPlainPassword').then((hashedPassword) => {
  console.log(hashedPassword);
});

User.verifyPassword(
  'myPlainPassword',
  '$argon2id$v=19$m=65536,t=5,p=1$ZxzKTlJ7CXv2sG0sFmB9fw$CgIPQwDahquMBwt6vXjXiJUp+zHKo5N/OTRpoERYwb8'
).then((passwordIsCorrect) => {
  console.log(passwordIsCorrect)
})