import {Component, OnInit} from '@angular/core';
import {filter, Observable} from "rxjs";
import {WeatherForecast, WeatherService} from "./weather.service";
import {AuthConfig, OAuthService} from "angular-oauth2-oidc";

export const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://devidp-eis.egeli-apps.dev',

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '/index.html',

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: 'ng-weather',

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications.
  // dummyClientSecret: 'secret',

  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  scope: 'openid profile api', // for token refresh add offline_access here and in admin ui

  showDebugInformation: true,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  weatherForecast: Observable<WeatherForecast[]>|undefined;

  constructor(
    private oauthService: OAuthService,
    private weatherService: WeatherService) {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.loadDiscoveryDocumentAndLogin().then();

    // console.log(this.oauthService.getAccessToken())
    this.oauthService.events
      .pipe(filter((e) => e.type === 'token_received'))
      .subscribe((_) => {
        this.oauthService.loadUserProfile()
        this.weatherForecast = this.weatherService.getWeatherForecast();
      });
  }

  ngOnInit(): void {
    this.weatherForecast = this.weatherService.getWeatherForecast();
  }


  get userName(): string|null {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return claims['given_name'];
  }

  get idToken(): string {
    return this.oauthService.getIdToken();
  }

  get idClaims(): any {
    return this.oauthService.getIdentityClaims();
  }

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  refresh() {
    if (authCodeFlowConfig.scope?.includes('offline_access')){
      this.oauthService.refreshToken();
    } else {
      alert('No offline access configured. Offline access is required to refresh token.')
    }
  }

}
