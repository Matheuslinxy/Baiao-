import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Usuario } from "./Usuario";

@Entity("situations")
export class Situacao {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    nameSituation!: string;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;

    @OneToMany(() => Usuario, (usuario) => usuario.situation)
    users!: Usuario[];
}