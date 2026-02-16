import { Navigate } from 'react-router-dom';

console.log('ProtectedRoute loaded');

export default function ProtectedRoute({ children, requiredRole }) {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  console.log('ProtectedRoute check:')
  console.log('- User:', user)
  console.log('- Token:', token)
  console.log('- Required Role:', requiredRole)

  if (!user || !token) {
    console.warn('No user or token, redirecting to login')
    return <Navigate to="/login" replace />;
  }

  const userData = JSON.parse(user);
  console.log('- User data:', userData)
  console.log('- User role:', userData.role)

  if (requiredRole && userData.role !== requiredRole) {
    console.warn(`User role ${userData.role} doesn't match required role ${requiredRole}`)
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('✅ Protected route access granted')
  return children;
}