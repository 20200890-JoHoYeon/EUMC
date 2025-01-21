// import {
//   ConnectedSocket,
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WsResponse,
// } from '@nestjs/websockets';
// import { Socket } from 'net';
// import { from, map, Observable } from 'rxjs';
//
// @WebSocketGateway(9999)
// export class TicketTcpGateway {
//
//
//   @SubscribeMessage('events')
//   handleEvent(
//     @MessageBody() data: string,
//     @ConnectedSocket() client: Socket,
//   ): string {
//
//     client.emit('events', { name: 'Nest' },
//       (data) => console.log(data)
//     );
//
//     return data;
//   }
//
//   @SubscribeMessage('events')
//   onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
//     const event = 'events';
//     const response = [1, 2, 3];
//
//     return from(response).pipe(map((data) => ({ event, data })));
//   }
// }
