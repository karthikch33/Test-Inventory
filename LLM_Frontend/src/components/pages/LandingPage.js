import React from 'react';  
import './LandingPages.css';
import Card from './Card';  
import { cardsData } from './CardsData';   
import { Row, Col } from 'react-bootstrap';   
import Meta from '../utils/Meta';

const LandingPage = () => {  
  return (  
    <div className = 'landing-page' > 
    <Meta title="HOME | Test Inventory"/>
      <h1 className="page-title">Dashboard</h1>   
      <div className='cards-grid'>
        {cardsData.map((card, index) => (
          <Card title={card.title} description={card.description} icon={card.icon} link={card.link} btnText={card.btnText} />
        ))}
      </div> 
      <Row className='justify-content-center'>
        <Col md={5}>
          <div style={{ padding: '20px', height: '100%', borderRadius: '8px' }}>
            {/* <img src='https://cdn.dribbble.com/users/19417/screenshots/5509283/wytitu_dribbble_800x600.gif' alt='llm' style={{ width: '100%', borderRadius: "10%" }} /> */}
          </div>
        </Col>
      </Row>  
  </div>
  );   
};  

export default LandingPage;