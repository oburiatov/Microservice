import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as io from 'socket.io-client';
import { log } from 'util';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connectToSocketIO: () => io.Socket;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(0);
    const httpServer = app.getHttpServer();
    connectToSocketIO = () =>
      io.connect(`http://127.0.0.1:${httpServer.address().port}`, {
        transports: ['websocket'],
        forceNew: true,
      });
  });

  afterEach(async () => {
    await app.close();
  });

  it('should connect and disconnect', (done) => {
    const socket = connectToSocketIO();

    socket.on('connect', () => {
      socket.disconnect();
    });

    socket.on('disconnect', (reason) => {
      expect(reason).toBe('io client disconnect');
      done();
    });
    socket.on('error', done);
  });

  it('has fields lists and notes', (done) => {
    const socket = connectToSocketIO();
    socket.on('data', (responce) => {
      console.log({ responseData: responce });
      expect(responce).toHaveProperty('lists');
      expect(responce).toHaveProperty('notes');
      if (responce.lists.length > 0) {
        expect(responce.lists[0]).toHaveProperty('id');
        expect(responce.lists[0]).toHaveProperty('listName');
      }
      if (responce.notes.length > 0) {
        expect(responce.notes[0]).toHaveProperty('listId');
        expect(responce.notes[0]).toHaveProperty('id');
        expect(responce.notes[0]).toHaveProperty('noteName');
        expect(responce.notes[0]).toHaveProperty('dateCreate');
        expect(responce.notes[0]).toHaveProperty('deadline');
        expect(responce.notes[0]).toHaveProperty('dateComplation');
        expect(responce.notes[0]).toHaveProperty('important');
        expect(responce.notes[0]).toHaveProperty('status');
      }

      socket.disconnect();
      done();
    });
    socket.emit('get_lists_and_notes', 9);
  });
  it('create note test', (done) => {
    const socket = connectToSocketIO();
    socket.on('dataUPD', (responce) => {
      console.log({ dataUPD: responce });
      expect(responce).toBeGreaterThanOrEqual(-1);
      socket.disconnect();
      done();
    });
    socket.emit('createNote', {
      googleIdentify: 9,
      noteName: 'string',
      createDate: '24536475343243',
      deadlineTask: '134256453423',
      importantTask: true,
      statusComp: false,
      idlist: null,
    });
  });
  it('update note test', (done) => {
    const socket = connectToSocketIO();
    socket.on('noteUPD', (responce) => {
      console.log({ noteUPD: responce });
      expect(
        responce == 'Note update' || responce == 'Note can`t be update',
      ).toBe(true);
      socket.disconnect();
      done();
    });
    socket.emit('updateNote', {
      googleIdentify: 9,
      id: 14,
      noteName: 'tested update',
      deadlineTask: 413451345134134,
      dateComplation: 13451345134513,
      importantTask: true,
    });
  });

  it('delete note test', (done) => {
    const socket = connectToSocketIO();
    socket.on('noteDeleted', (responce) => {
      console.log({ deleteNote: responce });
      expect(
        responce == 'Note deleted' || responce == 'Note can`t be delete',
      ).toBe(true);
      socket.disconnect();
      done();
    });
    socket.emit('deleteNote', {
      googleIdentify: 9,
      id: 19,
      dataDelete: 13451345113,
    });
  });
  it('create list test', (done) => {
    const socket = connectToSocketIO();
    socket.on('listCreated', (responce) => {
      console.dir(responce);
      console.dir(typeof responce);
      expect(typeof +responce === 'number').toBe(true);
      socket.disconnect();
      done();
    });
    socket.emit('createList', {
      googleIdentify: 9,
      nameList: 'test list',
    });
  });
  it('update list test', (done) => {
    const socket = connectToSocketIO();
    socket.on('listUpdated', (responce) => {
      expect(
        responce == 'update list' || responce == 'list can`t be update',
      ).toBe(true);
      socket.disconnect();
      done();
    });
    socket.emit('updateList', {
      googleIdentify: 9,
      id: 21,
      nameList: 'test list',
    });
  });
  it('delete list test', (done) => {
    const socket = connectToSocketIO();
    socket.on('listDeleted', (responce) => {
      expect(
        responce == 'delete list' || responce == 'list can`t be deleted',
      ).toBe(true);
      socket.disconnect();
      done();
    });
    socket.emit('deleteList', {
      googleIdentify: 9,
      id: 21,
      dataDelete: 13462572645324,
    });
  });

  it('end test', (done) => {
    done();
  });
});
