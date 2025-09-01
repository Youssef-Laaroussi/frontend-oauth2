import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient} from "@angular/common/http";
import {AuthRequest} from "../../shared/models/auth-request.model";
import {AuthResponse} from "../../shared/models/auth-response.model";
import {User} from "../../shared/models/user.model";
import {RegisterRequest} from "../../shared/models/register-request.model";
import {ApiResponse} from "../../shared/models/api-response.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.setCurrentUser(response);
        })
      );
  }

  register(userData: RegisterRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/register`, userData);
  }

  forgotPassword(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/forgot-password?email=${email}`, {});
  }

  resetPassword(token: string, password: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/reset-password?token=${token}&password=${password}`, {});
  }

  verifyEmail(token: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/auth/verify-email?token=${token}`);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/profile`);
  }

  private setCurrentUser(authResponse: AuthResponse): void {
    const user: User = {
      username: authResponse.username,
      email: authResponse.email,
      role: authResponse.role
    };
    this.currentUserSubject.next(user);
  }

  private loadCurrentUser(): void {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      // Load user profile from API or decode from token
      this.getUserProfile().subscribe(
        profile => this.currentUserSubject.next(profile),
        () => this.logout()
      );
    }
  }

  // OAuth2 methods
  initiateGoogleLogin(): void {
    window.location.href = `${this.apiUrl.replace('/api', '')}/oauth2/authorization/google`;
  }

  initiateGithubLogin(): void {
    window.location.href = `${this.apiUrl.replace('/api', '')}/oauth2/authorization/github`;
  }

  handleOAuth2Redirect(token: string): void {
    localStorage.setItem('token', token);
    // Decode token to get user info or fetch from API
    this.getUserProfile().subscribe(
      profile => {
        this.currentUserSubject.next(profile);
      }
    );
  }


}
