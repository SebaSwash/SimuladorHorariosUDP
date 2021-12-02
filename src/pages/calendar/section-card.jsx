import {useState, useContext} from 'react';
import {Card, Modal, Button, Badge} from 'react-bootstrap';

import mainStyles from '../../styles/main';

import { SubjectsContext, HelperClassesContext, AvailableSectionsContext} from '../../App';

// Importación de datos
import blocks from '../../data/blocks.json';
import sections from '../../data/sections.json';
import subjects from '../../data/subjects.json';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const SectionOptionsModal = (props) => {
    const {section} = props;
    const subject = subjects[section.subjectId];
    const selectedSubjects = useContext(SubjectsContext);
    const selectedHelperClasses = useContext(HelperClassesContext);
    const availableSections = useContext(AvailableSectionsContext);

    /* Evento para remover una asignatura/sección seleccionada del calendario
       y volver a dejarla en la lista de asignaturas disponibles
    */
    const removeSection = () => {
        /* Se filtran las secciones de la lista de secciones seleccionadas que sean distintas 
        a la sección a remover y que están dentro de la mimsa lista (mismo bloque) */
        let blockList = selectedSubjects.data[section.blockId].filter((currentSection) => currentSection.id !== section.id);

        // Se actualizan las secciones seleccionadas en el objeto de bloques
        selectedSubjects.updater({
            ...selectedSubjects.data,
            [section.blockId]: blockList
        });

        /* Se realiza el mismo filtrado para las ayudantías (en caso de que la sección tenga) */
        if (section.helpClass) {
            let blockList = selectedHelperClasses.data[section.helpClass.blockId].filter((currentHelpClass) => currentHelpClass.sectionId !== section.id);

            // Se actualizan las ayudantías dentro del objeto de bloques
            selectedHelperClasses.updater({
                ...selectedHelperClasses.data,
                [section.helpClass.blockId]: blockList
            });
        }

        // Se actualizan las asignaturas disponibles, agregando la nueva
        availableSections.updater([...availableSections.data, section]);
    };

    return <>
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header style={mainStyles.modalHeader} closeButton>
                <Modal.Title>
                    {subject.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Profesor: {section.teacher}</h5>
                <p>{subject.code} (Sección {section.code})</p>
                <p>Bloque de cátedra: <strong>{blocks[section.blockId].startTime} - {blocks[section.blockId].endTime}</strong></p>
                <p>Días de cátedra: <strong>{section.days.map((dayIndex, index) => {
                    if (index + 1 === section.days.length) {
                        return <>
                            {days[parseInt(dayIndex) - 1]}
                        </>
                    }
                    return <>{days[parseInt(dayIndex) - 1] + ' - '}</>
                })}</strong></p>

                {section.helpClass ? <>
                    <hr />
                    <h6>Ayudante: {section.helpClass.helper}</h6>
                    <p>Bloque de ayudantía: <strong>{blocks[section.helpClass.blockId].startTime} - {blocks[section.helpClass.blockId].endTime}</strong></p>
                    <p>Días de ayudantía: <strong>{section.helpClass.days.map((dayIndex, index) => {
                        if (index + 1 === section.helpClass.days.length) {
                            return <>
                                {days[parseInt(dayIndex) - 1]}
                            </>
                        }
                        return <>{days[parseInt(dayIndex) - 1] + ' - '}</>
                    })}</strong></p>
                </> : null}

                <Button className="btn-danger" onClick={() => {removeSection()}}>Remover</Button>

            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-secondary" onClick={props.onHide}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    </>
}
export default function SectionCard ({section, isHelpClass}) {
    if (isHelpClass) {
        /* Se obtienen los datos completos de la sección a partir del ID de sección
        almacenado en la ayudantía */
        const sectionId = section.sectionId;

        for (let i = 0 ; i < sections.sections.length ; i++) {
            if (sections.sections[i].id === sectionId) {
                section = sections.sections[i];
                break;
            }
        }

    }

    const [optionsModalShow, setOptionsModalShow] = useState(false);
    // Se obtienen los datos según el ID de asignatura de la sección
    const subject = subjects[section.subjectId];

    return <>
        {section ? (
            <div>
                <Card onClick={() => setOptionsModalShow(true)}>
                 <Card.Body style={section.cardStyle}>
                     <Card.Title>{subject.name} (<small>{subject.code}</small>)</Card.Title>
                     {isHelpClass ? <div>
                         <Card.Subtitle>{section.helpClass.helper}</Card.Subtitle>
                         <Badge className="mt-2 text-black" bg="warning">AYUDANTÍA</Badge>
                     </div>
                     
                    : <Card.Subtitle>(Sección {section.code}) - {section.teacher}</Card.Subtitle>}
                 </Card.Body>
                </Card>

                <SectionOptionsModal
                    section={section}
                    show={optionsModalShow}
                    onHide={() => setOptionsModalShow(false)}
                />

            </div>
        ) : null}
    </>;
};