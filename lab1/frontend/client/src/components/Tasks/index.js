import React, { useContext } from 'react';
import AddTask from '../AddTask';
// import EditTask from '../EditTask';
import '../Content/Tasks.scss';
import Context from '../../context';

import CheckSvg from '../../assets/check.svg';
import EditSvg from '../../assets/edit.svg';
import Edit2Svg from '../../assets/edit2.svg';
import DeleteSvg from '../../assets/cross2.svg';
import StarSvg from '../../assets/star.svg';
// import MoreSvg from '../../assets/more.svg';
const socket = window.io.connect('wss://devopseek.me:30001', {
});

export default function Tasks({ list, listName }) {
  const {
    onChangeTitleInList,
    onAddTask,
    onRemoveTask,
    onEditTask,
    onChangeCompTask,
    onChangeImpTask,
  } = useContext(Context);

  const changeTitle = () => {
    // eslint-disable-next-line no-alert
    const newTitle = window.prompt('Title name', list.listName);
    if (newTitle) {
      /* onChangeTitleInList(list.id, newTitle);
      axios.patch('http://localhost:3001/lists/' + list.id, {
        name: newTitle,
      }); */
      onChangeTitleInList(list.id, newTitle);

      const changedListObj = {
        googleIdentify: JSON.parse(window.localStorage.getItem('authInfo'))
          .googleUserId,
        nameList: newTitle,
        id: list.id,
      };
      socket.emit('updateList', changedListObj);
    }
  };

  function onChangeCompStatus(event, task) {
    // console.log(task, event.target.checked);
    /* axios.patch('http://localhost:3001/tasks/' + task.id, {
      completed: event.target.checked,
      compDate: Number(new Date().setHours(0, 0, 0, 0)),
    }); */
    let curDate = null;
    if (event.target.checked) curDate = Number(new Date().setHours(0, 0, 0, 0));

    const changedNoteObj = {
      googleIdentify: JSON.parse(window.localStorage.getItem('authInfo'))
        .googleUserId,
      id: task.id,
      noteName: task.noteName,
      deadlineTask: task.deadline,
      dateComplation: curDate,
      importantTask: task.important,
    };

    socket.emit('updateNote', changedNoteObj);

    onChangeCompTask(task, event.target.checked, curDate);
  }

  function onChangeImpStatus(event, task) {
    /* axios.patch('http://:3001/tasks/' + task.id, {
      important: event.target.checked,
    }); */

    const changedNoteObj = {
      googleIdentify: JSON.parse(window.localStorage.getItem('authInfo'))
        .googleUserId,
      id: task.id,
      noteName: task.noteName,
      deadlineTask: task.deadline,
      dateComplation: task.dateComplation,
      importantTask: !task.important,
    };
    socket.emit('updateNote', changedNoteObj);
    onChangeImpTask(task, event.target.checked);
  }

  function daysLeft(taskDeadline) {
    if (!taskDeadline) return '';

    const curDate = Number(new Date().setHours(0, 0, 0, 0));
    const diff = Math.round((taskDeadline - curDate) / (24 * 3600 * 1000));
    if (diff === 0) return 'today';
    else if (diff === 1) return '1 day left';
    else if (diff > 1) return `${diff} days left`;
    else if (diff === -1) return `${-diff} day overdue`;

    return `${-diff} days overdue`;
  }

  return (
    <div className="tasks">
      {listName ? (
        <div className="tasks__title">
          <h1 id="title" className="title">
            {listName}
          </h1>
        </div>
      ) : (
        <div className="tasks__title">
          <h1 className="title">{list.listName}</h1>
          <img alt="edit" src={EditSvg} onClick={() => changeTitle()} />
        </div>
      )}

      <div className="tasks__items">
        {list.tasks &&
          list.tasks.map((item) => (
            <div key={item.id} className="tasks__items_item">
              <div className="checkbox">
                <input
                  id={`done${item.id}`}
                  type="checkbox"
                  onChange={(event) => onChangeCompStatus(event, item)}
                  checked={item.status}
                />
                <label htmlFor={`done${item.id}`} className="done-label">
                  <img alt="done" src={CheckSvg} />
                </label>
              </div>
              <div className="task">
                <p key="task-p">{item.noteName}</p>
                <div className="task__icons">
                  <p className="task__deadline">{daysLeft(item.deadline)}</p>

                  {/* <img src={MoreSvg} alt="more" className="more-img" onClick={() => onEditTask(item)}/> */}

                  <div className="checkbox">
                    <input
                      id={`important${item.id}`}
                      type="checkbox"
                      onChange={(event) => onChangeImpStatus(event, item)}
                      checked={item.important}
                    />
                    <label
                      htmlFor={`important${item.id}`}
                      className="imp-label"
                    >
                      <img className="imp-img" alt="important" src={StarSvg} />
                    </label>
                  </div>
                  <img
                    alt="edit"
                    src={Edit2Svg}
                    className="task-img task-img1"
                    onClick={() => onEditTask(item)}
                  />
                  <img
                    alt="delete"
                    src={DeleteSvg}
                    className="task-img"
                    onClick={() => onRemoveTask(item)}
                  />
                </div>
              </div>
            </div>
          ))}
        <AddTask key={list.id} onAddTask={onAddTask} list={list} />
      </div>
    </div>
  );
}
