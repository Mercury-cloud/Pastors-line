import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form, InputGroup, FormControl, Spinner } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Link } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';
import axios from 'axios';

import './App.css';

function App() {
  const [showA, setShowA] = useState(false);
  const [showB, setShowB] = useState(false);
  const [showC, setShowC] = useState(false);
  const [checked, setCheck] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [spinnerStyle, setSpinnerStyle] = useState({ display: 'block' });
  const [allContacts, setAllContacts] = useState([]);
  const [usContacts, setUSContacts] = useState([]);
  const [detailContact, setDetailContact] = useState({});

  const toggleCheckbox = () => {
    checked ? setCheck(false) : setCheck(true);
  }

  const handleClose = () => {
    setShowA(false);
    setShowB(false);
  }
  const handleCloseC = () => {
    setShowC(false);
  }

  const showAllContacts = () => {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNzEiLCJleHAiOjE2MDM3ODM0Mzd9.3ievseHtX0t3roGh7nBuNsiaQeSjfiHWyyx_5GlOLXk';
    setSpinnerStyle({ display: 'block' });
    setAllContacts([]);
    axios.get(`https://api.dev.pastorsline.com/api/contacts.json`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      params: { companyId: 171, page: page, query: query },

    }).then(res => {
      const contacts = res.data.contacts;
      const contactArray = [];
      for (const id in contacts) {
        console.log(`${id}: ${contacts[id]}`);
        contactArray.push(contacts[id]);
      }
      if (checked) {

      }
      console.log('all contacts--', contacts);
      setSpinnerStyle({ display: 'none' });
      setAllContacts(contactArray);
    });
  }
  const showUSContacts = () => {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNzEiLCJleHAiOjE2MDM3ODM0Mzd9.3ievseHtX0t3roGh7nBuNsiaQeSjfiHWyyx_5GlOLXk';
    setSpinnerStyle({ display: 'block' });
    setUSContacts([]);
    axios.get(`https://api.dev.pastorsline.com/api/contacts.json`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      params: { companyId: 171, countryId: 226, page: page, query: query },
    }).then(res => {
      const contacts = res.data.contacts;
      const contactArray = [];
      for (const id in contacts) {
        console.log(`${id}: ${contacts[id]}`);
        contactArray.push(contacts[id]);
      }
      console.log('US contacts--', contacts);
      setSpinnerStyle({ display: 'none' });
      setUSContacts(contactArray);
    });
  }

  const showDetailContact = (element) => {
    console.log("a--->", element);
    setDetailContact(element);
  }

  const handleShowA = () => {
    setQuery('');
    setPage(1);
    setShowA(true);
    showAllContacts();
  };
  const handleShowB = () => {
    setQuery('');
    setPage(1);
    setShowB(true);
    showUSContacts();
  }
  const handleShowC = (element) => {
    setShowC(true);
    showDetailContact(element);
  }

  const handleScrollStopA = () => {
    // const scrollTop = document.getElementsByClassName('contacts')[0].scro;
    // const scrollTop = document.getElementsByClassName('main-scroll')[0].scrollTop;
    // console.log("scroll stop----", scrollTop);
    setPage(page + 1);
    showAllContacts();
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    console.log('Fetch more list items!', page);
  }
  const handleScrollStopB = () => {
    // const scrollTop = document.getElementsByClassName('contacts')[0].scro;
    // const scrollTop = document.getElementsByClassName('main-scroll')[1].scrollTop;
    // console.log("scroll stop----", scrollTop);
    setPage(page + 1);
    showUSContacts();
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    console.log('Fetch more list items!', page);
  }

  return (
    <div className="App">
      <div className="main-container">
        <Link to="/all-contacts">
          <Button className="button-A btn" variant="primary" onClick={handleShowA}>BUTTON A</Button>
        </Link>

        <Link to="/us-contacts">
          <Button className="button-B btn" variant="success" onClick={handleShowB}>BUTTON B</Button>
        </Link>
      </div>

      <Modal show={showA} onHide={handleClose} dialogClassName="custom-modal" >
        <Modal.Header closeButton>
          <Modal.Title>All Contacts Modal A</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="search-box">
            <p>--- Search box(name or phone number) ---</p>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="name-number">Search by</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Please write name or phone number"
                aria-label="nameNumber"
                aria-describedby="name-number"
                onChange={(e) => { setQuery(e.target.value); setPage(1); showAllContacts() }}
              />
            </InputGroup>

          </div>
          <Scrollbars style={{ width: '100%', height: 300 }} onScrollStop={handleScrollStopA} className='main-scroll'>
            <div className="contacts">
              <Spinner animation="border" className="main-spinner" style={spinnerStyle} />
              <ul>
                {allContacts.map((element, index) => {

                  if (checked) {
                    if ((index + 1) % 2 == 0)
                      return (<li key={element.id}><a onClick={() => { handleShowC(element) }}>{`No: ${(page - 1) / 2 * 20 + index + 1}, id: ${element.id}, name: ${element.first_name} ${element.last_name}`}</a></li>)
                  }
                  else {
                    return (<li key={element.id}><a onClick={() => { handleShowC(element) }}>{`No: ${(page - 1) / 2 * 20 + index + 1}, id: ${element.id}, name: ${element.first_name} ${element.last_name}`}</a></li>)
                  }
                })}
              </ul>
            </div>

          </Scrollbars>

          <div className="buttons">
            <Link to="/all-contacts">
              <Button className="button-A" onClick={() => { handleClose(); handleShowA(); }}>All Contacts</Button>
            </Link>
            <Link to="/us-contacts">
              <Button className="button-B" onClick={() => { handleClose(); handleShowB(); }}>US Contacts</Button>
            </Link>
            <Button className="button-C" onClick={handleClose}>Close</Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Only even" onChange={toggleCheckbox} />
          </Form.Group>
        </Modal.Footer>
      </Modal>
      <Modal show={showB} onHide={handleClose} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>US Contacts Modal B</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="search-box">
            <p>--- Search box(name or phone number) ---</p>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="name-number">Search by</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Please write name or phone number"
                aria-label="nameNumber"
                aria-describedby="name-number"
                onChange={(e) => { setQuery(e.target.value); setPage(1); showUSContacts() }}
              />
            </InputGroup>

          </div>
          <Scrollbars style={{ width: '100%', height: 300 }} onScrollStop={handleScrollStopB} className='main-scroll'>
            <div className="contacts">
              <Spinner animation="border" className="main-spinner" style={spinnerStyle} />
              {usContacts.map((element, index) => {
                if (checked) {
                  if ((index + 1) % 2 == 0)
                    return (<li key={element.id}><a onClick={() => { handleShowC(element) }}>{`No: ${(page - 1) / 2 * 20 + index + 1}, id: ${element.id}, name: ${element.first_name} ${element.last_name}`}</a></li>)
                }
                else {
                  return (<li key={element.id}><a onClick={() => { handleShowC(element) }}>{`No: ${(page - 1) / 2 * 20 + index + 1}, id: ${element.id}, name: ${element.first_name} ${element.last_name}`}</a></li>)
                }
              })}
            </div>
          </Scrollbars>
          <div className="buttons">
            <Link to="/all-contacts">
              <Button className="button-A" onClick={() => { handleClose(); handleShowA(); }}>All Contacts</Button>
            </Link>
            <Link to="/us-contacts">
              <Button className="button-B" onClick={() => { handleClose(); handleShowB(); }}>US Contacts</Button>
            </Link>
            <Button className="button-C" onClick={handleClose}>Close</Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Only even" onChange={toggleCheckbox} />
          </Form.Group>
        </Modal.Footer>
      </Modal>
      <Modal show={showC} onHide={handleCloseC} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Contact Detail Modal C</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="contacts">
            <li key={detailContact.id}><p>{JSON.stringify(detailContact)}</p></li>
          </div>
          <div className="buttons">
            <Link to="/all-contacts">
              <Button className="button-A" onClick={() => { handleClose(); handleShowA(); }}>All Contacts</Button>
            </Link>
            <Link to="/us-contacts">
              <Button className="button-B" onClick={() => { handleClose(); handleShowB(); }}>US Contacts</Button>
            </Link>
            <Button className="button-C" onClick={handleCloseC}>Close</Button>
          </div>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default App;
