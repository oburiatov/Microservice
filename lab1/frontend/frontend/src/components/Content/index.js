/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Tasks from '../Tasks';
import Pomodoro from '../Pomodoro';

// import './Tasks.scss';

const msInDay = 24 * 3600 * 1000;

export default function Content({ lists }) {
  const baseList = lists.find((list) => list.listName === 'Base');
  if (baseList) baseList.tasks.sort((t1, t2) => t1.deadline - t2.deadline);

  // console.log(lists, baseList);
  return (
    <div>
      <Switch>
        <Route path="/today">
          {baseList && <DayTasks selList={baseList} />}
        </Route>
        <Route path="/week">
          {baseList && <WeekTasks selList={baseList} />}
        </Route>
        <Route path="/important">
          {baseList && <ImportantTasks selList={baseList} />}
        </Route>
        <Route path="/affairs">
          {baseList && <AffairsTasks selList={baseList} />}
        </Route>
        <Route path="/planned">
          {baseList && <PlannedTasks selList={baseList} />}
        </Route>
        <Route path="/pomodoro">
          <Pomodoro />
        </Route>

        {lists.map((list) => (
          <Route key={list.id + 24} path={'/userList' + list.id}>
            <ShowTasks selList={list} />
          </Route>
        ))}
      </Switch>
    </div>
  );
}

function WeekTasks({ selList }) {
  const newList = JSON.parse(JSON.stringify(selList));
  newList.tasks = newList.tasks.filter(
    (task) =>
      task.deadline <= Number(new Date().setHours(0, 0, 0, 0)) + msInDay * 6, // &&
    // !task.deleteDate,  //
  );
  return <Tasks list={newList} listName="Week" />;
}

function DayTasks({ selList }) {
  const newList = JSON.parse(JSON.stringify(selList));
  newList.tasks = newList.tasks.filter(
    (task) => task.deadline <= Number(new Date().setHours(0, 0, 0, 0)), // &&
    // !task.deleteDate,
  );
  return <Tasks list={newList} listName="Today" />;
}

function ImportantTasks({ selList }) {
  const newList = JSON.parse(JSON.stringify(selList));
  newList.tasks = newList.tasks.filter(
    (task) => task.important, // && !task.deleteDate,
  );
  return <Tasks list={newList} listName="Important" />;
}

function AffairsTasks({ selList }) {
  // const newList = JSON.parse(JSON.stringify(selList));
  // newList.tasks = newList.tasks.filter((task) => !task.deleteDate);
  return <Tasks list={selList} listName="Affairs" />;
}

function PlannedTasks({ selList }) {
  const newList = JSON.parse(JSON.stringify(selList));
  newList.tasks = newList.tasks.filter(
    (task) =>
      task.deadline > Number(new Date().setHours(0, 0, 0, 0)) + msInDay * 6, // &&
    // !task.deleteDate,
  );
  return <Tasks list={newList} listName="Planned" />;
}

function ShowTasks({ selList }) {
  // const newList = JSON.parse(JSON.stringify(selList));
  // newList.tasks = newList.tasks.filter((task) => !task.deleteDate);
  return <Tasks list={selList} />;
}
