import {useContext} from 'react';
import mainStyles from '../../styles/main';
import { SubjectsContext } from "../../App";
import {Card, Badge} from 'react-bootstrap';

import blocks from '../../data/blocks.json';
import subjects from '../../data/subjects.json';

export default function SelectedSections () {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const selectedSubjects = useContext(SubjectsContext);

    return <Card style={mainStyles.card}>
        <Card.Header style={mainStyles.cardHeader}>
            <div className="text-center">Asignaturas seleccionadas</div>
        </Card.Header>
        <Card.Body style={{overflowY: 'scroll', maxHeight: '1000px'}}>
            Estas son las asignaturas que actualmente has seleccionado para la simulación.<br></br>

            {Object.keys(selectedSubjects.data).map((blockId) => {
                return [
                    <div className="mt-3" key={'selected-section-block-' + blockId}>
                        <p><strong>Bloque {parseInt(blockId) + 1} ({blocks[blockId].startTime} - {blocks[blockId].endTime})</strong></p>
                        <hr />
                        {selectedSubjects.data[parseInt(blockId)].length !== 0 ? 
                            <div>
                                {selectedSubjects.data[parseInt(blockId)].map((section) => {
                                    return <div className="mt-3" key={'selected-section-' + section.id + '-' + blockId}>
                                            - {subjects[section.subjectId].name}
                                            {section.days.map((dayIndex) => {
                                                return <div key={'section-' + section.id + '-day-badge-' + dayIndex}>
                                                    <Badge bg="secondary">{days[parseInt(dayIndex) - 1]}</Badge>
                                                    </div>
                                            })}
                                        </div>
                                })}
                            </div>
                        
                        : '---'}

                    </div>
                ]
            })}

        </Card.Body>
    </Card>
}