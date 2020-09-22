import React from 'react';
import styles from './Loading.module.scss';

const Loading = () => (
  <div className={styles.modal}>
    <div className={styles.container}>
      <p>Loading...</p>
    </div>
  </div>
);

export default Loading;
