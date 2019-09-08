import React from 'react';
import { Hexagon } from 'react-feather';

const Spinner = ({ text }) => <><Hexagon size={16} className="spin"/><span>{text}</span></>;

export default Spinner;