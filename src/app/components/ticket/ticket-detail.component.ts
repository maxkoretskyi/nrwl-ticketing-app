import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { concat, of } from 'rxjs';
import { catchError, concatMap, switchMap, tap } from 'rxjs/operators';
import { BackendService, Ticket, User } from '../../services/backend.service';
import { CustomErrorHandler } from '../../services/error-handler';

@Component({
    selector: 'ticket-comp',
    templateUrl: './ticket-detail.component.html',
    styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {
    ticket: Ticket;
    users: User[];
    isSaving: boolean;
    isLoading: boolean;
    error: { desc: string };

    constructor(private backend: BackendService,
                private route: ActivatedRoute,
                private location: Location,
                private router: Router,
                private errorHandler: CustomErrorHandler) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.isLoading = true;
        this.error = null;

        this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
                const id = Number(params.get('id'));
                return (id > 0) ?
                    this.backend.ticket(id) :
                    of({id, completed: false, description: '', assigneeId: null});
            }),
            tap((ticket: Ticket) => {
                this.ticket = {...ticket};
            }),
            catchError((err) => {
                this.errorHandler.handleError(err);
                this.error = {desc: 'Cannot load a ticket'};
                return of(null);
            }),
            tap(() => {
                this.isLoading = false;
            })
        ).subscribe();

        this.backend.users().pipe(
            tap((users) => {
                this.users = users;
            }),
            catchError((err) => {
                this.errorHandler.handleError(err);
                return of(null);
            })
        ).subscribe();
    }

    save() {
        this.isSaving = true;

        if (this.isNewTicket()) {
            this.backend.newTicket({...this.ticket}).pipe(
                concatMap((ticket) => {
                    return this.backend.assign(Number(ticket.id), this.ticket.assigneeId);
                }),
                concatMap((ticket) => {
                    return this.backend.complete(Number(ticket.id), this.ticket.completed);
                }),
                tap((ticket) => {
                    this.isSaving = false;
                    this.router.navigate([`/tickets/${ticket.id}`]);
                }),
                catchError((err) => {
                    this.isSaving = false;
                    this.errorHandler.handleError(err);
                    return of(null);
                })
            ).subscribe();
        } else {
            concat(
                this.backend.assign(Number(this.ticket.id), this.ticket.assigneeId),
                this.backend.complete(Number(this.ticket.id), this.ticket.completed)
            ).pipe(
                catchError((err) => {
                    this.errorHandler.handleError(err);
                    return of(null);
                }),
                tap(() => {
                    this.isSaving = false;
                })
            ).subscribe();
        }
    }

    isNewTicket() {
        return this.ticket.id === 0;
    }

    updateCompeted(event) {
        this.ticket.completed = event.target.checked;
    }

    updateDescription(event) {
        this.ticket.description = event.target.value;
    }

    updateAssignee(event) {
        this.ticket.assigneeId = Number(event.target.value);
    }
}
