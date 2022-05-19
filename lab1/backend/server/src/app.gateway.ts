import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Pool } from 'pg';
import '../interfaces/interfaces';

import { config } from './bdconfig';

function migrate(lists: List[], notes: Note[]): IDataSuitier {
  const res = {
    lists: [],
    notes: [],
  };
  if (lists.length === 0 && notes.length === 0) {
    return res;
  }
  lists.forEach((list) => {
    res['lists'].push({
      id: list.listid,
      listName: list.listname,
    });
  });
  notes.forEach((note) => {
    res.notes.push({
      listId: note.listid,
      id: note.noteid,
      noteName: note.notename,
      dateCreate: note.datecreate,
      deadline: note.deadline,
      dateComplation: note.datecomplation,
      important: note.important,
      status: note.status,
    });
  });
  return res;
}

export const pool = new Pool(config);

// функції які повертають дані з бд
async function getListsAndNotesFromDB(user: IUserID): Promise<IDataSuitier> {
  const notes = await pool.query(`select *
                                  from gettingNotes('${user}')`);
  const lists = await pool.query(`select *
                                  from gettingLists('${user}')`);
  return await migrate(lists.rows, notes.rows);
}

async function createNote(data: ICreateNoteData): Promise<number> {
  const datafrombd = await pool.query(
    `select *
     from settingNote('${data.googleIdentify}',
                      '${data.noteName}',
                      '${data.createDate}',
                      ${data.deadlineTask},
                      '${+data.importantTask}',
                      '${+data.statusComp}'
                          ${data.idlist ? `,'${data.idlist}'` : ''})`,
  );
  return datafrombd.rows[0][Object.keys(datafrombd.rows[0])];
}

async function createList(data: ICreateList) {
  const listID = await pool.query(`select *
                                   from settingList('${data.googleIdentify}', '${data.nameList}')`);
  return listID.rows;
}

async function updateList(data: IUpdateList) {
  const res = await pool.query(`select *
                                from updateList('${data.googleIdentify}', '${data.id}', '${data.nameList}')`);
  return res.rows;
}

async function deleteList(data: IDelList) {
  const res = await pool.query(`select *
                                from deleteList('${data.googleIdentify}', '${data.id}', '${data.dataDelete}')`);
  return res.rows;
}

async function deleteNote(data: IDelNote) {
  const res = await pool.query(`select *
                                from deleteNote('${data.googleIdentify}', '${data.id}', '${data.dataDelete}')`);
  return res.rows;
}

async function updateNote(data: IUpdateNote): Promise<void> {
  const res = await pool.query(`select *
                                from updateNote('${data.googleIdentify}', '${data.id}', '${data.noteName}', ${data.deadlineTask}, ${data.dateComplation}, '${data.importantTask}')`);
  return res.rows;
}

@WebSocketGateway(
  {
    cors: {
      origin: `*`
    }
  })
export class FooGateway {}
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('AppGateway');

  afterInit() {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('get_lists_and_notes')
  async handleList(client: Socket, user: IUserID) {
    console.log("It's backend");
    await client.join(`${user}`);
    const datafrombd = await getListsAndNotesFromDB(user);
    console.log(datafrombd);
    console.log(client.id);
    await this.server.to(`${client.id}`).emit('data', datafrombd);
  }

  @SubscribeMessage('createNote')
  async handleCreateNote(client: Socket, data: ICreateNoteData): Promise<void> {
    console.log("It's backend");
    await client.join(`${data.googleIdentify}`);
    const datafrombd = await createNote(data);
    await this.server.to(`${data.googleIdentify}`).emit('dataUPD', datafrombd);
  }

  @SubscribeMessage('updateNote')
  async handlerNoteUPD(client: Socket, data: IUpdateNoteData) {
    console.log("It's backend");
    const serv = this.server;
    await client.join(`${data.googleIdentify}`);
    const datafrombd = await updateNote(data);
    await serv
      .to(`${data.googleIdentify}`)
      .emit('noteUPD', datafrombd[0][Object.keys(datafrombd[0])]);
  }

  @SubscribeMessage('deleteNote')
  async handleNoteDelete(client: Socket, data: IDelNote): Promise<void> {
    console.log('started deleting note');
    await client.join(`${data.googleIdentify}`);
    const id = await deleteNote(data);
    await console.log(id);
    this.server
      .to(`${data.googleIdentify}`)
      .emit('noteDeleted', id[0][Object.keys(id[0])]);
  }

  @SubscribeMessage('createList')
  async handleListCreate(client: Socket, data: ICreateList): Promise<void> {
    console.log('started creating list');
    await client.join(`${data.googleIdentify}`);
    const id = await createList(data);
    this.server
      .to(`${data.googleIdentify}`)
      .emit('listCreated', id[0][Object.keys(id[0])]);
  }

  @SubscribeMessage('updateList')
  async handleListUPD(client: Socket, data: IUpdateList): Promise<void> {
    console.log('started updating list');
    const serv = this.server;
    await client.join(`${data.googleIdentify}`);
    const id = await updateList(data);
    serv
      .to(`${data.googleIdentify}`)
      .emit('listUpdated', id[0][Object.keys(id[0])]);
  }

  @SubscribeMessage('deleteList')
  async handleListDelete(client: Socket, data: IDelList): Promise<void> {
    console.log('started deleting list');
    const serv = this.server;
    await client.join(`${data.googleIdentify}`);
    const id = await deleteList(data);
    serv
      .to(`${data.googleIdentify}`)
      .emit('listDeleted', id[0][Object.keys(id[0])]);
  }
}
