import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Situacao } from "./Situacao";

@Entity("users")
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({unique: true})
    email!: string;

    @ManyToOne(() => Situacao, (situacao) => situacao.users)
    @JoinColumn({ name: "situationId" })
    situation!: Situacao;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;
}