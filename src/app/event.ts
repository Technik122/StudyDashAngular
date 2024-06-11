export class Event {
  id?: string;
  name?: string;
  date?: string;
  color?: string;

  constructor(id?: string, name?: string, date?: string, color?: string) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.color = color;
  }
}
