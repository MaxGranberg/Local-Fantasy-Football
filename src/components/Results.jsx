import React from 'react';

function Results() {
  return (
    <div className="">
      <div className="overflow-y-auto">
        <h2 className="text-lg text-center font-semibold text-blue-800 ">Senaste resultaten</h2>
        <iframe src="/results.html" style={{ width: '70%', height: '250px', border: 'none', margin: 'auto' }} title="Latest results"></iframe>
      </div>
    </div>
  );
}

export default Results;
