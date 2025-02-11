-- CreateTable
CREATE TABLE "matricula" (
    "id" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "id_materia" INTEGER NOT NULL,
    "semestre" TEXT NOT NULL,
    "nota_final" DOUBLE PRECISION,
    "cupo_asignado" BOOLEAN NOT NULL,

    CONSTRAINT "matricula_pkey" PRIMARY KEY ("id")
);
