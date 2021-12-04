/* Verificaciones de las asignaturas / ayudantías seleccionadas */

/* Permite determinar si existe o no colisión de asignaturas/secciones para un mismo horario.
   Se recibe una lista, que corresponde a las asignaturas configuradas para un bloque de horario específico
   independiente del día de las cátedras.
*/
const sectionsCollision = (targetSection, sectionList) => {
    let collisions = false;

    sectionList.every((section) => {
        if (section.id !== targetSection.id) {
            // Corresponde a una asignatura distinta a la que se está evaluando

            // Se obtiene una lista con la coincidencia de días de cátedras entre ambas secciones
            const sectionsMatchDays = section.days.filter((day) => targetSection.days.includes(day));

            if (section.helpClass && targetSection.helpClass) {
                const helpSectionsMatchDays = section.helpClass.days.filter((day) => targetSection.helpClass.days.includes(day));

                if (helpSectionsMatchDays.length) {
                    collisions = true;
                    return false;
                }

            }

            if (sectionsMatchDays.length) {
                collisions = true;
                return false; // every() requiere un valor false para hacer un break
            }

        }

    });

    return collisions;
}



export {
    sectionsCollision
};