import React from 'react';
import './AddTask.scss';

import classNames from 'classnames';
import PlusSvg from '../../assets/plus.svg';
import SunSvg from '../../assets/sun.svg';
import WeekSvg from '../../assets/week.svg';
import TomorrowSvg from '../../assets/sunrise.svg';
import MonthSvg from '../../assets/month.svg';

const socket = window.io.connect('ws://devopseek.me:30001', {
});

export default function AddTask({ list }) {
  const [isVisibleForm, setFormVisibility] = React.useState(false);
  const [inputTitle, setInputTitle] = React.useState('');

  const [selDate, setSelDate] = React.useState(null);

  const title = document.getElementById('title');
  const dateInf = [
    { id: 1, icon: SunSvg },
    { id: 2, icon: TomorrowSvg },
    { id: 3, icon: WeekSvg },
    { id: 4, icon: MonthSvg },
  ];
  // console.log('fsfsfsdfsdfsdfsfsd', title.innerText);
  function changeFormVisibility() {
    setFormVisibility(!isVisibleForm);
    setInputTitle('');
  }

  function saveTask() {
    if (!inputTitle.length) return;

    let today = new Date();
    today = Number(today.setHours(0, 0, 0, 0));
    let imp = false;
    if (title === 'important') imp = true;

    const dayInMs = 3600 * 24 * 1000;

    let expDate = null;
    // if(deadline)
    //  expDate = deadline;
    switch (selDate) {
      case 1:
        expDate = today;
        break;
      case 2:
        expDate = today + dayInMs;
        break;
      case 3:
        expDate = today + dayInMs * 6;
        break;
      case 4:
        expDate = today + dayInMs * 29;
        break;
      default:
        expDate = null;
        break;
    }

    let sendListId = null;
    if (list.listName !== 'Base') sendListId = list.id;

    /* switch (title) {
      case 'today': 
        expDate = today;    
        break;
      case 'week': 
        expDate = today + 6*dayInMs;    
        break;
      case 'important': 
        expDate = today;
        imp = true;
        break;
      case 'planned': 
        expDate = today + 29*dayInMs;
        break;
      default:
        break;
    } */

    /* const newTask = {  //current
      listId: list.id,
      title: inputTitle,
      creationDate: today,
      deadline: expDate,
      compDate: null,
      important: imp,
      completed: false,
      deleteDate: null,
    };
*/
    /*
    const newTask = {
      googleIdentify: 8,
      noteName: inputTitle,
      createDate: today,
      deadlineTask: expDate,
      importantTask: imp,
      statusComp: false
    }
    */

    const newNoteObj = {
      googleIdentify: JSON.parse(window.localStorage.getItem('authInfo'))
        .googleUserId,
      noteName: inputTitle,
      createDate: today,
      deadlineTask: expDate,
      importantTask: imp,
      statusComp: false,
      idlist: sendListId,
    };
    setFormVisibility(!isVisibleForm);
    setInputTitle('');
    socket.emit('createNote', newNoteObj);
    /* axios.post('http://localhost:3001/tasks', newTask).then((savedTask) => {
        onAddTask(list.id, savedTask.data);
        setFormVisibility(!isVisibleForm);
        setInputTitle('');
      }); */
  }

  function chooseData(dataId) {
    if (selDate === dataId) setSelDate(null);
    else setSelDate(dataId);
  }

  return (
    <div className="addTask">
      {!isVisibleForm ? (
        <div className="addTask__newTask" onClick={changeFormVisibility}>
          <img src={PlusSvg} alt="add" />
          <span>New task</span>
        </div>
      ) : (
        <div className="addTask__container">
          <input
            type="text"
            placeholder="Task Name"
            className="input-place"
            value={inputTitle}
            onChange={(event) => setInputTitle(event.target.value)}
          />

          <div className="addTask__date">
            {dateInf.map((item) => (
              <img
                key={item.id}
                src={item.icon}
                alt="icon"
                onClick={() => chooseData(item.id)}
                className={classNames({
                  active: selDate === item.id,
                })}
              />
            ))}
          </div>

          <div className="addTask__form">
            <button type="button" className="button" onClick={saveTask}>
              Add task
            </button>
            <button
              type="button"
              className="button button-cancel"
              onClick={changeFormVisibility}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
