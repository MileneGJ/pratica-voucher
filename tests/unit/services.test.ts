import {faker} from '@faker-js/faker'
import voucherRepository from '../../src/repositories/voucherRepository'
import voucherService from '../../src/services/voucherService'
import { createScenarioOneVoucher } from '../factories/scenarioFactory'
import voucherFactory from '../factories/voucherFactory'

describe('Testing createVoucher',()=>{

    it('Create new voucher when code is not in the database',async()=>{
        const {code,discount} = await voucherFactory()

        const spy1 = jest.spyOn(voucherRepository,'getVoucherByCode').mockResolvedValue(undefined)
        const spy2 = jest.spyOn(voucherRepository,'createVoucher').mockResolvedValue({code,discount,id:1,used:false})

        const result = voucherService.createVoucher(code,discount)

        expect(result).resolves.toEqual(undefined)
        expect(spy1).toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()
    })

    it('Throw error 409 when voucher code already exists in database',async()=>{
        const {code,discount} = await voucherFactory()
        const expectedError = {type:'conflict', message:'Voucher already exist.'}

        const spy1 = jest.spyOn(voucherRepository,'getVoucherByCode').mockResolvedValue({code,discount,id:1,used:false})
        const spy2 = jest.spyOn(voucherRepository,'createVoucher').mockResolvedValue(undefined)

        const result = voucherService.createVoucher(code,discount)

        expect(result).rejects.toEqual(expectedError)
        expect(spy1).toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()

    })

})

describe('Testing applyVoucher',()=>{

    it('Returns information when voucher exists',async()=>{
        const voucher = await createScenarioOneVoucher()
        const amount = faker.datatype.number({min:100})
        const finalAmount = amount - amount * (voucher.discount / 100)
        const expectedReturn = {
            amount,
            finalAmount,
            discount:voucher.discount,
            applied: finalAmount !== amount
        };

        const spy1 = jest.spyOn(voucherRepository,'getVoucherByCode').mockResolvedValue(voucher)
        const spy2 = jest.spyOn(voucherRepository,'useVoucher').mockResolvedValue(undefined)

        const result = voucherService.applyVoucher(voucher.code,amount)

        expect(result).resolves.toEqual(expectedReturn)
        expect(spy1).toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()
    })

    it('Throw error 409 when voucher code do not exist in database',async()=>{
        const voucher = await createScenarioOneVoucher()
        const amount = faker.datatype.number({min:100})
        const expectedError = {type:'conflict', message:'Voucher does not exist.'}

        const spy1 = jest.spyOn(voucherRepository,'getVoucherByCode').mockResolvedValue(undefined)
        const spy2 = jest.spyOn(voucherRepository,'useVoucher').mockResolvedValue(undefined)

        const result = voucherService.applyVoucher(voucher.code,amount)

        expect(result).rejects.toEqual(expectedError)
        expect(spy1).toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()
    })
})