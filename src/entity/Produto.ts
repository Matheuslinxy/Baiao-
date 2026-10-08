import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { SituacaoProduto } from "./SituacaoProduto";
import { CategoriaProduto } from "./CategoriaProduto";

@Entity("products")
export class Produto {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(() => SituacaoProduto, (situacaoProduto) => situacaoProduto.products)
    @JoinColumn({ name: "situationId" })
    productSituation!: SituacaoProduto;

    @ManyToOne(() => CategoriaProduto, (categoriaProduto) => categoriaProduto.products)
    @JoinColumn({ name: "categoryId" })
    productCategory!: CategoriaProduto;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;
}