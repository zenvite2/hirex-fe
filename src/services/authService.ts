class AuthenticationService {

  getToken() {
    return sessionStorage.getItem('token');
  }

  getRole() {
    const role = JSON.parse(sessionStorage.getItem('role'));
    return role ?? "GUEST";
  }

  getUsername() {
    return sessionStorage.getItem('username');
  }

  saveCredentail(credential, account) {
    sessionStorage.setItem("token", credential.token);
    sessionStorage.setItem("role", JSON.stringify(credential.role));
    sessionStorage.setItem('username', account.username);
  }

  clearCredential() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('username');
  }
}

const authService = new AuthenticationService();

export default authService;