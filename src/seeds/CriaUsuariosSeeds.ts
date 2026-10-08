import { DataSource } from "typeorm"
import { User } from "../entity/Users"
import { Situation } from "../entity/Situations"

export default class CreateUsersSeeds {

    public async run (dataSource: DataSource):Promise<void>{
        console.log("Iniciando o seed para a tabela 'users'.");

        
        const situationRepository = dataSource.getRepository(Situation);
        const userRepository = dataSource.getRepository(User);

        const existingCount = await userRepository.count();

        if(existingCount > 0){
            console.log("A tabela 'users' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const situations = await situationRepository.find();

        if (situations.length === 0) {
            console.log("A tabela 'situations' está vazia. Crie as situações antes de inserir usuários.");
            return;
        }

        const users = [
            {
                name: "Kayke Vêncio",
                email: "kayke@email.com",
                situation: situations[0]
            },
            {
                name: "Luiza Vêncio",
                email: "luiza@email.com",
                situation: situations[2] || situations[0]
            },
            {
                name: "Sidine Vêncio",
                email: "sidine@email.com",
                situation: situations[1] || situations[0]
            }
        ]
        
        await userRepository.save(users);

        console.log("Seed concluido com sucesso: usuários cadastrados!")

    }

}