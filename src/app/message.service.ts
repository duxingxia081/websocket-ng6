import {Injectable} from '@angular/core';
import {Client, Frame, Message} from 'stompjs';

import * as stompjs from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Subject} from 'rxjs';

@Injectable()
export class MessageService {

  private messageSource = new Subject<string>();
  messageReceived = this.messageSource.asObservable();
  token = 'Bearer:eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwiZXhwIjoxNTI4ODc4NDY0fQ.0hq4N9ksxWJW8ElQoKABZZswHDuBElkbM7DpCwRTrB25_TghaOFmNJc7jG1a1E4xloxlZveE-fRyOZGjkqzSng';


  stompClient: Client;

  constructor() {
    const socket = new SockJS('http://localhost:9999/socket') as WebSocket;
    this.stompClient = stompjs.over(socket);
    this.stompClient.connect({'authorization': this.token}, (frame: Frame) => {
      this.stompClient.subscribe('/user/topic/message', (message: Message) => {
        this.onMessage(message);
      });
    });
  }


  private onMessage(message: Message) {
    let json = JSON.parse(message.body);
    this.messageSource.next(json.message);
  }


}
