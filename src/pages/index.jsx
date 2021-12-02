import {Container, Navbar, Row, Col,} from 'react-bootstrap';

import mainStyles from '../styles/main';

// Importación de componentes
import Calendar from './calendar';
import SubjectSelector from './selectors';

import calendarLogo from '../imgs/calendar-icon.png';

const MainPage = () => {
    
    return <>
        <Navbar style={mainStyles.navBar}>
        <Container >
            <Navbar.Brand style={mainStyles.navTitle} href="#">
            <img
                alt="Logo calendario"
                src={calendarLogo}
                width="30"
                height="30"
                className="d-inline-block mb-2"
            />{' '}
                Simulador de horarios
            </Navbar.Brand>
        </Container>
    </Navbar>

    <Container fluid>
        <Row>
            <Col xs={12} md={4} lg={4}>
                <SubjectSelector />
            </Col>
            <Col xs={12} md={8} lg={8}>
                <Calendar />
            </Col>
        </Row>
    </Container>

    </>
};

export default MainPage;