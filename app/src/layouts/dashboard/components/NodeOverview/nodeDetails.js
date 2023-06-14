const NodeDetails = ({ node, onClose }) => {
  if (!node) {
    return null;
  }

  const risk = localStorage.getItem(`risk-${node.id}`);
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '10px',
      marginTop: '15px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>Node Details:</h2>
      <p><strong>Name:</strong> {node.id}</p>
      <p><strong>Commodities:</strong> {node.commodities.join(', ')}</p>
      <p><strong>Risk:</strong> {risk}</p>
      <p><strong>Location:</strong> {node.location.join(', ')}</p>
      <button onClick={onClose} style={{ padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>Close</button>
    </div>
  );
};

export default NodeDetails;
