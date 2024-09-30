import { useContext, useState } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { ThreeCircles } from 'react-loader-spinner';
import { Lightbox } from 'react-modal-image';
import Badge from './Badge';

function Results({ element, cat, loading, onReset, percentage }) {
  const [zoom, setZoom] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { name, desc, traits, infoUrl, imgUrl } = cat || {};
  function handleReset() {
    setUser('');
    onReset();
    navigate('/');
  }
  const toggleZoom = () => setZoom((prev) => !prev);

  return (
    <div>
      <p style={{ lineHeight: '0', paddingBlock: '.625rem' }}>
        Dear <strong>{user.length ? user : 'Stranger'}</strong>, your element
        is:<element-type>{element}</element-type>
      </p>

      {loading && (
        <>
          <p> Loading a lovely companion for you...</p>
          <ThreeCircles
            ariaLabel='Loading'
            innerCircleColor='var(--tertiary-color)'
            middleCircleColor='var(--secondary-color)'
            outerCircleColor='var(--primary-color)'
            wrapperStyle={{ margin: '0 auto', width: 'fit-content' }}
          />
        </>
      )}

      {cat && !loading && (
        <>
          <div className='results'>
            <header>
              <h3>Your companion; the {name}</h3>
              {percentage && <span> ({percentage}% match)</span>}
            </header>

            <img src={imgUrl} alt={name} onClick={toggleZoom} />
            <p>{desc}</p>
            <div>
              <h4>Temperament:</h4>
              {traits.map((trait, idx) => (
                <Badge key={idx} txt={trait} />
              ))}
            </div>
            <footer>
              <a href={infoUrl} target='_blank' rel='noreferrer'>
                Learn more about the {name} <span>➟</span>
              </a>
            </footer>
          </div>
          <button type='button' onClick={handleReset}>
            Reset
          </button>
        </>
      )}
      {zoom && (
        <Lightbox
          large={imgUrl}
          onClose={toggleZoom}
          alt={name}
          hideDownload
        />
      )}
    </div>
  );
}

export default Results;
