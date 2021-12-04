import {useContext} from 'react';
import mainStyles from '../../styles/main';
import {Card, Table, Button, Row, Col} from 'react-bootstrap';
import { SubjectsContext, HelperClassesContext, AvailableSectionsContext} from '../../App';

// Importación de módulos / componentes
import SectionCard from './section-card';

// Importación de datos generales
import blocks from '../../data/blocks.json';

export default function Calendar () {
    const selectedSubjects = useContext(SubjectsContext);
    const selectedHelperClasses = useContext(HelperClassesContext);
    const availableSections = useContext(AvailableSectionsContext);

    /* Función para limpiar todas las secciones seleccionadas del calendario */
    const cleanCalendar = () => {
        // Se obtienen todas las asignaturas seleccionadas y se devuelven a la lista de secciones disponibles

        let tempAvailables = [];

        Object.keys(selectedSubjects.data).forEach((blockId) => {
            selectedSubjects.data[blockId].forEach((section) => {
                tempAvailables.push(section);
            });
        });

        availableSections.updater([...availableSections.data, ...tempAvailables]);

        // Se limpia la lista de secciones seleccionadas
        selectedSubjects.updater({
            0: [], // inicio 08:30
            1: [], // inicio 10:00
            2: [], // inicio 11:30
            3: [], // inicio 13:00
            4: [], // inicio 14:30
            5: [], // inicio 15:50
            6: [], // inicio 16:00
            7: [] // inicio 17:30
        });

        // Se limpia la lista de ayudantías (según las secciones seleccionadas)
        selectedHelperClasses.updater({
            0: [], // inicio 08:30
            1: [], // inicio 10:00
            2: [], // inicio 11:30
            3: [], // inicio 13:00
            4: [], // inicio 14:30
            5: [], // inicio 15:50
            6: [], // inicio 16:00
            7: [] // inicio 17:30
        });
    };

    return <>
        <Card style={mainStyles.card}>
            <Card.Header style={mainStyles.cardHeader}>
                <div className="text-center">Horario semanal</div>
            </Card.Header>
            <Card.Body>
            <Row className="mb-2">
                <Col className="pull-right">
                    <Button className="btn-sm btn-danger float-end" onClick={() => cleanCalendar()}>
                        Limpiar
                    </Button>
                </Col>
            </Row>
            <Table responsive striped bordered hover>
                    <thead>
                            <tr>
                            <th className="text-center col-1" style={mainStyles.calendarHeader}>Bloque</th>
                            <th className="text-center" style={mainStyles.calendarHeader}>Lunes</th>
                            <th className="text-center" style={mainStyles.calendarHeader}>Martes</th>
                            <th className="text-center" style={mainStyles.calendarHeader}>Miércoles</th>
                            <th className="text-center" style={mainStyles.calendarHeader}>Jueves</th>
                            <th className="text-center" style={mainStyles.calendarHeader}>Viernes</th>
                            <th className="text-center" style={mainStyles.calendarHeader}>Sábado</th>
                        </tr>
                    </thead>
                    <tbody>

                        {Object.keys(blocks).map((blockIndex) => {
                            // Se recorre según los bloques configurados
                            return [
                                <tr key={'row-' + blockIndex}>
                                    <td style={mainStyles.calendarCell} className="text-center"><strong>{blocks[blockIndex].startTime} - {blocks[blockIndex].endTime}</strong></td>
                                
                                    {[1, 2, 3, 4, 5, 6].map((dayIndex) => {
                                    // Se recorre cada uno de los días para cada bloque configurado 
                                    return [
                                        <td key={'cell-block-' + blockIndex + '-day-' + dayIndex}>
                                            {selectedSubjects.data[blockIndex].map((section) => {
                                                if (section.days.indexOf(dayIndex) > -1 ) {
                                                    return <div key={'section-card-' + section.id + '-day-' + dayIndex + '-block-' + blockIndex} className="col d-flex justify-content-center">
                                                        <SectionCard section={section} isHelpClass={false} />
                                                    </div>
                                                }

                                                return <></>
                                            })}
                                            {selectedHelperClasses.data[blockIndex].map((helpClass) => {
                                                if (helpClass.days.indexOf(dayIndex) > - 1) {
                                                    return <div key={'helper-card-' + helpClass.sectionId + '-day-' + dayIndex + '-block-' + blockIndex} className="col d-flex justify-content-center">
                                                        <SectionCard section={helpClass} isHelpClass={true} />
                                                    </div>
                                                }
                                                return <></>
                                            })}
                                        </td>
                                        ]
                                    })}

                                </tr>
                            ]
                        })}      
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    </>
};