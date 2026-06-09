import React from 'react';
import { createRoot } from 'react-dom/client';
import TaskPlanner from './components/TaskPlanner';

const container = document.getElementById('app');
if (container) {
    createRoot(container).render(<TaskPlanner />);
}