import { DataSource } from "typeorm"
import { Product_Categories } from "../entity/Product_Categories"

export default class CreateProductCategorySeeds {

    public async run (dataSource: DataSource):Promise<void>{
        console.log("Iniciando o seed para a tabela 'product_categories'.");

        
        const productCategoryRepository = dataSource.getRepository(Product_Categories);

        const existingCount = await productCategoryRepository.count();

        if(existingCount > 0){
            console.log("A tabela 'categorias' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const product_categories = [
            {name: "Eletrônico"},
            {name: "Papelaria"},
            {name: "Esportes"}
        ]
        
        await productCategoryRepository.save(product_categories);

        console.log("Seed concluido com sucesso: categorias de produto cadastradas!")

    }

}