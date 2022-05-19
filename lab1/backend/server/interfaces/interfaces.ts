interface IUserID extends String {
}

interface Note {
  listid: number,
  noteid: number,
  notename: string,
  datecreate: string,
  deadline: string,
  datecomplation: null | string,
  important: boolean,
  status: boolean

  renameProperty(oldName: string, newName: string): object;
}

interface List {
  listid: number,
  listname: string

  renameProperty(oldName: string, newName: string): object;
}

interface UPDNote {
  listId: number,
  id: number,
  noteName: string,
  dateCreate: string,
  deadline: string,
  dateComplation: null | string,
  important: boolean,
  status: boolean

  renameProperty(oldName: string, newName: string): object;
}

interface UPDList {
  id: number,
  listName: string

  renameProperty(oldName: string, newName: string): object;
}

interface IDataSuitier {
  lists: UPDList[],
  notes: UPDNote[]
}


interface ICreateNoteData {
  googleIdentify: number;
  noteName: string;
  createDate: number;
  deadlineTask: number;
  importantTask: boolean;
  statusComp: boolean;
  idlist?: number | null;
}

interface IUpdateNoteData {
  googleIdentify: number;
  id: number;
  noteName: string;
  deadlineTask: number | null;
  dateComplation: number | null;
  importantTask: boolean;
}

interface ICreateList {
  googleIdentify: number;
  nameList: string
}

interface IUpdateList extends ICreateList{
  id: number;
}


interface IDelList {
  googleIdentify: number;
  id: number
  dataDelete: number
}

interface IDelNote {
  googleIdentify: number;
  id: number;
  dataDelete: number
}

interface IUpdateNote {
  googleIdentify: number;
  id: number;
  noteName: string;
  deadlineTask: number | null;
  dateComplation: number | null;
  importantTask: boolean
}
