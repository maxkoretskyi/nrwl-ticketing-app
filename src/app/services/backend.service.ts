import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

/**
 * This service acts as a mock back-end.
 * It has some intentional errors that you might have to fix.
 */

export type User = {
    id: number;
    name: string;
};

export type Ticket = {
    id: number;
    description: string;
    assigneeId: number;
    completed: boolean;
};

function randomDelay() {
    return Math.random() * 4000;
}

@Injectable()
export class BackendService {
    storedTickets: Ticket[] = [
        {
            id: 1,
            description: 'Install a monitor arm',
            assigneeId: 111,
            completed: false
        },
        {
            id: 2,
            description: 'Move the desk to the new location',
            assigneeId: 333,
            completed: false
        }
    ];

    storedUsers: User[] = [
        {id: 111, name: 'Anna'},
        {id: 222, name: 'John'},
        {id: 333, name: 'Nate'},
    ];

    lastId = 2;

    constructor() {
    }

    private findTicketById = id =>
        this.storedTickets.find(ticket => ticket.id === +id);
    private findUserById = id => this.storedUsers.find(user => user.id === +id);

    tickets() {
        return of(this.storedTickets).pipe(delay(randomDelay()));
    }

    ticket(id: number): Observable<Ticket> {
        const ticket = this.findTicketById(id);
        if (ticket !== undefined) {
            return of(ticket).pipe(delay(randomDelay()));
        } else {
            return throwError('Cannot find ticket');
        }
    }

    users() {
        return of(this.storedUsers).pipe(delay(randomDelay()));
    }

    user(id: number) {
        const user = this.findUserById(id);
        if (user !== undefined) {
            return of(user).pipe(delay(randomDelay()));
        } else {
            return throwError('Cannot find user');
        }
    }

    newTicket(payload: { description: string }) {
        const newTicket: Ticket = {
            id: ++this.lastId,
            description: payload.description,
            assigneeId: null,
            completed: false
        };

        return of(newTicket).pipe(
            delay(randomDelay()),
            tap((ticket: Ticket) => this.storedTickets.push(ticket))
        );
    }

    assign(ticketId: number, userId: number) {
        const foundTicket = this.findTicketById(+ticketId);
        const user = this.findUserById(+userId);

        if (foundTicket && user) {
            return of(foundTicket).pipe(
                delay(randomDelay()),
                tap((ticket: Ticket) => {
                    ticket.assigneeId = +userId;
                })
            );
        }

        return throwError(new Error('ticket or user not found'));
    }

    complete(ticketId: number, completed: boolean) {
        const foundTicket = this.findTicketById(+ticketId);
        if (foundTicket) {
            return of(foundTicket).pipe(
                delay(randomDelay()),
                tap((ticket: Ticket) => {
                    ticket.completed = completed;
                })
            );
        }

        return throwError(new Error('ticket not found'));
    }
}
