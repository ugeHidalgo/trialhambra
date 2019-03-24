import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// External libraries
import { ToastrModule } from 'ngx-toastr'; // Toaster library used to messaging
import { ToastrCustomOptions } from './messages/toastr/toastrCustomOptions';
import { MDBBootstrapModule } from 'angular-bootstrap-md'; // MDBootstrap: Used for modals.
import { AppMaterialsModule } from './app-modules/app-materials.module'; // Angular material design components https://material.angular.io/
import { MatCheckboxComponent } from './components/grid/checkbox/mat-checkbox.component';

// App modules
import { AppRoutingModule } from './app-modules/app-routing.module';
import { AppComponent } from './app.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { PendingChangesGuard } from './guards/pending-changes.guard';

// Services
import { UserService } from './services/user/user.service';
import { GlobalsService } from './globals/globals.service';
import { MessageService } from './services/message/message.service';

// App components
import { PageNotFoundComponent } from './components/main/not-found/not-found.component';
import { MessagesComponent } from './messages/messages/messages.component';
import { MainFooterComponent } from './components/main/main-footer/main-footer.component';
import { DeleteDialogComponent } from './components/dialogs/delete-dialog/delete-dialog.component';
import { SuccessDialogComponent } from './components/dialogs/success-dialog/success-dialog.component';
import { ErrorDialogComponent } from './components/dialogs/error-dialog/error-dialog.component';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { UserComponent } from './login/user/user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { PasswordComponent } from './login/password/password.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from './login/recover-password/recover-password.component';


@NgModule({
  declarations: [
    AppComponent,
    MatCheckboxComponent,
    DeleteDialogComponent,
    SuccessDialogComponent,
    ErrorDialogComponent,
    PageNotFoundComponent,
    MessagesComponent,
    MainFooterComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    DashboardComponent,
    PasswordComponent,
    ForgotPasswordComponent,
    RecoverPasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(new ToastrCustomOptions),
    MDBBootstrapModule.forRoot(),
    AppMaterialsModule,
  ],
  entryComponents: [
    PasswordComponent
  ],
  providers: [
    AuthGuard,
    PendingChangesGuard,
    UserService,
    MessageService,
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    GlobalsService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
