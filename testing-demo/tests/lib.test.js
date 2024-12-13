const lib = require('../lib');
const db = require('../db');
const mail = require('../mail');

describe('absolute', () => {
    it('should return a positive number if input is positive', () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });

    it('should return a positive number if input is negative', () => {
        const result = lib.absolute(-1);
        expect(result).toBe(1);
    });

    it('should return 0 if input is 0', () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
});

describe('greet', () => {
    it('should return the greeting mesage', () => {
        const result = lib.greet('Mosh');
        expect(result).toBe('Welcome Mosh'); // to specific
        expect(result).toMatch(/Mosh/); // has mosh
        expect(result).toContain('Mosh'); // has mosh
    });
});

describe('getCurrencis', () => {
    it('should return supported currencies', () => {
        const result = lib.getCurrencies();

        // // too general
        // expect(result).toBeDefined();
        // expect(result).not.toBeNull();

        // // too specific
        // expect(result[0]).toBe('USD');
        // expect(result[1]).toBe('AUD');
        // expect(result[2]).toBe('EUR');
        // expect(result.length).toBe(3);

        // // proper way
        // expect(result).toContain('USD');
        // expect(result).toContain('AUD');
        // expect(result).toContain('EUR');

        // ideal way
        expect(result).toEqual(expect.arrayContaining(['EUR', 'USD', 'AUD']));
    });
});

describe('getProduct', () => {
    it('should return the product with the given id', () => {
        const result = lib.getProduct(1);
        // expect(result).toEqual({ id: 1, price: 10 }); // will fail when there is more than 2 fields returned
        expect(result).toMatchObject({ id: 1, price: 10 }); // as long as it has these 2 fields

        expect(result).toHaveProperty('id', 1); // since id is number, will fail if change id's value to string '1'
    });
});

describe('registerUser', () => {
    it('should throw if username is falsy', () => {
        // Null, undefined, NaN, '', 0, false
        const args = [null, undefined, NaN, '', 0, false];
        args.forEach(a => {
            expect(() => { lib.registerUser(a) }).toThrow();
        });
    });

    it('should return a user object if valid username is passed', () => {
        const result = lib.registerUser('mosh');
        expect(result).toMatchObject({ username: 'mosh' });
        expect(result.id).toBeGreaterThan(0);
    })
});

describe('applyDiscount', () => {
    it('should apply 10% discunt if customer has more than 10 points', () => {
        db.getCustomerSync = function(customerId) {
            console.log('fake reading customer...');
            return { id: customerId, points: 20 };
        }
        const order = { customerId: 1, totalPrice: 10 };
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);
    });
});

describe('notifyCustomer', () => {
    it('should send an email to the customer', () => {

        // const mockFunction = jest.fn();
        // mockFunction.mockReturnValue(1);
        // const result = mockFunction();
        // mockFunction.mockResolvedValue(1);
        // mockFunction.mockRejectedValue(new Error('...'));
        // const result2 = await mockFunction();

        db.getCustomerSync = jest.fn().mockReturnValue( { email: 'a' });
        mail.send = jest.fn();
        let mailSent = false;

        lib.notifyCustomer({ customerId: 1 });

        expect(mail.send).toHaveBeenCalled();
        expect(mail.send.mock.calls[0][0]).toMatch('a');
        expect(mail.send.mock.calls[0][1]).toMatch(/order/);
    });
});