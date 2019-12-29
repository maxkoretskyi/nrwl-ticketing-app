import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BackendService, Ticket } from '../../services/backend.service';
import { CustomErrorHandler } from '../../services/error-handler';

@Component({
    selector: 'tickets-comp',
    templateUrl: './tickets.component.html',
    styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
    filteredTickets: Observable<Ticket[]>;
    filteredValue: BehaviorSubject<string>;
    isLoading: boolean;
    error: { desc: string };

    constructor(private backend: BackendService,
                private errorHandler: CustomErrorHandler) {
    }

    ngOnInit() {
        const tickets$ = this.backend.tickets();
        this.filteredValue = new BehaviorSubject('');
        this.isLoading = true;
        this.error = null;

        this.filteredTickets = combineLatest([tickets$, this.filteredValue]).pipe(
            map(([tickets, fragment]) => {
                return tickets.filter(t => t.description.includes(fragment));
            }),
            catchError((err) => {
                this.error = {desc: 'Cannot load tickets'};
                this.errorHandler.handleError(err);
                return of([]);
            }),
            tap(() => {
                this.isLoading = false;
            })
        );
    }

    updateFilteredTickets(event) {
        this.filteredValue.next(event.target.value);
    }
}
