class AuthenticationService {

  getAccessToken() {
    return sessionStorage.getItem('accessToken');
  }

  getRefreshAccessToken() {
    return sessionStorage.getItem('refreshToken');
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

  saveCredential(credential: { accessToken: string, refreshToken: string, role: string, username: string, userId: number }) {
    sessionStorage.setItem("accessToken", credential.accessToken);
    sessionStorage.setItem("refreshToken", credential.refreshToken);
    sessionStorage.setItem("role", JSON.stringify(credential.role));
    sessionStorage.setItem('username', JSON.stringify(credential.username));
    sessionStorage.setItem('userId', JSON.stringify(credential.userId));
  }

  clearCredential() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userId');
  }
}

const authService = new AuthenticationService();

export default authService;