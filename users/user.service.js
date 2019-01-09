// users hardcoded for simplicity, store in a db for production applications



const users = [
  { id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' },
  { id: 2, username: 'test2', password: 'test2', firstName: 'Tdfdst', lastName: 'Ufffser' },
  { id: 3, username: 'test3', password: 'tes3', firstName: 'Tefst', lastName: 'Uddddddddser' }
];

module.exports = {
    authenticate,
    getAll
};

async function authenticate({ username, password }) {
      
        const user = users.find(u => u.username === username && u.password === password);
        if(user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
}

async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}
