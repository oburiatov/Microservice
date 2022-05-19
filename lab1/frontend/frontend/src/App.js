/* eslint-disable no-use-before-define */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-restricted-syntax */
import React from 'react';

import Context from './context';
import { List, AddList, Content, Header } from './components';

const socket = window.io.connect('ws://localhost:3000');

function App() {
  const [lists, setLists] = React.useState([]);
  const [selectedList, setSelectedList] = React.useState(null);
  const [isVisibleForm, setFormVisibility] = React.useState(false);
  const isRemovable = true;
  // console.log('SelListrr', selectedList);

  const [userInfo, setUserInfo] = React.useState(
    JSON.parse(window.localStorage.getItem('authInfo')),
  );

  React.useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('disconnect', () => {
      console.log('disconnected');
    });
    socket.on('listDeleted', (answer) => {
      console.log(answer);
      // eslint-disable-next-line no-use-before-define
      getData();
    });
    socket.on('noteUPD', (answer) => {
      console.log(answer);
      getData();
    });
    socket.on('listCreated', () => {
      getData();
    });
    socket.on('dataUPD', () => {
      getData();
    });
    socket.on('listUpdated', (answer) => {
      console.log(answer);
      getData();
    });
    socket.on('noteDeleted', (answer) => {
      console.log(answer);
      getData();
    });
  });
  React.useEffect(() => {
    const onInit = (auth2) => {
      console.log('init OK', auth2);
    };
    const onError = (err) => {
      console.log('error', err);
    };
    window.gapi.load('auth2', () => {
      window.gapi.auth2
        .init({
          client_id: '295018706889-di2bibdp7gh52vut9vss4garu40bpbdv.apps.googleusercontent.com' //process.env.REACT_APP_GOOGLE_CLIENT_ID,
        })
        .then(onInit, onError);
    });
  });

  async function signIn() {
    const authOK = await function h(user) {
      // console.log('OK AUTH');
      setUserInfo({
        googleUserId: user.getBasicProfile().getId(),
        name: user.getBasicProfile().getName(),
        imgUrl: user.getBasicProfile().getImageUrl(),
        email: user.getBasicProfile().getEmail(),
      });
      // console.log(userInfo);
      window.localStorage.setItem(
        'authInfo',
        JSON.stringify({
          googleUserId: user.getBasicProfile().getId(),
          name: user.getBasicProfile().getName(),
          imgUrl: user.getBasicProfile().getImageUrl(),
          email: user.getBasicProfile().getEmail(),
        }),
      );
      fetch('http://localhost:3000/get', {
        method: 'POST',
        body: JSON.stringify({
          googleUserId: user.getBasicProfile().getId(),
          name: user.getBasicProfile().getName(),
          imgUrl: user.getBasicProfile().getImageUrl(),
          email: user.getBasicProfile().getEmail(),
        }),
      }).then(async (resp) => {
        const r = await resp.text();
        console.log('user', r);
      });
      window.location.reload();
    };

    const authErr = await function h() {
      console.log('err with auth');
    };
    const GoogleAuth = await window.gapi.auth2.getAuthInstance();
    await GoogleAuth.signIn().then(authOK, authErr);
  }

  function signOut() {
    const out = () => {
      setUserInfo(null);
      localStorage.removeItem('authInfo');
    };
    const GoogleAuth = window.gapi.auth2.getAuthInstance();
    GoogleAuth.signOut().then(out);
  }

  function getData() {
    /* axios
      .get('http://localhost:3001/lists?_embed=tasks')
      .then(({ data }) => setLists(data)); */

    socket.once('data', (answer) => {
      let counter = false;
      for (const k of answer.lists) {
        if (!k.id) {
          counter = true;
        }
      }
      if (counter === false)
        answer.lists.push({
          id: null,
          listName: 'Base',
        });
      for (const i of answer.lists) {
        i.tasks = [];
        for (const j of answer.notes) {
          // eslint-disable-next-line eqeqeq
          if (j.listId == i.id) i.tasks.push(j);
        }
      }
      console.log('AAAAAAAAAAAA', answer.lists);
      setLists(answer.lists);
    });
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!userInfo)
      socket.emit(
        'get_lists_and_notes',
        JSON.parse(window.localStorage.getItem('authInfo')).googleUserId,
      );
  }

  React.useEffect(getData, [window.localStorage]);

  function onSaveList(obj) {
    const newLists = [...lists, obj];
    setLists(newLists);
  }

  function onRemove(itemId) {
    const newLists = lists.filter((ll) => ll.id !== itemId);
    setLists(newLists);
  }

  function onChangeTitleInList(listId, newTitle) {
    const newLists = lists.map((list) => {
      if (list.id === listId) {
        list.listName = newTitle;
      }
      return list;
    });

    setLists(newLists);
  }

  function onAddTask(listId, task) {
    const newLists = lists.map((oneList) => {
      if (oneList.id === listId) {
        const newList = oneList;
        newList.tasks = [...oneList.tasks, task];
        return newList;
      }
      return oneList;
    });
    setLists(newLists);
  }

  function onRemoveTask(task) {
    // const path = 'http://localhost:3001/tasks/' + task.id;
    // if (!task.completed) {

    // axios.delete(path).then(() => getData());
    // console.log(task.id);
    /* } else {
      axios
        .patch(path, { deleteDate: Number(new Date().setHours(0, 0, 0, 0)) })
        .then(() => getData());
    } */
    let today = new Date();
    today = Number(today.setHours(0, 0, 0, 0));

    const deleteNoteObj = {
      googleIdentify: JSON.parse(
        window.localStorage.getItem('authInfo'),
      ).googleUserId.toString(),
      id: task.id,
      dataDelete: today,
    };

    socket.emit('deleteNote', deleteNoteObj);
  }

  function onEditTask(task) {
    // eslint-disable-next-line no-alert
    const editTitle = prompt('task title', task.noteName);

    if (editTitle && editTitle !== task.noteName) {
      const changedNoteObj = {
        googleIdentify: JSON.parse(window.localStorage.getItem('authInfo'))
          .googleUserId,
        id: task.id,
        noteName: editTitle,
        deadlineTask: task.deadline,
        dateComplation: task.dateComplation,
        importantTask: task.important,
      };

      socket.emit('updateNote', changedNoteObj);

      /* axios
        .patch('http://localhost:3001/tasks/' + task.id, { title: editTitle })
        .then(() => getData());
      */
    }
  }

  function onChangeCompTask(task, completed, compDate) {
    const compList = lists.map((list) => {
      if (list.id === task.listId) {
        const newList = list;
        newList.tasks = list.tasks.map((oldTask) => {
          if (oldTask.id === task.id) {
            const newTask = oldTask;
            newTask.status = completed;
            newTask.dateComplation = compDate;
            return newTask;
          }
          return oldTask;
        });
      }
      return list;
    });
    setLists(compList);
  }

  function onChangeImpTask(task, important) {
    const compList = lists.map((list) => {
      if (list.id === task.listId) {
        const newList = list;
        newList.tasks = list.tasks.map((oldTask) => {
          if (oldTask.id === task.id) {
            const newTask = oldTask;
            newTask.important = important;
            return newTask;
          }
          return oldTask;
        });
      }
      return list;
    });
    setLists(compList);
  }

  return (
    <Context.Provider
      value={{
        onChangeTitleInList,
        onAddTask,
        onRemoveTask,
        onEditTask,
        onChangeCompTask,
        onChangeImpTask,
      }}
    >
      <div className="base">
        <Header userInfo={userInfo} signOut={signOut} />
        <div className="planner">
          <div className="planner__sidebar">
            <List
              lists={lists}
              selectedList={selectedList}
              isRemovable={isRemovable}
              onRemove={onRemove}
              changeFormVisibility={() => setFormVisibility(!isVisibleForm)}
              onClickList={(selList) => {
                setSelectedList(selList);
                //  console.log('selList', selList);
              }}
              userInfo={userInfo}
              getData={() => {
                getData();
              }}
            />
            {!!userInfo && (
              <AddList
                onSave={onSaveList}
                isVisible={isVisibleForm}
                setVisibility={() => setFormVisibility(!isVisibleForm)}
              />
            )}
          </div>

          <div className="planner__content">
            {!userInfo && (
              <div>
                <div>
                  Вітаємо, здійсни авторизацію з Google та виконуй все вчасно
                  (^_^)
                </div>
                <button type="button" className="logIn" onClick={signIn}>
                  Log In
                </button>
              </div>
            )}
            {!!userInfo && (
              // lists[2] && selectedList &&
              <Content
                list={selectedList}
                lists={lists}
                onChangeTitle={onChangeTitleInList}
                onAddTask={onAddTask}
                onRemoveTask={onRemoveTask}
                onEditTask={onEditTask}
                onChangeCompTask={onChangeCompTask}
                onChangeImpTask={onChangeImpTask}
              />
            )}
          </div>
        </div>
      </div>
    </Context.Provider>
  );
}

export default App;
