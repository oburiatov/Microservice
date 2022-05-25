import React from 'react';

import './AddList.scss';
import CancelSvg from '../../assets/cancel.svg';

const socket = window.io.connect('ws://devopseek.me:30001', {
});

export default function AddList({ isVisible, setVisibility }) {
  // const [isVisible, setVisibility] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  function saveList() {
    /* if (inputValue)
      axios
        .post('http://localhost:3001/lists', { name: inputValue })
        .then(({ data }) => {
          const newData = { ...data, tasks: [] };
          console.log('new list', data, newData);
          onSave(newData);
        });
    */

    if (inputValue) {
      const newList = {
        googleIdentify: JSON.parse(window.localStorage.getItem('authInfo'))
          .googleUserId,
        nameList: inputValue,
      };

      /* socket.once('listCreated', (answer) => {
        // console.log('listCreated', answer);
        // const newData = { ...data, tasks: [] };
        // console.log('new list', data, newData);
        // onSave(newData);
        const newSentList = {
          id: answer,
          listName: inputValue,
          tasks: [],
        };

        onSave(newSentList);
      }); */
      socket.emit('createList', newList);
      // const listId =
      // sendNewList(newList).then((id) => console.log('new list id', id));
      /* const newList2 = {
        id: listId,
        nameList: inputValue,
        tasks: []
      } */
      // onSave(newList2);

      setVisibility();
      setInputValue('');
    }
  }

  return (
    <div>
      {isVisible && (
        <div className="add-list__form">
          <img
            alt="close"
            src={CancelSvg}
            onClick={setVisibility}
            className="add-list-close-btn"
          />
          <input
            value={inputValue}
            onChange={(ev) => setInputValue(ev.target.value)}
            type="text"
            placeholder="List Name"
            className="input-place"
          />
          <button type="button" onClick={saveList} className="button">
            Save
          </button>
        </div>
      )}
    </div>
  );
}
