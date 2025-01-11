import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@email.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true,
    },
    {
        name: 'sameer ansari',
        email: 'sam3268212@gmil.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false,
    },
    {
        name: 'jane Doe',
        email: 'admin@email.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false,
    }

];

export default users;