export class Matricula {
    id: number;
    id_estudiante: number;
    id_materia: number;
    semestre: string;
    nota_final:  number | null; // <-- Permitir `null`
    cupo_asignado: boolean;
  }
  