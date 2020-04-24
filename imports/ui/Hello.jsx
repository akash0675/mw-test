import React, { useState } from 'react';
import { LinksCollection } from "./../api/links";

export const Hello = () => {
  const [counter, setCounter] = useState(0);

  const insertLink = ({ title, url }) => {
    LinksCollection.insert({title, url, createdAt: new Date()});
  }

  const increment = () => {
    insertLink({title: "abc", url: "abc.com"});
    setCounter(counter + 1);
  };



  return (
    <div>
      <button onClick={increment}>Click Me</button>
      <p>You've pressed the button {counter} times.</p>
    </div>
  );
};
