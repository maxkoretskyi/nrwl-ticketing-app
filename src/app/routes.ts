import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TicketDetailComponent } from './components/ticket/ticket-detail.component';
import { TicketsComponent } from './components/tickets/tickets.component';

export const appRoutes: Routes = [
    {
        path: 'tickets',
        component: TicketsComponent
    },
    {
        path: 'tickets/:id',
        component: TicketDetailComponent
    },
    {
        path: '',
        redirectTo: '/tickets',
        pathMatch: 'full'
    },
    {path: '**', component: PageNotFoundComponent}
];
