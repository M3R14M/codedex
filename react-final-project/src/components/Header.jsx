import { Link } from 'react-router-dom';

function Header() {
  return (
    <>
      <header>
        <nav>
          <Link to='./'>Home</Link>
          <Link to='./quiz'>Quiz</Link>
        </nav>
        <h1>Discover Your Elemental Spirit!</h1>
        <p>
          Curious about which element mirrors your personality? Take our fun
          quiz to find out! Answer quirky questions and reveal whether you’re
          fiery like Fire, serene like Water, grounded like Earth, or
          free-spirited like Air. Each element is paired with a unique cat that
          embodies your traits. Uncover your elemental spirit and meet your
          perfect feline match!
        </p>
      </header>
    </>
  );
}

export default Header;