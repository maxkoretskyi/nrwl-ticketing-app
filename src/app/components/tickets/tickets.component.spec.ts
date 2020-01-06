import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { asyncScheduler, of } from 'rxjs';
import { BackendService } from '../../services/backend.service';
import { CustomErrorHandler } from '../../services/error-handler';
import { TicketsComponent } from './tickets.component';

class BackendServiceStub {
    mockTickets = [
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

    tickets() {
        return of([...this.mockTickets], asyncScheduler);
    }
}

function initTicketsComponent(fixture) {
    // run ngOnInit requesting tickets from backend
    fixture.detectChanges();

    // bypass `delay` operator in backend method
    tick();

    // render DOM
    fixture.detectChanges();
}

describe('TicketsComponent (integration test)', () => {
    let component: TicketsComponent;
    let fixture: ComponentFixture<TicketsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TicketsComponent],
            providers: [
                {provide: BackendService, useClass: BackendServiceStub},
                CustomErrorHandler
            ],
            imports: [RouterTestingModule],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(TicketsComponent);
                component = fixture.componentInstance;
            });
    }));

    it('should show filtered tickets', fakeAsync(() => {
            initTicketsComponent(fixture);

            fixture.componentInstance.filteredValue.next('');

            const element = fixture.debugElement.nativeElement;
            let ticketContainer = element.querySelectorAll('.ticket-container');

            expect(ticketContainer.length).toEqual(2);

            fixture.componentInstance.filteredValue.next('Move');
            fixture.detectChanges();

            ticketContainer = element.querySelectorAll('.ticket-container');
            const ticketDetails = element.querySelector('.ticket-details');
            const ticketDetailsText = ticketDetails.textContent;

            expect(ticketContainer.length).toEqual(1);
            expect(ticketDetails).not.toBeUndefined();
            expect(ticketDetailsText.includes('Move the desk to the new location')).toBe(true);
        }
    ));
});
