//Chai supertest - route products.

import chai from 'chai';
import mongoose from 'mongoose';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8000');

describe('Testing products routes', () => {
    const productTest = {
        title: 'test product',
        description: 'test description',
        price: 100,
        code: 'test code',
        status: true,
        category: 'test category',
        stock: 10,
        thumbnail: 'test thumbnail'
    };

    before(async function () {
        try {
            await mongoose.connect('mongodb://localhost:27017/test');
            await mongoose.connection.dropCollection('products');
        } catch(err) {
            console.error(err.message);
        }
    });

    describe('Testing products', () => {
        it('POST - /api/products - Debe crear un producto', async function() {
            const { statusCode, ok, body } = await requester.post('/api/products').send(productTest);

            expect(statusCode).to.eql(200);
            expect(ok).to.eql(true);
            expect(body).to.be.an('object');

            console.log(body)
        });

        it('POST - /api/products - campo vacío retornar error', async function() {
            const data = { ...productTest, title: '' };
            const { statusCode } = await requester.post('/api/products').send(data);
            expect(statusCode).to.eql(400);
        });

        it('GET - /api/products - Debe retornar un array de productos', async function() {
            const { statusCode, ok, body } = await requester.get('/api/products');

            expect(statusCode).to.eql(200);
            expect(ok).to.eql(true);
            expect(body).to.be.an('array');
        });

        it('GET - /api/products/:pid - Retornar producto por id', async function() {
            const resp = await requester.get('/api/products');
            const { statusCode, ok, body } = await requester.get(`/api/products/${resp.body[0]._id}`);

            expect(statusCode).to.eql(200);
            expect(ok).to.eql(true);

            console.log(body)
        });

        it('PUT - /api/products/:pid - Debe actualizar producto', async function() {
            const resp = await requester.get('/api/products');
            const productUpdated = { ...productTest, title: 'test update' };

            const { statusCode, ok, body } = await requester.put(`/api/products/${resp.body[0]._id}`).send(productUpdated);

            expect(statusCode).to.eql(200);
            expect(ok).to.eql(true);
            
            console.log(body)
        });

        it('DELETE - /api/products/:pid - Debe borrar producto', async function() {
            const resp = await requester.get('/api/products');
            const { statusCode, ok, body } = await requester.delete(`/api/products/${resp.body[0]._id}`);

            expect(statusCode).to.eql(200);
            expect(ok).to.eql(true);

            console.log(body)
        })
    });

    after(async function () {
        try {
            await mongoose.disconnect()
        } catch(err) {
            console.error(err.message);
        }
    })
})
