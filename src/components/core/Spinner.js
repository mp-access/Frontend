import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Spinner = ({ text }) => <><FontAwesomeIcon icon="spinner" spin/><span>{text}</span></>;

export default Spinner;