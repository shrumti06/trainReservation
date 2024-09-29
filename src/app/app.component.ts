import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Train Reservation System';
  seats = new Array(80).fill(true); // true represents available seat
  seatsToReserve: number = 1;
  seatRows: boolean[][] = [];

  constructor() {
    this.initializeSeats();
  }

  initializeSeats(): void {
    // Simulating some already booked seats
    this.seats[2] = false;
    this.seats[45] = false;
    this.seats[60] = false;

    this.updateSeatRows();
  }

  updateSeatRows(): void {
    this.seatRows = [];
    for (let i = 0; i < this.seats.length; i += 7) {
      this.seatRows.push(this.seats.slice(i, i + 7));
    }
  }

  reserveSeats(): void {
    if (this.seatsToReserve < 1 || this.seatsToReserve > 7) {
      alert('Please enter a number between 1 and 7.');
      return;
    }

    const reservedSeats = [];
    let count = 0;

    // Reserve seats in the same row if possible
    for (let i = 0; i < this.seatRows.length && count < this.seatsToReserve; i++) {
      const row = this.seatRows[i];
      const availableSeats = row
        .map((available, index) => (available ? i * 7 + index : -1))
        .filter((seatNumber) => seatNumber !== -1);

      if (availableSeats.length >= this.seatsToReserve - count) {
        reservedSeats.push(
          ...availableSeats.slice(0, this.seatsToReserve - count)
        );
        count = this.seatsToReserve;
      }
    }

    // Reserve nearby seats if not available in one row
    if (count < this.seatsToReserve) {
      for (let i = 0; i < this.seats.length && count < this.seatsToReserve; i++) {
        if (this.seats[i]) {
          reservedSeats.push(i);
          count++;
        }
      }
    }

    // Update seat availability
    reservedSeats.forEach((seat) => (this.seats[seat] = false));

    // Refresh seat rows for UI update
    this.updateSeatRows();

    alert(`Reserved Seats: ${reservedSeats.map((s) => s + 1).join(', ')}`);
  }
}
