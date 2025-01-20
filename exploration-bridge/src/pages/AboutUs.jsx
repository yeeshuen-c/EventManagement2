import React from 'react';

const AboutUs = () => {
  return (
    <div className="about-section position-relative">
      <div className="overlay"></div>
      <div className="container min-vh-100 d-flex flex-column justify-content-center position-relative" style={{ color: '#333' }}>
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="display-4 mb-4"> About Us</h1>
            <p className="lead">    Exploration Bridge - the digital bridge of IMCC.</p>
            <p> We aim to develop understanding between academic crowds via this platform, building a united global academic family.</p>
            <p>The UNIVERSITI SAINS MALAYSIA (USM) International Mobility And Collaboration Centre (IMCC) plays an essential role in fostering global partnerships and supporting student and faculty exchanges. As part of its commitment to international engagement, the IMCC organizes the annual Explorance event, which brings together students, faculty, industry professionals, and academic partners from around the world. This event serves as a showcase of USM’s global reach and as a platform for intercultural exchange, academic collaboration, and professional networking.</p>
          </div>
          <div className="col-md-6">
            <div className="text-center">
              <img 
                src="images/universiti.png"  alt="About Us" className="img-fluid rounded shadow"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;