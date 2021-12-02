import {useContext} from 'react';
import mainStyles from '../../styles/main';
import {Card, Table} from 'react-bootstrap';

import { SubjectsContext, HelperClassesContext} from '../../App';

// Importación de módulos / componentes
import SectionCard from './section-card';

// Importación de datos generales
import blocks from '../../data/blocks.json';

export default function Calendar () {
    const selectedSubjects = useContext(SubjectsContext);
    const selectedHelperClasses = useContext(HelperClassesContext);

    return <>
        <Card style={mainStyles.card}>
            <Card.Header style={mainStyles.cardHeader}>
                <div className="text-center">Horario semanal</div>
            </Card.Header>
            <Card.Body>
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