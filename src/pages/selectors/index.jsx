import {useContext, useState} from 'react';
import {SubjectsContext, HelperClassesContext, AvailableSectionsContext} from '../../App';
import {Card, ListGroup, FormControl, InputGroup, Alert} from 'react-bootstrap';
import mainStyles from '../../styles/main';

// React Notifications
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

// Importación de datos para secciones / asignaturas
import blocks from '../../data/blocks.json';
import subjects from '../../data/subjects.json';

// Utils
import { sectionsCollision } from '../../utils/verifications';
import {generateRandomHexColor, hexToRgb, getSimilarityScore} from '../../utils/hex-color';

// Importación de sección con las asignaturas seleccionadas
import SelectedSections from './selected-sections';

export default function SubjectSelector () {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const [prevRgbColor, setPrevRgbColor] = useState(null); // Código de color RGB asignado a la sección previamente seleccionada
    const [filterValue, setFilterValue] = useState('');

    const selectedSubjects = useContext(SubjectsContext); // Entrega el valor en 'data' y el setState en 'udpater'.
    const helperClasses = useContext(HelperClassesContext);
    const availableSections = useContext(AvailableSectionsContext);

    const filterSubjects = (e) => {
        /* Permite modificar la visibilidad de las secciones disponibles cuando se escribe en el filtro */
        setFilterValue(e.target.value);
        let tempSections = availableSections.data;

        tempSections.forEach((section, index) => {
            /* Coincidencia por nombre de la asignatura con el filtro */
            if (subjects[section.subjectId].name.toLowerCase().includes(filterValue.toLowerCase())) {
                tempSections[index].visible = 1;
                return;
            }

            /* Coincidencia por código de asignatura con el filtro */
            if (subjects[section.subjectId].code.toLowerCase().includes(filterValue.toLowerCase())) {
                tempSections[index].visible = 1;
                return;
            }

            /* Coincidencia por código de sección con el filtro */
            if (section.code.toLowerCase().includes(filterValue.toLowerCase())) {
                tempSections[index].visible = 1;
                return;
            }

            /* Coincidencia por nombre del profesor con el filtro */
            if (section.teacher.toLowerCase().includes(filterValue.toLowerCase())) {
                tempSections[index].visible = 1;
                return;
            }

            /* Coincidencia por horario de cátedra con el filtro */
            if ((blocks[section.blockId].startTime + ' - ' + blocks[section.blockId].endTime).includes(filterValue.toLowerCase())) {
                tempSections[index].visible = 1;
                return;
            }

            if (section.helpClass) {
                if ((blocks[section.helpClass.blockId].startTime + ' - ' + blocks[section.helpClass.blockId].endTime).includes(filterValue.toLowerCase())) {
                    tempSections[index].visible = 1;
                    return;
                }

                if (section.helpClass.helper.toLowerCase().includes(filterValue.toLowerCase())) {
                    tempSections[index].visible = 1;
                    return;
                }
            }


            tempSections[index].visible = 0;

        });
        availableSections.updater(tempSections);
    }

    const selectSubject = (sectionId) => {
        // Se obtiene la sección actual seleccionada
        let targetSection;

        for (let i = 0 ; i < availableSections.data.length ; i++) {
            if (availableSections.data[i].id === sectionId) {
                targetSection = availableSections.data[i];
                break;
            }
        }

        let cardColor = generateRandomHexColor();
        let rgbColor = hexToRgb(cardColor);

        if (prevRgbColor) {
            while (getSimilarityScore([rgbColor.r, rgbColor.g, rgbColor.b], [prevRgbColor.r, prevRgbColor.g, prevRgbColor.b]) > 100) {
                cardColor = generateRandomHexColor();
                rgbColor = hexToRgb(cardColor);
            }
        }

        setPrevRgbColor(rgbColor);

        // Se elimina la sección de las secciones disponibles
        let tempNewAvailableSections = availableSections.data.filter((section) => section.id !== sectionId);

        // Se reestablece la visibilidad de las secciones
        tempNewAvailableSections.forEach((section) => {
            section.visible = 1;
        });
        availableSections.updater(tempNewAvailableSections);

        // Se almacenan los datos de la ayudantía (en caso de que tenga)
        if (targetSection.helpClass) {
            let helpClassData = targetSection.helpClass;
            helpClassData.sectionId = targetSection.id; // Se asigna el ID de la sección a la que corresponde la ayudantía
            helperClasses.updater({...helperClasses.data, [targetSection.helpClass.blockId]: [...helperClasses.data[targetSection.helpClass.blockId], helpClassData]});
        }
    
        targetSection.cardStyle =  {
            backgroundColor: cardColor,
            color: '#FFFFFF',
            cursor: 'pointer'
        };
        
        setFilterValue('');
        
        // Actualización del objeto con las asignaturas/secciones seleccionadas
        selectedSubjects.updater({...selectedSubjects.data, [targetSection.blockId]: [...selectedSubjects.data[targetSection.blockId], targetSection]});

        if (sectionsCollision(targetSection, selectedSubjects.data[targetSection.blockId])) {
            console.log('COLISIÓN');
            NotificationManager.error(
                'Has seleccionado una asignatura que produce un tope de horario.',
                '¡Cuidado!',
                2500
            );
        }

    };

    return <>
    
        <NotificationContainer/>

        <Card style={mainStyles.card}>
            <Card.Header style={mainStyles.cardHeader}>
                <div className="text-center">Selección de asignatura y sección</div>
            </Card.Header>
            <Card.Body>
                Selecciona algunas de las secciones a continuación para poder simular tu nuevo horario.
                
                <ListGroup style={availableSections.data.length ? {overflowY: 'scroll', maxHeight: '500px'} : null} className="mt-2" defaultActiveKey="#link1">
                    {availableSections.data.length ?  
                        <div>
                            <InputGroup className="mt-3">
                                <InputGroup.Text id="basic-addon1">Buscar por</InputGroup.Text>
                                <FormControl value={filterValue} onChange={filterSubjects} />
                            </InputGroup>

                            {availableSections.data.map((section, index) => {
                                if (!section.visible) {
                                    return <></>;
                                }
                                return [
                                    <ListGroup.Item onClick={() => selectSubject(section.id)} className="mt-3" variant="warning" key={'section-selection-item-' + index} action>
                                        <div>
                                            <div className="fw-bold">{subjects[section.subjectId].name}</div>
                                            Profesor: {section.teacher} <br/>
                                            <small>{subjects[section.subjectId].code} - Sección {section.code}</small> <br/>
                                            Horario: <strong>{blocks[section.blockId.toString()].startTime} - {blocks[section.blockId.toString()].endTime}</strong> <br/>
                                            Días: {section.days.map((day, dayIndex) => {
                                                if (dayIndex + 1 === section.days.length) {
                                                    return days[parseInt(day) - 1];
                                                }
        
                                                return days[parseInt(day) - 1] + ' / ';
                                            })}
        
                                            {section.helpClass ? 
                                                <>
                                                    <br/>
                                                    <hr/>
                                                    Ayudante: {section.helpClass.helper} <br/>
                                                    Horario: <strong>{blocks[section.helpClass.blockId].startTime} - {blocks[section.helpClass.blockId].endTime}</strong> <br/>
                                                    Días: {section.helpClass.days.map((day, dayIndex) => {
        
                                                        if (section.helpClass.days.length === 1 || dayIndex + 1 === section.days.length) {
                                                            return days[parseInt(day) - 1];
                                                        }
        
                                                        return days[parseInt(day) - 1] + ' / ';
                                                    })}
                                                </>
                                            : <p className="text-muted">* Esta sección no tiene ayudantía.</p>}
        
                                        </div>
                                    </ListGroup.Item>
                                ]
                            })}

                        </div>
                    : 
                        <Alert variant="warning">
                            No existen más asignaturas disponibles.
                        </Alert>
                    }
                </ListGroup>
                
                
            </Card.Body>
        </Card>


        <SelectedSections />

    </>
}