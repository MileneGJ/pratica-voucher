import { faker } from "@faker-js/faker";

export default async function voucherFactory(){
    return {
        code: faker.internet.password(),
        discount: faker.datatype.number({min:1,max:100})
    }
}