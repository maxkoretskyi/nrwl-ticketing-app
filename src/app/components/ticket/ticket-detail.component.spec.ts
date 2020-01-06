import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick, inject } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { asyncScheduler, of } from 'rxjs';
import { BackendService } from '../../services/backend.service';
import { CustomErrorHandler } from '../../services/error-handler';

import { TicketDetailComponent } from './ticket-detail.component';

class BackendServiceStub {
    mockTicket = {
        id: 1,
        description: 'Install a monitor arm',
        assigneeId: 111,
        completed: false
    };

    mockUsers = [
        {id: 111, name: 'Anna'},
        {id: 222, name: 'John'}
    ];

    ticket(id) {
        return of(this.mockTicket, asyncScheduler);
    }

    users() {
        return of([...this.mockUsers]);
    }

    assign(ticketId: number, userId: number) {
        this.mockTicket.assigneeId = +userId;
        return of(this.mockTicket, asyncScheduler);
    }

    complete(ticketId: number, completed: boolean) {
        this.mockTicket.completed = completed;
        return of(this.mockTicket, asyncScheduler);
    }
}

class ActivatedRouteStub {
    paramMapValues = {
        idParamValue: 1,
        get(id) {
            return this.idParamValue;
        }
    };
    paramMap = of(this.paramMapValues);
}

function initTicketDetailComponent(fixture) {
    // run ngOnInit requesting a ticket from backend
    fixture.detectChanges();

    // bypass `delay` operator in backend method and initialize internal Ticket model
    tick();

    // render DOM
    fixture.detectChanges();
}

describe('TicketDetailComponent (integration test)', () => {
    let component: TicketDetailComponent;
    let fixture: ComponentFixture<TicketDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TicketDetailComponent],
            providers: [
                {provide: BackendService, useClass: BackendServiceStub},
                {provide: ActivatedRoute, useClass: ActivatedRouteStub},
                CustomErrorHandler
            ],
            imports: [RouterTestingModule],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(TicketDetailComponent);
                component = fixture.componentInstance;
            });
    }));

    it('should mark a ticket complete', fakeAsync(inject([BackendService, ActivatedRoute],
        (backend: BackendServiceStub, activatedRoute: ActivatedRouteStub) => {

            const ticketId = 1;
            backend.mockTicket.completed = false;
            activatedRoute.paramMapValues.idParamValue = ticketId;

            initTicketDetailComponent(fixture);

            expect(fixture.componentInstance.ticket.id).toEqual(ticketId);
            expect(fixture.componentInstance.ticket.completed).toEqual(false);

            const element = fixture.debugElement.nativeElement;
            const completedCheckbox = element.querySelector('.completed-checkbox');
            completedCheckbox.checked = true;

            const event = new MouseEvent('change');
            completedCheckbox.dispatchEvent(event);
            expect(fixture.componentInstance.ticket.completed).toEqual(true);

            const button = element.querySelector('.btn-save');
            button.click();
            fixture.detectChanges();
            expect(element.querySelector('.saving')).not.toBeNull();

            tick();
            fixture.detectChanges();

            expect(element.querySelector('.saving')).toBeNull();
            expect(fixture.componentInstance.ticket.id).toEqual(ticketId);
            expect(fixture.componentInstance.ticket.completed).toEqual(true);
        }
    )));

    it('should mark assign a user to a ticket', fakeAsync(inject([BackendService, ActivatedRoute],
        (backend: BackendServiceStub, activatedRoute: ActivatedRouteStub) => {
            const originalAssigneeId = backend.mockUsers[0].id;
            const newAssigneeId = backend.mockUsers[1].id;
            const ticketId = 1;
            backend.mockTicket.assigneeId = originalAssigneeId;

            initTicketDetailComponent(fixture);

            expect(fixture.componentInstance.ticket.id).toEqual(ticketId);
            expect(fixture.componentInstance.ticket.assigneeId).toEqual(originalAssigneeId);

            const element = fixture.debugElement.nativeElement;
            const usersSelect = element.querySelector('.users-list');
            usersSelect.value = newAssigneeId;

            const event = new MouseEvent('change');
            usersSelect.dispatchEvent(event);
            expect(fixture.componentInstance.ticket.assigneeId).toEqual(newAssigneeId);

            const button = element.querySelector('.btn-save');
            button.click();
            fixture.detectChanges();
            expect(element.querySelector('.saving')).not.toBeNull();

            tick();
            fixture.detectChanges();

            expect(element.querySelector('.saving')).toBeNull();
            expect(fixture.componentInstance.ticket.id).toEqual(ticketId);
            expect(fixture.componentInstance.ticket.assigneeId).toEqual(newAssigneeId);
        }
    )));
});
