import React from 'react';
import ReactDOM from 'react-dom';
import Download from './Download';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Download />, div);
    ReactDOM.unmountComponentAtNode(div);
  });