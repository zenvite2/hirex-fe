class AuthenticationService {

  getAccessToken() {
    return sessionStorage.getItem('accessToken');
  }

  getRole() {
    const role = JSON.parse(sessionStorage.getItem('role'));
    return role ?? "GUEST";
  }

  getUsername() {
    return JSON.parse(sessionStorage.getItem('username'));
  }

  getUserId() {
    return JSON.parse(sessionStorage.getItem('userId'));
  }

  saveCredential(credential: { accessToken: string, role: string, username: string, userId: number }) {
    sessionStorage.setItem("accessToken", credential.accessToken);
    sessionStorage.setItem("role", JSON.stringify(credential.role));
    sessionStorage.setItem('username', JSON.stringify(credential.username));
    sessionStorage.setItem('userId', JSON.stringify(credential.userId));
  }

  clearCredential() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userId');
  }
}

const authService = new AuthenticationService();

export default authService;