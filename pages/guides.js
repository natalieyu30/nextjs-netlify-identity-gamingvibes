import { useState, useEffect, useContext } from 'react';
import styles from '../styles/Guides.module.css';

import AuthContext from '../stores/authContext';

export default function Guides() {
  const { user, authReady } = useContext(AuthContext);
  const [ guides, setGuides ] = useState(null);
  const [ error, setError ] = useState(null);
  
  useEffect(() => {
    if (authReady) {
      fetch('/.netlify/functions/guides', user && {
        headers: {
          Authorization: 'Bearer ' + user.token.access_token
        }
      })
        .then(res => {
          if (!res.ok) {
            throw Error('You must be logged in to view this content')
          }
          return res.json()
        })
        .then(data => {
          setGuides(data)
          setError(null)
        })
        .catch(err  => {
          setError(err.message)
          setGuides(null)
        })
    }
  }, [user, authReady])

  return (
    <div className={styles.guides}>
      <h2>All Guides</h2>
      {!authReady && <div>Loading ...</div>}

      { error && (
        <div className={styles.error}>
          <p>{ error }</p>
        </div>
      )}

      { guides && guides.map(guide => (
        <div key={guide.title} className={styles.card}>
          <h3>{guide.title}</h3>
          <h4>Written by {guide.author}</h4>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum animi officia atque ex esse? Optio, similique expedita odio soluta saepe maiores deleniti ad animi nobis deserunt et aliquid nemo maxime, blanditiis quis, quibusdam harum dignissimos distinctio minima libero corrupti doloremque repellat repellendus dolor. Aperiam, cum deleniti natus quam animi iusto.</p>
        </div>
      ))}
    </div> 
  )
}