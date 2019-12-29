import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BackendService } from './services/backend.service';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TicketDetailComponent } from './components/ticket/ticket-detail.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { appRoutes } from './routes';
import { CustomErrorHandler } from './services/error-handler';

@NgModule({
    declarations: [
        AppComponent,
        TicketsComponent,
        TicketDetailComponent,
        PageNotFoundComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [BackendService, CustomErrorHandler],
    bootstrap: [AppComponent]
})
export class AppModule {

}
