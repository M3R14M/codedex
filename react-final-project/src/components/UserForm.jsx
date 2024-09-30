import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

function UserForm() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [inputName, setInputName] = useState(user || '');

  function handleSubmit(e) {
    e.preventDefault();
    setUser(inputName);
    navigate('/quiz');
  }

  function handleChange(e) {
    setInputName(e.target.value);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor='name'>Name:</label>
        <input
          type='text'
          name='name'
          id='name'
          onChange={handleChange}
          value={inputName}
          placeholder='Your name...'
          autoComplete='given-name'
        />
        <button type='submit'>Start Quiz</button>
      </form>
    </>
  );
}

export default UserForm;
