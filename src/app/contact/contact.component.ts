import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { VERSION } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent{
  name!: string;
  email!: string;
  number!: string;
  content!: string;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  isntFilledOut() {
    let isntFilled = true;
    if ( this.name !== '' && this.email !== '' && this.content !== '' && this.number !== '') {
      isntFilled = false;
    }
    return isntFilled;
  }

  onSubmit() {
    let data = {
      name: this.name,
      email: this.email,
      subject: 'Message from ' + this.name,
      content: 'Phone Number: ' + this.number + ' Message: ' + this.content
    };

    this.http.post('https://formspree.io/f/xayzadvz', JSON.stringify(data))
      .subscribe(response => {alert('Message Sent!');}, err => { alert('There was an error sending your message. Please try again.'); });

    this.email = '';
    this.name = '';
    this.number = '';
    this.content = '';
  }

}
