import { DataSource } from "typeorm"
import { Product_Situations } from "../entity/Product_Situations"

export default class CreateProductSituationSeeds {

    public async run (dataSource: DataSource):Promise<void>{
        console.log("Iniciando o seed para a tabela 'product_situations'.");

        
        const productSituationRepository = dataSource.getRepository(Product_Situations);

        const existingCount = await productSituationRepository.count();

        if(existingCount > 0){
            console.log("A tabela 'situations' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const product_situations = [
            {name: "Ativo"},
            {name: "inativo"},
            {name: "Pendente"}
        ]
        
        await productSituationRepository.save(product_situations);

        console.log("Seed concluido com sucesso: situações de produto cadastradas!")

    }

}