# IDP Sample projekt

Tesptrojekt für idp mit .NET 6 API und und Angular frontend. 

Das Testprojekt kann in den beiden Commits geöffnet werden:
* Initial Commit: enthält Sample App mit Wettervorhersage ohne IDP
* With IDP: enthält Sample App mit Wettervorhersage mit IDP


## Websites

* https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow
* https://darutk.medium.com/diagrams-of-all-the-openid-connect-flows-6968e3990660
* https://github.com/manfredsteyer/angular-oauth2-oidc
* https://portal.azure.com/#home

## Frontend starten

Node.js und NPM muss installiert sein.

Terminal öffnen

```bash
cd ./src/frontend
npm install
ng serve -o
```

## Backend starten

.NET6 ASP SDK muss installiert sein

Terminal öffnen

```bash
cd ./src/WebApiWithIdp 
dotnet restore
dotnet run
```

