import React from 'react';
import ACEStepGenerator from '../components/ACEStepGenerator';

const ACEStepPage = () => {
  console.log('ACEStepPage rendered');

  return (
    <div className="space-y-8">
      <ACEStepGenerator />
    </div>
  );
};

export default ACEStepPage;