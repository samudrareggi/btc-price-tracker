import React, { useState } from "react";

export default function Card(props) {
  const [icons] = useState([
    { icon: <i class="fas fa-dollar-sign"></i>, name: "USD" },
    { icon: <i class="fas fa-euro-sign"></i>, name: "EUR" },
    { icon: <i class="fas fa-pound-sign"></i>, name: "GBP" },
    { icon: 'Rp', name: "IDR" },
  ]);

  return (
    <>
      {Array(icons.length)
        .fill()
        .map((_, index) => (
          <div class="card col mb-5" key={index} style={{ padding: 0, margin: 10, backgroundColor: '#0f1a2a' }}>
            <div className="card-header text-center" style={{ backgroundColor: '#0d1624' }}>
              <h4><i className="fab fa-bitcoin"></i> <i class="fas fa-arrow-right"></i> {icons[index]['icon']}</h4>
            </div>
            <div className="card-body text-center">
              <h4 className="card-title">{props.payload.rate[index]}</h4>
              <p className="card-text">{`(price in ${icons[index]['name']})`}</p>
            </div>
          </div>
        ))}
    </>
  );
}
