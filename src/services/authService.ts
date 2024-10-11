class AuthenticationService {

  getAccessToken() {
    return sessionStorage.getItem('accessToken');
  }

  getRefreshAccessToken() {
    return sessionStorage.getItem('accessToken');
  }

  getRole() {
    const role = JSON.parse(sessionStorage.getItem('role'));
    return role ?? "GUEST";
  }

  getUsername() {
    return sessionStorage.getItem('username');
  }

  saveCredential(credential: { accessToken: string, refreshToken: string, role: string, username: string }) {
    sessionStorage.setItem("accessToken", credential.accessToken);
    sessionStorage.setItem("refreshToken", credential.refreshToken);
    sessionStorage.setItem("role", JSON.stringify(credential.role));
    sessionStorage.setItem('username', JSON.stringify(credential.username));
  }

  clearCredential() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('username');
  }
}

const authService = new AuthenticationService();

export default authService;