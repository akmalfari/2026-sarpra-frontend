// Mock data untuk login
export const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@sarpra.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: 2,
    email: 'user@sarpra.com',
    password: 'user123',
    role: 'user',
    name: 'Regular User'
  }
];

// Simulasi login dengan mock data
export const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        resolve({
          success: true,
          data: userWithoutPassword,
          token: 'mock-token-' + user.id
        });
      } else {
        reject({
          success: false,
          message: 'Email atau password salah'
        });
      }
    }, 500);
  });
};