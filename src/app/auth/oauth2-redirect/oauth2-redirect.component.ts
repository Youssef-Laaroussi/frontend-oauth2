import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-oauth2-redirect',
  templateUrl: './oauth2-redirect.component.html',
  styleUrls: ['./oauth2-redirect.component.css']
})
export class Oauth2RedirectComponent implements OnInit {

  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];

    if (token) {
      this.authService.handleOAuth2Redirect(token);
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Erreur lors de la connexion OAuth2';
      this.isLoading = false;
    }
  }





}
