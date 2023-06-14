const ColorLegend = () => {
    const colors = [
      { color: "red", name: "Aerostructure" },
      { color: "green", name: "Material" },
      { color: "blue", name: "Equipments" },
      { color: "yellow", name: "Cabine" },
      { color: "purple", name: "Propulsion" },
      { color: "gray", name: "Other"}
    ];
  
    return (
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {colors.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: item.color,
                marginRight: '5px'
              }}
            ></div>
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    );
  };

export default ColorLegend;