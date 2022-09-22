import prisma from "../../src/config/database";
import voucherFactory from "./voucherFactory";

export async function createScenarioOneVoucher () {
    const newVoucher = await voucherFactory()
    return await prisma.voucher.create({data:newVoucher})
}