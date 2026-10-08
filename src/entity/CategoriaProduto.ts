import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Produto } from "./Produto";

@Entity("product_categories")
export class CategoriaProduto {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    name!: string;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;

    @OneToMany(() => Produto, (produto) => produto.productCategory)
    products!: Produto[];
}